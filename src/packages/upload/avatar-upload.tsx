"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export interface AvatarUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Current avatar URL or File
   */
  value?: string | File | null;
  /**
   * Callback when avatar changes
   */
  onChange?: (file: File | null) => void;
  /**
   * Callback for upload progress
   * @param progress - Upload progress percentage (0-100)
   */
  onUploadProgress?: (progress: number) => void;
  /**
   * Size of the avatar
   * @default "default"
   */
  size?: "sm" | "default" | "lg" | "xl" | "2xl";
  /**
   * Whether the upload is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether to show the remove button
   * @default true
   */
  showRemoveButton?: boolean;
  /**
   * Custom class for the avatar container
   */
  className?: string;
  /**
   * Custom class for the upload button
   */
  buttonClassName?: string;
  /**
   * Custom fallback content when no image is set
   */
  fallback?: React.ReactNode;
  /**
   * Maximum file size in bytes
   * @default 2 * 1024 * 1024 (2MB)
   */
  maxSize?: number;
}

const sizeMap = {
  sm: "h-16 w-16 text-sm",
  default: "h-24 w-24 text-base",
  lg: "h-32 w-32 text-lg",
  xl: "h-40 w-40 text-xl",
  "2xl": "h-48 w-48 text-2xl",
} as const;

export function AvatarUpload({
  value,
  onChange,
  onUploadProgress,
  size = "default",
  disabled = false,
  showRemoveButton = true,
  className,
  buttonClassName,
  fallback = "AV",
  maxSize = 2 * 1024 * 1024, // 2MB
  ...props
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value && typeof value === "string" ? value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        console.error(
          `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
        );
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call onChange with the file
      onChange?.(file);

      // Simulate upload progress (replace with actual upload)
      if (onUploadProgress) {
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);
            onUploadProgress(100);
            setIsUploading(false);
          } else {
            onUploadProgress(progress);
          }
        }, 100);
      }
    },
    [onChange, onUploadProgress, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      {...props}
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative group rounded-full cursor-pointer",
          "transition-all duration-200 ease-in-out",
          "hover:ring-2 hover:ring-primary hover:ring-offset-2",
          isDragActive && "ring-2 ring-primary ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          sizeMap[size]
        )}
      >
        <Input {...getInputProps()} ref={fileInputRef} />
        <Avatar className={cn("h-full w-full")}>
          {preview && (
            <AvatarImage
              src={preview}
              alt="Profile picture"
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-muted">
            {isUploading ? (
              <Loader2 className="h-1/2 w-1/2 animate-spin text-muted-foreground" />
            ) : (
              fallback
            )}
          </AvatarFallback>
        </Avatar>

        {!disabled && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              isDragActive && "opacity-100"
            )}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {showRemoveButton && preview && !disabled && !isUploading && (
          <Button
            type="button"
            onClick={handleRemove}
            className={cn(
              "absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white",
              "flex items-center justify-center hover:bg-destructive/90",
              "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            aria-label="Remove avatar"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!preview && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className={buttonClassName}
        >
          Upload photo
        </Button>
      )}
    </div>
  );
}
