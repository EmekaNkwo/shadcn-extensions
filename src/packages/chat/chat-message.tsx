"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Edit2, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

export type MessageRole = "user" | "ai" | "system" | "assistant";
export type MessageVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The role of the message sender
   * @default "user"
   */
  role?: MessageRole;
  /**
   * The visual style variant of the message
   * @default "default"
   */
  variant?: MessageVariant;
  /**
   * The name of the sender
   */
  name?: string;
  /**
   * The avatar URL or element to display
   */
  avatar?: string | React.ReactNode;
  /**
   * The timestamp of the message
   */
  timestamp?: Date | string | number;
  /**
   * Whether the message has been read
   */
  isRead?: boolean;
  /**
   * Whether to show the avatar
   * @default true
   */
  showAvatar?: boolean;
  /**
   * Whether to show the timestamp
   * @default true
   */
  showTimestamp?: boolean;
  /**
   * Whether the message is being edited
   */
  isEditing?: boolean;
  /**
   * Whether the message is pending (sending)
   */
  isPending?: boolean;
  /**
   * Callback when the message is copied
   */
  onCopy?: () => void;
  /**
   * Callback when the message is edited
   */
  onEdit?: () => void;
  /**
   * Callback when the message is deleted
   */
  onDelete?: () => void;
  /**
   * Additional class name for the message bubble
   */
  bubbleClassName?: string;
  /**
   * Additional class name for the avatar container
   */
  avatarClassName?: string;
  /**
   * Additional class name for the timestamp
   */
  timestampClassName?: string;
  /**
   * Additional class name for the message actions
   */
  actionsClassName?: string;
}

const variantStyles = {
  default: {
    user: "bg-primary text-primary-foreground",
    ai: "bg-muted text-muted-foreground",
    system: "bg-muted/50 text-muted-foreground",
    assistant: "bg-muted text-muted-foreground",
  },
  primary: {
    user: "bg-blue-600 text-white",
    ai: "bg-blue-100 text-blue-900 dark:bg-blue-400/30 dark:text-blue-800",
    system: "bg-blue-50 text-blue-900 dark:bg-blue-300/20 dark:text-blue-600",
    assistant:
      "bg-blue-100 text-blue-900 dark:bg-blue-200/30 dark:text-blue-700",
  },
  success: {
    user: "bg-green-600 text-white",
    ai: "bg-green-100 text-green-900 dark:bg-green-400/30 dark:text-green-800",
    system:
      "bg-green-50 text-green-900 dark:bg-green-300/20 dark:text-green-600",
    assistant:
      "bg-green-100 text-green-900 dark:bg-green-200/30 dark:text-green-700",
  },
  warning: {
    user: "bg-yellow-600 text-white",
    ai: "bg-yellow-100 text-yellow-900 dark:bg-yellow-200/30 dark:text-yellow-700",
    system:
      "bg-yellow-50 text-yellow-900 dark:bg-yellow-300/20 dark:text-yellow-600",
    assistant:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-200/30 dark:text-yellow-700",
  },
  error: {
    user: "bg-red-600 text-white",
    ai: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100",
    system: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    assistant: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100",
  },
} as const;

export function ChatMessage({
  role = "user",
  variant = "default",
  name,
  avatar,
  timestamp,
  isRead = false,
  showAvatar = true,
  showTimestamp = true,
  isEditing = false,
  isPending = false,
  onCopy,
  onEdit,
  onDelete,
  className,
  bubbleClassName,
  avatarClassName,
  timestampClassName,
  actionsClassName,
  children,
  ...props
}: ChatMessageProps) {
  const isUser = role === "user";
  const [isHovered, setIsHovered] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatTimestamp = (date?: Date | string | number) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;

    if (typeof avatar === "string") {
      return (
        <Avatar className={cn("h-8 w-8", avatarClassName)}>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      );
    }

    if (React.isValidElement(avatar)) {
      return avatar;
    }

    return (
      <Avatar
        className={cn(
          "h-8 w-8",
          variantStyles[variant]?.[role] || variantStyles.default[role],
          avatarClassName
        )}
      >
        <AvatarFallback>
          {role === "user"
            ? "U"
            : role === "ai" || role === "assistant"
            ? "AI"
            : "S"}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-3",
        isUser ? "justify-end" : "justify-start",
        isPending && "opacity-70",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {!isUser && showAvatar && (
        <div className="flex-shrink-0 mt-6">{renderAvatar()}</div>
      )}

      <div className="flex max-w-[85%] flex-col">
        {(name || showTimestamp) && (
          <div
            className={cn(
              "mb-1 flex items-center gap-2 text-xs text-muted-foreground",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {name && <span className="font-medium">{name}</span>}
            {showTimestamp && timestamp && (
              <time
                dateTime={new Date(timestamp).toISOString()}
                className={timestampClassName}
              >
                {formatTimestamp(timestamp)}
              </time>
            )}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div
            className={cn(
              "relative rounded-2xl px-4 py-2 text-sm",
              "whitespace-pre-wrap break-words",
              isUser ? "rounded-br-none" : "rounded-bl-none",
              variantStyles[variant]?.[role] || variantStyles.default[role],
              isEditing && "ring-2 ring-offset-2 ring-primary/50",
              bubbleClassName
            )}
          >
            {children}

            {(isHovered || isCopied) && (
              <div
                className={cn(
                  "absolute -top-8 right-0 flex items-center gap-1 rounded-full bg-background p-1 shadow-sm",
                  isUser ? "flex-row" : "flex-row-reverse left-0 right-auto",
                  actionsClassName
                )}
              >
                {onCopy && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0"
                    onClick={handleCopy}
                    title={isCopied ? "Copied!" : "Copy"}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0"
                    onClick={onEdit}
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0 text-destructive hover:text-destructive"
                    onClick={onDelete}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {isUser && showAvatar && (
            <div className="flex-shrink-0">{renderAvatar()}</div>
          )}
        </div>

        {isUser && isRead && (
          <div className="mt-1 flex justify-end gap-1 text-xs text-muted-foreground">
            <span>Read</span>
            <Check className="h-3 w-3 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}
