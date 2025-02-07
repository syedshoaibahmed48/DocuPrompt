import { storage } from "@/configs/firebase.config";
import { FileDetails } from "@/models/app-interfaces";
import { deleteObject, getBytes, getMetadata, listAll, ref } from "@firebase/storage";
import { Buffer } from "buffer";

export async function getFileBufferAndDetails(userId: string, filename: string) {
    const firebaseFilePath = `${process.env.FIREBASE_STORAGE_DIR}/${userId}/${filename}`
    const fileStorageRef = ref(storage, firebaseFilePath);
    const { contentType: type } = await getMetadata(fileStorageRef);
    const fileBytes = await getBytes(fileStorageRef);
    const buffer = Buffer.from(fileBytes);
    return { buffer, type };
}

export async function deleteFileFromFirebase(userId: string, filename: string) {
    const fileStorageRef = ref(storage, `${process.env.FIREBASE_STORAGE_DIR}/${userId}/${filename}`);
    try {
        await deleteObject(fileStorageRef);
    } catch (error) {
        console.error(`Failed to delete file ${filename} for user ${userId}:`, error);
    }
}

export async function deleteFilesFromFirebase(files: FileDetails[]) {
    for (const file of files) {
        const { userId, filename } = file;
        const fileStorageRef = ref(storage, `${process.env.FIREBASE_STORAGE_DIR}/${userId}/${filename}`);
        try {
            await deleteObject(fileStorageRef);
        } catch (error) {
            console.error(`Failed to delete file ${filename} for user ${userId}:`, error);
        }
    }
}

export async function getFirebaseStorageUsageStats() {

    const mainDirRef = ref(storage, `${process.env.FIREBASE_STORAGE_DIR}`)

    //get all dirs in the main Dir
    const userDirsRefList = (await listAll(mainDirRef)).prefixes

    // Process each dir in parallel
    const folderSizePromises = userDirsRefList.map(async (userDirRef) => {
        const userFilesList = (await listAll(userDirRef)).items;

        // Get all file sizes in parallel
        const sizePromises = userFilesList.map(async (fileRef) => {
            const metadata = await getMetadata(fileRef);
            return metadata.size; // File size in bytes
        });

        const sizes = await Promise.all(sizePromises);
        return sizes.reduce((acc, size) => acc + size, 0);
    });

    // Wait for all folder size calculations to complete
    const folderSizes = await Promise.all(folderSizePromises);
    return  folderSizes.reduce((acc, size) => acc + size, 0);
}