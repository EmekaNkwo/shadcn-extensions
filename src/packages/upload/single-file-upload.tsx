"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import {
  FileRejection,
  useDropzone,
  type DropzoneOptions,
} from "react-dropzone";
import { X, Upload as UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SingleFileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * The accepted file types, e.g. { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 5 * 1024 * 1024 (5MB)
   */
  maxSize?: number;
  /**
   * Whether to show the file preview
   * @default true
   */
  showPreview?: boolean;
  /**
   * Callback when file is selected
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
}

/**
 * A single file upload component with drag-and-drop support and file preview.
 */
export function SingleFileUpload({
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "video/*": [".mp4", ".webm", ".mov"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  showPreview = true,
  onChange,
  value,
  disabled = false,
  className,
  dropzoneClassName,
  previewClassName,
  ...props
}: SingleFileUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update preview when file changes
  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    // Only create preview for images
    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

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
          setError("Invalid file type");
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  } as DropzoneOptions);

  // Remove file
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError(null);
    onChange?.(null);
  };

  const dropzoneClasses = cn(
    "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
    "hover:border-primary/50 hover:bg-accent/50",
    isDragActive && "border-primary bg-accent/50",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-destructive",
    dropzoneClassName
  );

  const previewClasses = cn(
    "mt-4 w-full max-w-xs mx-auto rounded-md overflow-hidden",
    previewClassName
  );

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps({
          className: dropzoneClasses,
        })}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          <UploadIcon className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the file here..."
              : "Drag & drop a file here, or click to select"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {Object.values(accept).flat().join(", ")} (max{" "}
            {maxSize / 1024 / 1024}MB)
          </p>
        </div>

        {file && (
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-accent"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {showPreview && preview && (
        <div className={previewClasses}>
          <div className="relative pt-[100%] bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-2 text-sm truncate text-center bg-muted">
            {file?.name}
          </div>
        </div>
      )}

      {showPreview && file && !preview && (
        <div className={previewClasses}>
          <div className="p-4 text-center bg-muted rounded-md">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
