"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  X,
  Upload as UploadIcon,
  File as FileIcon,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiFileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * The accepted file types
   * @default { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'], 'application/pdf': ['.pdf'] }
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 5 * 1024 * 1024 (5MB)
   */
  maxSize?: number;
  /**
   * Maximum number of files allowed
   * @default 5
   */
  maxFiles?: number;
  /**
   * Callback when files are added or removed
   */
  onChange?: (files: File[]) => void;
  /**
   * Current files
   */
  value?: File[];
  /**
   * Disable the upload area
   */
  disabled?: boolean;
  /**
   * Custom class name for the dropzone
   */
  dropzoneClassName?: string;
  /**
   * Custom class name for the files container
   */
  filesContainerClassName?: string;
  /**
   * Custom class name for individual file items
   */
  fileItemClassName?: string;
  /**
   * Whether to show file previews for images
   * @default true
   */
  showPreviews?: boolean;
  /**
   * Whether to show file sizes
   * @default true
   */
  showFileSizes?: boolean;
  /**
   * Whether to show remove buttons on individual files
   * @default true
   */
  showRemoveButtons?: boolean;
}

/**
 * A multiple file upload component with previews and individual file removal.
 */
export function MultiFileUpload({
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
  maxFiles = 5,
  onChange,
  value = [],
  disabled = false,
  className,
  dropzoneClassName,
  filesContainerClassName,
  fileItemClassName,
  showPreviews = true,
  showFileSizes = true,
  showRemoveButtons = true,
  ...props
}: MultiFileUploadProps) {
  const [files, setFiles] = useState<File[]>(value || []);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Update previews when files change
  React.useEffect(() => {
    files.forEach((file) => {
      if (file.type.startsWith("image/") && !previews[file.name]) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => ({
            ...prev,
            [file.name]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    // Cleanup previews when component unmounts
    return () => {
      Object.values(previews).forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [files]);

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
        } else if (rejection.errors.some((e) => e.code === "too-many-files")) {
          setError(`Maximum ${maxFiles} files allowed`);
        }
        return;
      }

      // Limit number of files
      const remainingSlots = maxFiles - files.length;
      if (acceptedFiles.length > remainingSlots) {
        setError(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onChange?.(newFiles);
    },
    [files, maxFiles, maxSize, onChange]
  );

  // Remove a file
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];

    // Clean up preview if it exists
    if (removedFile?.name && previews[removedFile.name]) {
      URL.revokeObjectURL(previews[removedFile.name]);
      const newPreviews = { ...previews };
      delete newPreviews[removedFile.name];
      setPreviews(newPreviews);
    }

    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(accept).length > 0 ? accept : undefined,
    maxSize,
    maxFiles,
    disabled,
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get file icon based on file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-10 h-10 overflow-hidden rounded-md bg-muted">
          {previews[file.name] ? (
            <img
              src={previews[file.name]}
              alt={file.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      );
    }
    return <FileIcon className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed",
            dropzoneClassName
          ),
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadIcon className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {isDragActive ? (
              <p>Drop the files here</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: {Object.values(accept).flat().join(", ")}
          </p>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className={cn("space-y-2", filesContainerClassName)}>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-md",
                  fileItemClassName
                )}
              >
                <div className="flex items-center space-x-3">
                  {showPreviews && getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {showFileSizes && (
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                </div>
                {showRemoveButtons && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={disabled}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span className="sr-only">Remove file</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
