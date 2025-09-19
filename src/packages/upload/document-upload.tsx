"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileRejection,
} from "react-dropzone";
import {
  X,
  Upload as UploadIcon,
  File as FileIcon,
  FileText,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileType,
  FileType2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface DocumentUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * The accepted document types
   * @default Common document types (PDF, Word, Excel, etc.)
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 10 * 1024 * 1024 (10MB)
   */
  maxSize?: number;
  /**
   * Callback when document is selected
   */
  onChange?: (file: File | null) => void;
  /**
   * Current file
   */
  value?: File | null;
  /**
   * Disable the upload area
   */
  disabled?: boolean;
  /**
   * Custom class name for the dropzone
   */
  dropzoneClassName?: string;
  /**
   * Custom class name for the preview container
   */
  previewClassName?: string;
  /**
   * Whether to show the file size
   * @default true
   */
  showFileSize?: boolean;
  /**
   * Whether to show the file type icon
   * @default true
   */
  showFileIcon?: boolean;
  /**
   * Whether to show the upload button
   * @default true
   */
  showUploadButton?: boolean;
  /**
   * Custom upload button text
   * @default "Browse files"
   */
  uploadButtonText?: string;
  /**
   * Custom description text
   */
  description?: string;
}

const DEFAULT_ACCEPT = {
  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "text/plain": [".txt"],
  "text/csv": [".csv"],
  "application/rtf": [".rtf"],
  // Images
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  // Archives
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/x-7z-compressed": [".7z"],
  // Code
  "text/html": [".html", ".htm"],
  "text/css": [".css"],
  "text/javascript": [".js"],
  "application/json": [".json"],
  "application/xml": [".xml"],
  // Media
  "audio/*": [".mp3", ".wav", ".ogg"],
  "video/*": [".mp4", ".webm", ".mov"],
};

const getFileIcon = (file: File) => {
  const type = file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();

  // Check by MIME type first
  if (type.includes("pdf"))
    return <FileType2 className="w-5 h-5 text-red-500" />;
  if (type.includes("word") || extension === "doc" || extension === "docx")
    return <FileText className="w-5 h-5 text-blue-500" />;
  if (
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    extension === "xls" ||
    extension === "xlsx"
  )
    return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
  if (
    type.includes("powerpoint") ||
    type.includes("presentation") ||
    extension === "ppt" ||
    extension === "pptx"
  )
    return <FileType className="w-5 h-5 text-orange-500" />;
  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("7z") ||
    extension === "zip" ||
    extension === "rar" ||
    extension === "7z"
  )
    return <FileArchive className="w-5 h-5 text-amber-500" />;
  if (type.startsWith("image/"))
    return <FileImage className="w-5 h-5 text-blue-400" />;
  if (type.startsWith("video/"))
    return <FileVideo className="w-5 h-5 text-purple-500" />;
  if (type.startsWith("audio/"))
    return <FileAudio className="w-5 h-5 text-pink-500" />;
  if (
    type.startsWith("text/") ||
    extension === "txt" ||
    extension === "md" ||
    extension === "csv" ||
    extension === "json" ||
    extension === "xml" ||
    extension === "html" ||
    extension === "css" ||
    extension === "js" ||
    extension === "ts"
  )
    return <FileCode className="w-5 h-5 text-gray-500" />;

  // Default icon
  return <FileIcon className="w-5 h-5 text-gray-400" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * A document upload component with file type icons and preview.
 */
export function DocumentUpload({
  accept = DEFAULT_ACCEPT,
  maxSize = 10 * 1024 * 1024, // 10MB
  onChange,
  value,
  disabled = false,
  className,
  dropzoneClassName,
  previewClassName,
  showFileSize = true,
  showFileIcon = true,
  showUploadButton = true,
  uploadButtonText = "Browse files",
  description = "PDF, Word, Excel, PowerPoint, and other document formats",
  ...props
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      // Handle file rejections (invalid type, size, etc.)
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((e) => e.code === "file-too-large")) {
          setError(`File is too large. Max size: ${maxSize / 1024 / 1024}MB`);
        } else if (
          rejection.errors.some((e) => e.code === "file-invalid-type")
        ) {
          setError("File type not supported");
        } else {
          setError("Error uploading file");
        }
        return;
      }

      // Handle valid file
      const newFile = acceptedFiles[0];
      setFile(newFile);
      onChange?.(newFile);
    },
    [maxSize, onChange]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    noClick: true, // We'll handle clicks manually
    disabled,
  } as DropzoneOptions);

  // Remove file
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    onChange?.(null);
  };

  const dropzoneClasses = cn(
    "relative border-2 border-dashed rounded-lg transition-colors",
    isDragActive
      ? "border-primary bg-primary/5"
      : "border-border hover:border-primary/50",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-destructive",
    dropzoneClassName
  );

  const previewClasses = cn(
    "flex items-center p-4 rounded-md bg-muted/50",
    previewClassName
  );

  return (
    <div className={cn("space-y-3 w-full", className)} {...props}>
      <div
        {...getRootProps({
          className: dropzoneClasses,
        })}
      >
        <Input {...getInputProps()} data-testid="file-input" />

        {file ? (
          <div className={previewClasses}>
            {showFileIcon && (
              <div className="flex-shrink-0 mr-3">{getFileIcon(file)}</div>
            )}
            <div className="min-w-0 flex-1">
              <Label className="text-sm font-medium truncate">
                {file.name}
              </Label>
              {showFileSize && (
                <Label className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </Label>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {showUploadButton && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  disabled={disabled}
                >
                  Change
                </Button>
              )}
              <Button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Remove file"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-2.5 rounded-full bg-primary/10">
                <UploadIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag & drop files here"}
                </Label>
                <Label className="text-xs text-muted-foreground">
                  {description} (max {maxSize / 1024 / 1024}MB)
                </Label>
              </div>
              {showUploadButton && (
                <Button
                  type="button"
                  onClick={open}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={disabled}
                >
                  {uploadButtonText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <Label className="text-sm text-destructive flex items-center">
          <X className="w-4 h-4 mr-1.5" /> {error}
        </Label>
      )}
    </div>
  );
}
