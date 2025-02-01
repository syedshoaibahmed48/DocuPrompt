import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";
import { chatCompletionsModel } from "@/configs/openai.config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { LLMChatMessage } from "@/models/app-interfaces";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const stringOutputParser = new StringOutputParser();

const optimizedPromptTemplate = PromptTemplate.fromTemplate(`I want you to transform the user prompt given in triple quotes into concise phrases that are optimized for similarity search in a vector database. Your task is to 
- Remove unnecessary words, such as question starters or filler phrases, while focussing on the main topic or key concepts retaining the core meaning of the input. 
- Do not rephrase or enrich prompt.
- Simplify it to its most relevant and meaningful form.

"""{prompt}"""`);

const contextualPromptTemplate = PromptTemplate.fromTemplate(`You are an intelligent AI assistant helping users analyze and understand their uploaded documents. Below is the relevant information from the user's uploaded file: {filename}. Your task is to:
- Respond **briefly** and **directly** to the user's prompt provided in triple quotes.
- Use the given context and chat history to provide the most relevant and specific information from the file.
- Avoid generic or vague responses.
- If {filename} does not have sufficient information to answer the prompt, politely inform the user.

User: """{prompt}"""

Context:
1. {context1}
2. {context2}
3. {context3}`)

export async function splitText2Chunks(text: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  let documents = await textSplitter.createDocuments([text]);
  documents = documents.map((document) => ({
    ...document,
    metadata: { ...document.metadata },
  }));
  return documents;
}

export async function getOptimizedPrompt(prompt: string) {
  return optimizedPromptTemplate.pipe(chatCompletionsModel).pipe(stringOutputParser).invoke({ prompt });
}

export async function getContextualPrompt(filename: string, prompt: string, context1: string, context2: string, context3: string) {
  return (await contextualPromptTemplate.invoke({ filename, prompt, context1, context2, context3 })).toString();
}

export async function getLlmChatResponse(chat: LLMChatMessage[], contextualPrompt: string) {

  const formattedHistory = chat.map((message, Index) => {
    if (Index === chat.length - 1) //Set the last user prompt as system prompt with all context
      return new SystemMessage(contextualPrompt)
    else if (message.role === 'user') {
      return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
      return new AIMessage(message.content);
    } else {
      return new SystemMessage(message.content);
    }
  });

  return await ChatPromptTemplate.fromMessages(formattedHistory).pipe(chatCompletionsModel).pipe(stringOutputParser).invoke({});
}
