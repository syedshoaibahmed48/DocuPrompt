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

const contextualPromptTemplate = PromptTemplate.fromTemplate(`You are a specialized AI assistant focused on document analysis and information retrieval. You have been provided with relevant context from: {filename}

  Your Core Responsibilities:
  1. Answer the user's prompt provided in triple quotes using ONLY information present in the given context.
  2. If the required information is not in the document, politely inform the user.
  3. If required, cite specific sections/quotes from the document to support your answers
  4. Maintain the document's original terminology and context
  
  Guidelines for Responses:
  - Scale your response length and depth based on the prompt's complexity
  - Start with a direct answer to the user prompt
  - Use bullet points only when listing multiple items
  - Keep responses concise (1-2 paragraphs maximum)
  - Offer to clarify technical terms if they appear in the response
  
  Retrieved Context:
  {context1}
  {context2}
  {context3}
  
  User Prompt: """{prompt}""""
  
  Remember: Your knowledge is limited to the provided document. Do not introduce external information or make assumptions beyond what is explicitly stated in the context.`)

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
