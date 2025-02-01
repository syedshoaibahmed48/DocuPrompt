import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

export const chatCompletionsModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3
});

export const embeddingsModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});