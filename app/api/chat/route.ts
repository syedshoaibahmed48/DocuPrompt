import { NextRequest, NextResponse } from "next/server";
import { getContextualPrompt, getLlmChatResponse, getOptimizedPrompt } from "@/lib/langchainUtils";
import { getSimiliarDocuments } from "@/lib/pineconeClient";
import { getFileById, getTotalPromptsUsedByUser, updateChat } from "@/lib/mongodbClient";
import user_limits from '@/assets/json/user_limits.json';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('user-id');
        const userType = request.headers.get('user-type');
        const userPromptsLimit = user_limits.usageLimits[userType as keyof typeof user_limits.usageLimits].maxPrompts;

        const { chat, fileId } = await request.json();
        const { name: filename } = await getFileById(fileId);

        const totalPromptsUsed = await getTotalPromptsUsedByUser(userId!);

        if( totalPromptsUsed >= userPromptsLimit) return NextResponse.json({ errorCode: "PROMPTS_LIMIT_REACHED" },{ status: 500 });

        //Preprocess users latest prompt
        const prompt = chat[chat.length - 1].content.toLowerCase().trim();
        const optimizedPrompt = await getOptimizedPrompt(prompt);
 
        //Get similar documents from vector database
        const similarDocuments = await getSimiliarDocuments(optimizedPrompt, fileId);

        //Create a contextual and instructive prompt for the AI
        const contextualPrompt = await getContextualPrompt(filename, prompt, similarDocuments[0].pageContent, similarDocuments[1].pageContent, similarDocuments[2].pageContent);

        //Send the contextual prompt to the AI
        const llmChatResponse =  await getLlmChatResponse(chat, contextualPrompt);

        //update conversation history and save in db
        chat.push({ role: 'assistant', content: llmChatResponse}); 
        await updateChat(fileId, chat);

        return NextResponse.json({ chat: chat, contextLinesRange: [similarDocuments[0].metadata['loc.lines.from'], similarDocuments[0].metadata['loc.lines.to']] },{ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "LLM_RESPONSE_ERROR" },{ status: 500 });
    }
}