"use client"

import { FileText, MessageSquare } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import FileViewer from "@/components/FileViewer"
import Chat from "@/components/Chat"
import { FileMetaData, LLMChatMessage } from "@/models/app-interfaces"
import { getFileDataAndChat, sendChat } from "@/lib/apiClient"
import { calcStatPercentage } from "@/lib/FileMetaDataUtils"
import { AlertCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import error_codes from "@/assets/json/error_codes.json";
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

export default function ChatPage() {

  const { fileId }: { fileId: string } = useParams();

  const [fileViewSectionWidth, setFileViewSectionWidth] = useState<number>(50);
  const [chat, setChat] = useState<LLMChatMessage[]>([]);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [chatSectionWidth, setChatSectionWidth] = useState<number>(50);
  const [contextLinesRange, setContextLinesRange] = useState<number[]>([]);
  const [fileMetaData, setFileMetaData] = useState<FileMetaData>({
    name: "File",
    type: "",
    fileContent: "",
    promptsUsed: 0,
    maxPrompts: 1
  });
  const [error, setError] = useState<string>();//enum: SERVER_ERROR, FILE_ACCESS_DENIED, FILE_NOT_FOUND , LLM_RESPONSE_ERROR, PROMPTS_LIMIT_REACHED
  const isFileViewCollapsed = fileViewSectionWidth <= 20;
  const isChatSectionCollapsed = chatSectionWidth <= 20;

  const fetchFileData = async () => {
    try {
      const { name, type , fileContent, promptsUsed, maxPrompts, chat } = await getFileDataAndChat(fileId);
      setFileMetaData({
        name,
        type,
        fileContent,
        promptsUsed,
        maxPrompts,
      });
      setChat(chat);
      if(promptsUsed >= maxPrompts) throw new Error('PROMPTS_LIMIT_REACHED');
    } catch (error) {
      if(error instanceof Error) setError(error.message);
    }
  }

  const getLlmResponse = async (updatedChat: LLMChatMessage[]) => {
    try {
      setResponseLoading(true);
      setChat(updatedChat);
      const response = await sendChat(fileId, updatedChat);
      setTimeout(() => {
        setChat(response.chat);
        setContextLinesRange(response.contextLinesRange)
        setResponseLoading(false);
        setFileMetaData({
          ...fileMetaData,
          promptsUsed: fileMetaData.promptsUsed + 1
        });
      }, 1000);
      if(fileMetaData.promptsUsed + 1 >= fileMetaData.maxPrompts!) throw new Error('PROMPTS_LIMIT_REACHED');
    } catch (error) {
      if(error instanceof Error) setError(error.message);
    }
  }

  useEffect(() => {
    fetchFileData();
  }, [])

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-200">
      {/* Navbar */}
      <header className="sticky border-b px-4 top-0 w-full border-b-neutral-700 bg-background">
        <nav className="relative flex items-center justify-between w-full h-14 z-10">
          <Logo />
          {(error === "PROMPTS_LIMIT_REACHED" || !error) && <div className="flex w-2/5 justify-center items-center">
            <div className="w-full bg-neutral-700 rounded-sm h-1 mb-4">
              <div
                className="bg-neutral-400 h-full rounded-sm"
                style={{ width: `${calcStatPercentage(fileMetaData?.promptsUsed, fileMetaData?.maxPrompts || 1)}%` }}
              ></div>
              <span className="text-sm text-nowrap text-neutral-400">{`Used: ${fileMetaData?.promptsUsed} / ${fileMetaData?.maxPrompts} `}</span>
            </div>
          </div>}
          <div>
            <Link href="/files" className="btn-outline px-4 py-2 me-2">Back</Link>
          </div>
        </nav>
      </header>

      {error === "SERVER_ERROR" || error === "FILE_ACCESS_DENIED" || error === "FILE_NOT_FOUND" ? (
        <Card className="w-full max-w-lg m-auto bg-neutral-900 border-neutral-800">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="w-24 h-24 mb-6">
              <AlertCircle className="w-full h-full text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-neutral-100">{error_codes[error].title}</h2>
            <p className="text-neutral-300">{error_codes[error].message}</p>
            <Button asChild variant="outline" className="mt-4 hover:bg-white hover:text-neutral-800">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) :
        (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1"
            onLayout={(sizes) => {
              setFileViewSectionWidth(sizes[0])
              setChatSectionWidth(sizes[1])
            }}
          >
            <ResizablePanel
              defaultSize={40}
              minSize={5}
              maxSize={95}
            >
              <div className="h-full flex flex-col">
                <div className={`flex items-center p-2 ${isFileViewCollapsed ? 'h-1/5 my-auto flex-col gap-y-16' : 'justify-center'}`}>
                  <FileText className={`h-6 w-6 mr-2 ${isFileViewCollapsed && 'transform -rotate-90 hidden'}`} />
                  <h2 className={`text-xl font-semibold text-neutral-200 ${isFileViewCollapsed && 'text-nowrap transform -rotate-90'}`}>{fileMetaData.name}</h2>
                </div>
                <div className={`flex-1 overflow-auto ${isFileViewCollapsed && 'hidden'}`}>
                  <div className="h-full flex items-center justify-center text-neutral-400">
                    <FileViewer fileContent={fileMetaData?.fileContent || ''} fileType={fileMetaData?.type || ''} contextLinesRange={contextLinesRange!} />
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={60}
              minSize={5}
              maxSize={95}
            >
              <div className="h-full flex flex-col">
                <div className={`flex items-center p-2 ${isChatSectionCollapsed ? 'h-1/5 my-auto flex-col gap-y-16' : 'justify-center'}`}>
                  <MessageSquare className={`h-6 w-6 mr-2 ${isChatSectionCollapsed && 'transform rotate-90'}`} />
                  <h2 className={`text-xl font-semibold text-neutral-200 ${isChatSectionCollapsed && 'text-nowrap transform rotate-90'}`}>Chat</h2>
                </div>
                <div className={`flex-1 overflow-auto ${isChatSectionCollapsed && 'hidden'}`}>
                  <Chat chat={chat} responseLoading={responseLoading} getLlmResponse={getLlmResponse} error={error!} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )
      }
    </div>
  )
}