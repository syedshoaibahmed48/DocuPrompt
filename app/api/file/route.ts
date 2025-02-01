import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/configs/firebase.config";
import { ref, uploadBytes } from "firebase/storage";
import  appConstants  from "@/assets/json/user_limits.json"
import { extractTextFromFile, formattedTodaysDate } from "@/lib/FileUtils"
import { connectWithMongoDB } from "@/configs/mongodb.config";
import { TextChunk } from "@/models/app-interfaces";
import { splitText2Chunks } from "@/lib/langchainUtils";
import { embedAndStoreDocuments } from "@/lib/pineconeClient";
import { saveFile } from "@/lib/mongodbClient";

connectWithMongoDB();

export async function POST(request: NextRequest){
  try {
    //get userId from request headers
    const userId = request.headers.get('user-id');

    //verify file
    const file  = (await request.formData()).get('file') as unknown as File | undefined;//type casting to explicitly treat file as a File type.
    if(!file) return NextResponse.json({ errorCode: "NO_FILE_IN_PAYLOAD" }, { status: 400 });
    else if(file.size>appConstants.MAX_FILE_SIZE) return NextResponse.json({ errorCode: "FILE_TOO_LARGE" }, { status: 413 });

    //extract text from file
    const extractedText = await extractTextFromFile(file);
    if(!extractedText || extractedText.trim().length===0) return NextResponse.json({errorCode: "TEXT_EXTRACTION_FAILED"}, { status: 400 });

    //store file in firebase
    const firebaseFilePath = `${process.env.FIREBASE_STORAGE_DIR}/${userId}/${file.name}`;
    const fileStorageRef = ref(storage, firebaseFilePath);
    await uploadBytes(fileStorageRef, file);

    //store metadata in DB
    const uploadDate = formattedTodaysDate();
    const savedFileMetadata = await saveFile(userId!, file.name, file.type, file.size, uploadDate);

    //Chunk Extracted Text as documents and store in vector db
    const documents = await splitText2Chunks(extractedText) as TextChunk[];
    await embedAndStoreDocuments(documents, savedFileMetadata._id.toString());

    //return file metadata
    return NextResponse.json({ success: true }, {status: 200});
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}