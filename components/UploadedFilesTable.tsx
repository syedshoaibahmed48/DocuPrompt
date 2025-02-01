import { FileMetaData } from "@/models/app-interfaces";
import fileTypes from "@/assets/json/file_types_mapping.json";
import {
  fileNameWithoutExtension,
  formattedFileSize,
} from "@/lib/FileMetaDataUtils";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import limits from "@/assets/json/user_limits.json";

export default function UploadedFilesTable({
  handleAddNewFile,
  filesList,
  handleDeleteFile,
  userType
}: {
  handleAddNewFile: () => void;
  filesList: FileMetaData[];
  handleDeleteFile: (fileId: string) => Promise<void>;
  userType: string
}) {
  const [displayedFiles, setDisplayedFiles] = useState<FileMetaData[]>(filesList);

  useEffect(() => {
    setDisplayedFiles(filesList);
  }, [filesList]);

  function handleFileSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const filteredfilesList = event.target.value
      ? filesList.filter((file) =>
          file.name.toLowerCase().includes(event.target.value)
        )
      : filesList;
    setDisplayedFiles(filteredfilesList);
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-neutral-700">
      <table className="w-full text-sm text-left rtl:text-right text-neutral-300">
        <caption className="p-5 pb-3 text-left  text-white bg-neutral-900">
          <h2 className="text-4xl font-semibold py-1">Uploaded Files</h2>
          <p className="mt-1 text-sm font-normal text-neutral-300">
            Browse and manage your uploaded documents. Please ensure that if you
            are uploading PDF or Word files, the text within the document is
            selectable to facilitate better interaction with our chatbot.
          </p>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="flex flex-row justify-between mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-neutral-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm border rounded-lg w-80 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name"
                onChange={handleFileSearch}
              />
            </div>
            {filesList.length < limits.usageLimits[userType as keyof typeof limits.usageLimits]?.maxFiles && (
              <button
              type="button"
              className="btn-outline bg-neutral-700 px-4"
              onClick={handleAddNewFile}
              >
                New File
              </button>
            )}
          </div>
        </caption>
        <thead className="text-xs  uppercase bg-neutral-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Date Uploaded
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            {userType !=="demo" && <th scope="col" className="px-6 py-3 text-center">
              Delete
            </th>}
            <th scope="col" className="px-6 py-3 text-center">
              {" "}
              Chat{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedFiles.length === 0 ? (
            <tr className="bg-neutral-900 border-b border-neutral-700 text-center">
              <td colSpan={6} className="p-4 text-md">
                {filesList.length === displayedFiles.length ? 'No file uploaded.' : 'No files found'}
              </td>
            </tr>
          ) : (
            displayedFiles.map(({ fileId, name, type, size, uploadDate }) => {
              const filename = fileNameWithoutExtension(name);
              const filetype =
                fileTypes[type as keyof typeof fileTypes] || "file";
              const filesize = formattedFileSize(size!);
              return (
                <tr
                  className="bg-neutral-900 border-b border-neutral-700"
                  key={fileId}
                >
                  <td
                    scope="row"
                    className="px-6 py-2 font-medium whitespace-nowrap"
                  >
                    {filename}
                  </td>
                  <td className="px-6 py-2">{uploadDate}</td>
                  <td className="px-6 py-2">{filetype}</td>
                  <td className="px-6 py-2">{filesize}</td>
                  {userType !=="demo" && <td className="px-6 py-2">
                    <svg
                      className="w-6 h-6 fill-neutral-300 hover:fill-neutral-500 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      onClick={() => {
                        handleDeleteFile(fileId!);
                      }}
                    >
                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                    </svg>
                  </td>}
                  <td className="px-6 py-2 text-center">
                    <Link href={`/files/${fileId}/chat`}>
                      <Button variant="link" onClick={() => {}}>
                        Chat
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
