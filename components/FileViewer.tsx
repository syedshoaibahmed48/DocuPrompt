"use client"

import { useEffect, useRef } from "react";

export default function FileViewer({ fileContent, fileType, contextLinesRange }: { fileContent: string, fileType: string, contextLinesRange: Array<number> }) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (fileType === "text/plain" && contextLinesRange && contextLinesRange[0] > 0) {
      const lineElement = preRef.current?.querySelector(`.line-${contextLinesRange[0]}`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [fileType, contextLinesRange]);

  return (
    <div className="h-full w-full">
      {fileType === "text/plain" && (
        <pre
          ref={preRef}
          className="whitespace-pre-wrap bg-white border border-gray-300 p-8 shadow-md overflow-auto"
          style={{ position: "relative" }}
        >
          {fileContent.split("\n").map((line, index) => (
            <p
              key={index}
              className={`text-document block line-${index + 1} ${contextLinesRange && index + 1 >= contextLinesRange[0] && index + 1 <= contextLinesRange[1] ? "bg-neutral-400 p-2" : ""
                }`}
            >
              {line}
              <br />
            </p>
          ))}
        </pre>
      )}

      {fileType === 'application/pdf' && (
        <embed className="h-full w-full" src={fileContent} type="application/pdf" />
      )}

      {fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
        <div
          className="word-document bg-white border border-gray-300 p-8 shadow-md"
          dangerouslySetInnerHTML={{ __html: fileContent }}
        />
      )}
    </div>
  );
}