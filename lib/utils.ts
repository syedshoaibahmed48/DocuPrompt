import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import errorCodes from "@/assets/json/error_codes.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getErrorMessage(errorCode: string) {
  return errorCodes[errorCode as keyof typeof errorCodes].message || "Error";
}