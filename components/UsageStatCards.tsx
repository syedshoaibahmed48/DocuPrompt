"use client";
import { useEffect, useState } from "react";
import { UsageStats } from "@/models/app-interfaces";
import { calcStatPercentage, formattedFileSize } from "@/lib/FileMetaDataUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Info } from "lucide-react";

export default function UsageStatsCards({usageStats, userType}: {usageStats: UsageStats; userType: string}) {

  const [filesUploadedPercentage, setFilesUploadedPercentage] = useState<string>("0");
  const [promptsUsedPercentage, setPromptsUsedPercentage] = useState<string>("0");
  const [totalStoragePercentage, setTotalStoragePercentage] = useState<string>("0");

  useEffect(() => {
    setFilesUploadedPercentage(calcStatPercentage(usageStats.filesUploaded!, usageStats.maxFiles));
    setPromptsUsedPercentage(calcStatPercentage(usageStats.promptsUsed!, usageStats.maxPrompts));
    setTotalStoragePercentage(calcStatPercentage(usageStats.storageUsed!, usageStats.maxStorage));
  }, [usageStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 pb-8">
      <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-200" hidden={userType !== 'demo'}>
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>files will be deleted by next Monday at 00:00 UTC.</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col px-4 py-1 bg-neutral-900 rounded-lg border border-neutral-600 gap-y-2">
          <h3 className="text-center text-3xl py-4">Files</h3>
          <span className="flex flex-row text-sm justify-between">
          <p>Uploaded: {usageStats.filesUploaded} / {usageStats.maxFiles} Files</p> 
          <p>{filesUploadedPercentage}%</p>
          </span>
          <div className="w-full bg-neutral-700 rounded-sm h-1 mb-4">
            <div
              className="bg-purple-600 h-full rounded-sm"
              style={{ width: `${filesUploadedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      </TooltipProvider>
      <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-200">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{userType === 'demo' ? 'Resets every Monday at 00:00 UTC.' : 'Resets on the 1st of every month at 00:00 UTC'}</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col px-4 py-1 bg-neutral-900 rounded-lg border border-neutral-600 gap-y-2">
          <h3 className="text-center text-3xl py-4">Prompts</h3>
          <span className="flex flex-row text-sm justify-between">
            <p>Used: {usageStats.promptsUsed} / {usageStats.maxPrompts} Prompts</p>
            <p>{promptsUsedPercentage}%</p>
          </span>
          <div className="w-full bg-neutral-700 rounded-sm h-1 mb-4">
            <div
              className="bg-emerald-600 h-full rounded-sm"
              style={{ width: `${promptsUsedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      </TooltipProvider>
      <div className="flex flex-col px-4 py-1 bg-neutral-900 rounded-lg border border-neutral-600 gap-y-2">
        <h3 className="text-center text-3xl py-4">Storage</h3>
        <span className="flex flex-row text-sm justify-between">
          <p>Used: {formattedFileSize(usageStats.storageUsed!)} / {formattedFileSize(usageStats.maxStorage)}</p>
          <p>{totalStoragePercentage}%</p>
        </span>
        <div className="w-full bg-neutral-700 rounded-sm h-1 mb-4">
          <div
            className="bg-sky-600 h-full rounded-sm"
            style={{ width: `${totalStoragePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}