"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import { ChatHeader, ChatHeaderProps } from "./chat-header";

export interface ChatContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the chat container
   * @default "default"
   */
  variant?: "default" | "bordered" | "elevated" | "ghost";
  /**
   * The height of the chat container
   * @default "600px"
   */
  height?: string | number;
  /**
   * The maximum width of the chat container
   * @default "md" (28rem or 448px)
   */
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "full"
    | string;
  /**
   * Whether to show a scrollbar when content overflows
   * @default true
   */
  scrollable?: boolean;
  /**
   * Optional header component
   */
  /**
   * Optional footer component
   */
  footer?: React.ReactNode;
  /**
   * Additional class name for the content wrapper
   */
  contentClassName?: string;
  /**
   * Additional class name for the footer
   */
  footerClassName?: string;
  /**
   * Whether to show the header
   * @default false
   */
  showHeader?: boolean;
  /**
   * Props to pass to the header component
   */
  headerProps?: ChatHeaderProps;
  /**
   * The maximum height of the chat container
   * @default "md" (28rem or 448px)
   */
  maxHeight?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "full"
    | string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-full",
} as const;

const maxHeightMap = {
  sm: "max-h-sm",
  md: "max-h-md",
  lg: "max-h-lg",
  xl: "max-h-xl",
  "2xl": "max-h-2xl",
  "3xl": "max-h-3xl",
  "4xl": "max-h-4xl",
  full: "max-h-[calc(100vh-4rem)]",
} as const;

export function ChatContainer({
  className,
  children,
  variant = "default",
  maxHeight = "h-fit",
  maxWidth = "full",
  scrollable = true,
  footer,
  contentClassName,
  footerClassName,
  showHeader = false,
  headerProps,
  style,
  ...props
}: ChatContainerProps) {
  const maxWidthClass =
    typeof maxWidth === "string" && maxWidth in maxWidthMap
      ? maxWidthMap[maxWidth as keyof typeof maxWidthMap]
      : `max-w-[${maxWidth}]`;

  const maxHeightClass =
    typeof maxHeight === "string" && maxHeight in maxHeightMap
      ? maxHeightMap[maxHeight as keyof typeof maxHeightMap]
      : `max-h-[${maxHeight}]`;

  const variantClasses = {
    default: "border bg-background shadow-sm",
    bordered: "border-2 border-muted-foreground/20 bg-background",
    elevated: "bg-background shadow-lg",
    ghost: "bg-transparent",
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full",
        variantClasses[variant],
        maxWidthClass,
        maxHeightClass,
        className
      )}
      style={{
        ...style,
      }}
      {...props}
    >
      {showHeader && <ChatHeader {...headerProps} />}

      <div
        className={cn(
          "overflow-hidden flex flex-col h-full",
          scrollable ? "overflow-y-auto" : "overflow-y-hidden"
        )}
      >
        <div className={cn(" p-4 space-y-3", contentClassName)}>{children}</div>
      </div>

      {footer && (
        <div className={cn("border-t p-4 bg-muted/20", footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
}
