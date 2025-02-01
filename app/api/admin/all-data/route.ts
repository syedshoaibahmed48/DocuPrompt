import { getFirebaseStorageUsageStats } from "@/lib/firebaseClient";
import { getAllStandardAccessRequests, getAllUsers, getUsersAggregatedByType } from "@/lib/mongodbClient";
import { getPineconeStorageUsageStats } from "@/lib/pineconeClient";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const usersList = await getAllUsers();
        const usersAggregatedByType = await getUsersAggregatedByType();
        const accessRequests = await getAllStandardAccessRequests();
        const openAiUsage = {// hard coding for now
            totalTokensUsed: 45231,
            chatCompletions: 30000,
            embeddings: 15231
        }
        const firebaseUsageStats = {
            storageUsed: await getFirebaseStorageUsageStats(),
            storageLimit: 1073741824
        }
        const pineconeUsageStats = await getPineconeStorageUsageStats();

        return NextResponse.json({ usersList, usersAggregatedByType, accessRequests, openAiUsage, firebaseUsageStats, pineconeUsageStats }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}