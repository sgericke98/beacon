"use client";

import { useCallback, useState } from "react";
import { Upload } from "@/lib/lucide-react";

interface UploadDropzoneProps {
  onFiles: (files: string[]) => void;
}

export function UploadDropzone({ onFiles }: UploadDropzoneProps) {
  const [highlighted, setHighlighted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const names = Array.from(fileList).map((file) => file.name);
      setFiles(names);
      onFiles(names);
    },
    [onFiles]
  );

  return (
    <div
      className={`rounded-lg border-2 border-dashed ${
        highlighted ? "border-foreground bg-muted/40" : "border-border"
      } p-8 text-center transition-colors`}
      onDragOver={(event) => {
        event.preventDefault();
        setHighlighted(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setHighlighted(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setHighlighted(false);
        handleFiles(event.dataTransfer?.files ?? null);
      }}
    >
      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">Drop contracts here (PDF/DOCX) or browse</p>
      <div className="mt-4 flex justify-center">
        <label className="inline-flex cursor-pointer items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
          Browse
          <input
            type="file"
            className="hidden"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>
      </div>
      {files.length ? (
        <div className="mt-4 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">Last upload</div>
          <ul className="mt-2 space-y-1">
            {files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
