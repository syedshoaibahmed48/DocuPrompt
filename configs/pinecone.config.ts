import { Pinecone } from '@pinecone-database/pinecone';
import { embeddingsModel } from './openai.config';
import { PineconeStore } from '@langchain/pinecone';

export const pinecone = new Pinecone();

export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!); 

export async function getVectorStore(namespaceId: string) { // to bypass the await in the top level
    return await PineconeStore.fromExistingIndex(embeddingsModel, { pineconeIndex, namespace: namespaceId });
}