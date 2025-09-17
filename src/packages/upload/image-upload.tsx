"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type FileRejection,
} from "react-dropzone";
import { X, Upload as UploadIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * The accepted image types
   * @default { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }
   */
  accept?: Record<string, string[]>;
  /**
   * Maximum file size in bytes
   * @default 5 * 1024 * 1024 (5MB)
   */
  maxSize?: number;
  /**
   * Callback when image is selected
   */
  onChange?: (file: File | null) => void;
  /**
   * Current image file
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
   * Aspect ratio of the image preview (width / height)
   * @default 1 (square)
   */
  aspectRatio?: number;
  /**
   * Whether to show the file name
   * @default true
   */
  showFileName?: boolean;
  /**
   * Whether to show the file size
   * @default true
   */
  showFileSize?: boolean;
  /**
   * Whether to show the remove button
   * @default true
   */
  showRemoveButton?: boolean;
  /**
   * Whether to show the upload icon when no image is selected
   * @default true
   */
  showUploadIcon?: boolean;
}

/**
 * An image upload component with preview and aspect ratio control.
 */
export function ImageUpload({
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  onChange,
  value,
  disabled = false,
  className,
  dropzoneClassName,
  previewClassName,
  aspectRatio = 1,
  showFileName = true,
  showFileSize = true,
  showRemoveButton = true,
  showUploadIcon = true,
  ...props
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(value || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update preview when file changes
  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    setIsLoading(true);
    const objectUrl = URL.createObjectURL(file);

    // Load image to check dimensions if needed
    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      setPreview(objectUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError("Failed to load image");
      setIsLoading(false);
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Handle file selection
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      // Handle file rejections (invalid type, size, etc.)
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((e) => e.code === "file-too-large")) {
          setError(`Image is too large. Max size: ${maxSize / 1024 / 1024}MB`);
        } else if (
          rejection.errors.some((e) => e.code === "file-invalid-type")
        ) {
          setError("Invalid image type");
        } else {
          setError("Error uploading image");
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
    disabled: disabled || isLoading,
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
    "relative group overflow-hidden rounded-lg border-2 border-dashed transition-colors min-h-[200px] flex items-center justify-center",
    "hover:border-primary/50 hover:bg-accent/10",
    isDragActive && "border-primary bg-accent/10",
    disabled && "opacity-50 cursor-not-allowed",
    error && "border-destructive",
    dropzoneClassName
  );

  const previewClasses = cn(
    "relative w-full h-full flex items-center justify-center bg-muted/50 min-h-[200px]",
    `aspect-[${aspectRatio}]`,
    previewClassName
  );

  return (
    <div className={cn("space-y-2 w-full", className)} {...props}>
      <div
        {...getRootProps({
          className: dropzoneClasses,
        })}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className={previewClasses}>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center p-4">
                <UploadIcon className="w-6 h-6 mx-auto mb-2 text-white" />
                <p className="text-sm text-white">Click or drag to replace</p>
              </div>
            </div>

            {showRemoveButton && (
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-black text-white transition-colors z-10"
                aria-label="Remove image"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {showUploadIcon && (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <p className="text-sm font-medium mb-1">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop an image, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">
              {Object.values(accept).flat().join(", ")} (max{" "}
              {maxSize / 1024 / 1024}MB)
            </p>
          </div>
        )}
      </div>

      {(showFileName || showFileSize) && file && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          {showFileName && <span className="truncate">{file.name}</span>}
          {showFileSize && <span>{(file.size / 1024).toFixed(1)} KB</span>}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading && (
        <div className="h-1 w-full bg-muted overflow-hidden">
          <div className="h-full w-full bg-primary/20 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
