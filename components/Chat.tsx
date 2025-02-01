"use client"

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { LoaderCircle, Send, User, Bot, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LLMChatMessage } from '@/models/app-interfaces'
import error_codes from "@/assets/json/error_codes.json";

export default function Chat({ chat, responseLoading, getLlmResponse, error }: { chat: LLMChatMessage[], responseLoading: boolean, getLlmResponse: (updatedChat: LLMChatMessage[]) => Promise<void>, error: string }) {
    const [prompt, setPrompt] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [chat])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';;
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;;
        }
    }, [prompt])

    const handleSend = async () => {
        const updatedChat: LLMChatMessage[] = [...chat, { role: 'user', content: prompt }];
        getLlmResponse(updatedChat);
        setPrompt('');
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex flex-col h-full bg-neutral-900">
            <div className="flex-grow overflow-auto p-4">
                {chat.map((message, index) => (
                    <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start max-w-[80%] space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                            <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-neutral-700' : 'bg-neutral-800'}`}>
                                {message.role === 'user' ? (
                                    <User className="h-6 w-6 text-neutral-200" />
                                ) : (
                                    <Bot className="h-6 w-6 text-neutral-200" />
                                )}
                            </div>
                            <div className={`p-3 rounded-lg inline-block break-words whitespace-pre-wrap ${message.role === 'user' ? 'bg-neutral-700 text-neutral-50' : 'bg-neutral-800 text-neutral-100'}`}>
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}
                {responseLoading && (
                    <div className="mb-4 flex justify-start">
                        <div className="flex items-start space-x-2">
                            <div className="p-2 rounded-full bg-neutral-800">
                                <Bot className="h-5 w-5 text-neutral-200" />
                            </div>
                            <div className="p-3 rounded-lg bg-neutral-800 text-neutral-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="px-2 py-6 bg-neutral-900">
                {error === "LLM_RESPONSE_ERROR" || error === "PROMPTS_LIMIT_REACHED" ? (
                  <div className="mb-4 p-4 bg-red-900 text-red-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                        {error_codes[error].title}
                    </h3>
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>{error_codes[error].message}</p>
                    </div>
                  </div>
                ) : (
                <div className="flex space-x-2 max-w-4xl mx-auto">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow max-h-36 bg-neutral-700 text-neutral-300 border-neutral-600 focus:border-neutral-500 placeholder-neutral-400 min-h-[2.5rem] resize-none overflow-auto"
                        rows={1}
                    />
                    <Button onClick={handleSend} className="bg-neutral-700 hover:bg-neutral-500 text-neutral-100 h-auto" disabled={responseLoading || !prompt.trim()}>
                        {responseLoading ? (<LoaderCircle className="h-6 w-6 animate-spin" />) : (<Send className="h-4 w-4" />)}
                    </Button>
                </div>
                )}
            </div>
        </div>
    )
}