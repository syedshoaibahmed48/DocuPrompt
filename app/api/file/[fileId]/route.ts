import { NextRequest, NextResponse } from "next/server";

import { deleteFileById, getFileById, getTotalPromptsUsedByUser, getUserType } from "@/lib/mongodbClient";
import { deleteFileFromFirebase, getFileBufferAndDetails } from "@/lib/firebaseClient";
import { deleteDocumentFromVectorStore } from "@/lib/pineconeClient";
import limits from "@/assets/json/user_limits.json";
import { getFileContent } from "@/lib/FileUtils";

export async function GET(request: NextRequest, { params }: { params: { fileId : string }}){
  try {
    //get userId from request headers
    const userId = request.headers.get('user-id');

    //get fileid from params
    const { fileId } = params;

    //validate file
    if(!fileId) return NextResponse.json({ errorCode: "FileId parameter missing" }, { status: 400 });

    //get fileMetadata from DB and check if user is owner of the file
    const fileMetadata = await getFileById(fileId);
    if(!fileMetadata) return NextResponse.json({ errorCode: "FILE_NOT_FOUND" }, { status: 404 }); 
    const {userId: fileOwnerId, name: filename, chat} = fileMetadata;
    if( fileOwnerId !== userId ) return NextResponse.json({ errorCode: "FILE_ACCESS_DENIED" }, { status: 403 });

    const promptsUsed = await getTotalPromptsUsedByUser(userId!);

    //get file buffer from firebase
    const { buffer, type } = await getFileBufferAndDetails(userId!, filename);

    const fileContent = await getFileContent(buffer, type!);

    return NextResponse.json({ 
      name: filename,
      type,
      fileContent,
      promptsUsed,
      maxPrompts: limits.usageLimits[(await getUserType(userId!)) as keyof typeof limits.usageLimits].maxPrompts,
      chat
     }, { status: 200 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { fileId : string }}){
  try {
    //get userId from request headers
    const userId = request.headers.get('user-id');
    const userType = request.headers.get('user-type');

    if(userType === 'demo') return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 403 });

    //get fileid from params
    const { fileId } = params;
  
    //validate fileid
    if(!fileId) return NextResponse.json({ errorCode: "FileId parameter missing" }, { status: 400 });
  
    //get fileMetadata from DB, check if user is owner of the file, if isOwner then delete the DB record
    const {userId: fileOwnerId, name: filename} = await getFileById(fileId);
    if(userId !== fileOwnerId) NextResponse.json({ errorCode: "UNAUTHORIZED_FILE_ACCESS" }, { status: 403 });
    await deleteFileById(fileId);
    
    //delete file from firebase
    await deleteFileFromFirebase(userId!, filename);

    //delete file documents from vector db
    await deleteDocumentFromVectorStore(fileId);
   
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}