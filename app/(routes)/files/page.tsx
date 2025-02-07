"use client";

import { useState, useRef, useEffect } from "react";
import { FileMetaData, UsageStats } from "@/models/app-interfaces";
import UsageStatsCards from "@/components/UsageStatCards";
import UploadedFilesTable from "@/components/UploadedFilesTable";
import limits from "@/assets/json/user_limits.json"
import { deleteFile, getUserDetailsAndUsageStats, signout, uploadFile } from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Toast from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/utils";
import Logo from "@/components/Logo";

export default function FileUploadPage() {
  const [usageStats, setUsageStats] = useState<UsageStats>({
    filesUploaded: 0,
    maxFiles: 1,
    promptsUsed: 0,
    maxPrompts: 1,
    storageUsed: 0,
    maxStorage: 1,
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileMetaData[]>([]);
  const [userType, setUserType] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  function handleAddNewFile() {
    if (uploadedFiles.length === usageStats.maxFiles) alert("You have reached your file upload limit. Please remove a file to upload a new one.");
    else if (usageStats.storageUsed === usageStats.maxStorage) alert("Your storage limit is filled. Please free up some space to upload new files.");
    else fileInputRef.current?.click();
  }

  async function getUserDetails() {
    try {
      const { usageStats, files, userType } = await getUserDetailsAndUsageStats();
      setUsageStats(usageStats);
      setUploadedFiles(files);
      setUserType(userType);
    } catch (error) {
      if (error instanceof Error) toast.error(getErrorMessage(error.message));
    }
  }

  async function handleFileUploadEvent(event: React.ChangeEvent<HTMLInputElement>) {
    const newFile = event.target.files?.[0] as File;
    event.target.value = '';//clear file upload component
    if (!newFile) return;
    else if (newFile.size > limits.MAX_FILE_SIZE) { // if file exceeds limit
      toast.error("File size exceeds limit of 30 MB");
      return;
    }
    else if (uploadedFiles.reduce((sum, file) => sum + file.size!, 0) + newFile.size > usageStats.maxStorage) toast.error("The file size, combined with your existing files, exceeds your storage limit. Please free up space or choose a smaller file.");
    else if (uploadedFiles.some((file) => { return file.name === newFile.name && file.type === newFile.type })) toast.error("File with the same name and type already uploaded");
    else {
      try {//uploading file
        const response = await uploadFile(newFile);
        if (response.success) await getUserDetails();
        toast.success("File uploaded");
      } catch (error) {
        if(error instanceof Error) toast.error(getErrorMessage(error.message));
      }
    }
  }

  async function handleDeleteFile(fileId: string) {
    try {
      const response = await deleteFile(fileId);
      if (response.success) await getUserDetails();
      toast.success("File deleted");
    } catch (error) {
      if(error instanceof Error) toast.error(getErrorMessage(error.message));
    }
  }

  async function handleSignout() {
    const response = await signout();
    if(response.success){
      router.push("/");
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="w-screen h-screen overflow-auto">
      <Toast />
      <header className="w-full bg-background border-b border-b-neutral-700">
        <nav className="relative flex items-center justify-between w-full h-14 z-10 px-4">
            <Logo />
          <div>
            {userType === 'demo' ? (
              <div>
                <Link rel="noreferrer noopener" href="/request-access" className="px-3 py-2 text-neutral-400 rounded-full hover:text-white hover:bg-neutral-700">Request Standard Access</Link>
                <span className="mx-2 border-l border-white"></span>
                <Link rel="noreferrer noopener" href="/signin" className="px-3 py-2 text-neutral-400 rounded-full me-4 hover:text-white hover:bg-neutral-700">Sign In</Link>
              </div>
            ) : (
              <button type="button" className="btn-outline px-3 py-2 me-2" onClick={handleSignout}>Sign out</button>
            )}
          </div>
        </nav>
      </header>
      <div className="hidden">
        <label className="hidden mr-2 text-md font-medium" htmlFor="file_input">
          Upload file:
        </label>
        <input
          className="w-fit text-sm text-black border border-neutral-300 rounded-lg cursor-pointer bg-neutral-50 focus:outline-none"
          id="file_input"
          type="file"
          accept=".txt, .docx, .pdf"
          ref={fileInputRef}
          onChange={handleFileUploadEvent}
        />
      </div>

      <div className="h-fit w-5/6 mx-auto mt-10">
        <UsageStatsCards usageStats={usageStats} userType={userType} />
        <UploadedFilesTable filesList={uploadedFiles} handleAddNewFile={handleAddNewFile} handleDeleteFile={handleDeleteFile} userType={userType} />
      </div>
    </div>
  );
}
