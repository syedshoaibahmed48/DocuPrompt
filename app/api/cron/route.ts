import { deleteFilesFromFirebase } from "@/lib/firebaseClient";
import { deleteFileMetaDatas, getAllDemoUserFiles, resetPromptsUsed } from "@/lib/mongodbClient";
import { deleteNamespaces } from "@/lib/pineconeClient";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        //for demo users: delete file data from mongo, firebase, and pinecone
        const demoUserFiles = await getAllDemoUserFiles();
        const demoUserFileIds = demoUserFiles.map(file => file.fileId.toString());

        //pinecone
        await deleteNamespaces(demoUserFileIds);
        //firebase
        await deleteFilesFromFirebase(demoUserFiles.map(file => ({
            filename: file.filename,
            userId: file.userId
        })));
        //mongo
        await deleteFileMetaDatas(demoUserFileIds);

        //for standard and admin users: reset promptsUsed field in FileMetaData to 0 
        await resetPromptsUsed();    

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}