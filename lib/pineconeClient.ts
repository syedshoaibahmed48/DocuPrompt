import { embeddingsModel } from "@/configs/openai.config";
import { getVectorStore, pineconeIndex } from "@/configs/pinecone.config";
import { TextChunk } from "@/models/app-interfaces";
import { PineconeStore } from "@langchain/pinecone";

export async function getPineconeStorageUsageStats() {
    const { totalRecordCount, namespaces } = await pineconeIndex.describeIndexStats();
    return { totalRecordCount, namespacesCount: namespaces ? Object.keys(namespaces).length : 0 }
}

export async function embedAndStoreDocuments(documents: TextChunk[], fileId: string) {
    await PineconeStore.fromDocuments(documents, embeddingsModel, {
        pineconeIndex,
        maxConcurrency: 5,
        namespace: fileId
    });
}

export async function getSimiliarDocuments(prompt: string, fileId: string) {
    const vectorStore = await getVectorStore(fileId);
    return await vectorStore.similaritySearch(prompt, 3);
}

export async function deleteDocumentFromVectorStore(fileId: string) {
    const vectorStore = await getVectorStore(fileId);
    return await vectorStore.delete({ deleteAll: true });
}