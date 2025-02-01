import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { convertToHtml } from "mammoth";

export function formattedTodaysDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0"); // Get day with leading zero if necessary
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Get month (January is 0)
  const yyyy = today.getFullYear(); // Get full year
  return `${dd}/${mm}/${yyyy}`;
}

export function fileNameWithoutExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf("."));
}

export async function extractTextFromFile(file: File) {
  switch (file.type) {
    case "text/plain":
      return await file.text();
    case "application/pdf":
      const pdfLoader = new PDFLoader(file);
      const pdfPageDocuments = await pdfLoader.load();
      return pdfPageDocuments.map(document => document.pageContent).join("\n\n");
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      const docxLoader = new DocxLoader(file);
      const docxPageDocuments = await docxLoader.load();
      return docxPageDocuments.map(document => document.pageContent).join("\n\n");
    default:
      console.error("Unsupported file type:", file.type);
      return "";
  }
}

export async function getFileContent(buffer: Buffer, type: string) {
  if (type === "text/plain") {
      return buffer.toString("utf-8");
  } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return (await convertToHtml({buffer})).value
  } else if (type === "application/pdf") {
     return `data:application/pdf;base64,${buffer.toString("base64")}`;
  }
}