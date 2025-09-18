"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, Paperclip, Send, Smile } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value of the input
   */
  value?: string;
  /**
   * Callback when the input value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Callback when the send button is clicked or Enter is pressed
   */
  onSend?: (value: string) => void;
  /**
   * Placeholder text for the input
   * @default "Type a message..."
   */
  placeholder?: string;
  /**
   * Text for the send button
   * @default "Send"
   */
  sendButtonText?: string;
  /**
   * Whether to show the send button
   * @default true
   */
  showSendButton?: boolean;
  /**
   * Whether to show the attachment button
   * @default false
   */
  showAttachmentButton?: boolean;
  /**
   * Whether to show the emoji button
   * @default false
   */
  showEmojiButton?: boolean;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * The visual style of the input
   * @default "default"
   */
  variant?: "default" | "ghost" | "filled";
  /**
   * The size of the input
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Additional buttons to render in the input
   */
  additionalButtons?: React.ReactNode;
  /**
   * Callback when the attachment button is clicked
   */
  onAttachmentClick?: () => void;
  /**
   * Callback when the emoji button is clicked
   */
  onEmojiClick?: () => void;
  /**
   * Class name for the input element
   */
  inputClassName?: string;
  /**
   * Class name for the send button
   */
  sendButtonClassName?: string;
  /**
   * Class name for the action buttons (emoji, attachment)
   */
  actionButtonClassName?: string;
}

export function ChatInput({
  className,
  value: valueProp,
  onValueChange,
  onSend,
  placeholder = "Type a message...",
  sendButtonText = "Send",
  showSendButton = true,
  showAttachmentButton = false,
  showEmojiButton = false,
  disabled = false,
  isLoading = false,
  variant = "default",
  size = "default",
  additionalButtons,
  onAttachmentClick,
  onEmojiClick,
  inputClassName,
  sendButtonClassName,
  actionButtonClassName,
  ...props
}: ChatInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const handleSend = () => {
    if (value.trim() && !disabled && !isLoading) {
      onSend?.(value);
      if (!isControlled) {
        setInternalValue("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const variantClasses = {
    default: "bg-background border border-input",
    ghost: "bg-transparent border-0",
    filled: "bg-muted/50 border border-transparent",
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    default: "py-2 px-4 text-sm",
    lg: "py-3 px-5 text-base",
  };

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2 rounded-lg border bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-col">
        <div className="flex items-end gap-2">
          {showAttachmentButton && (
            <Button
              type="button"
              onClick={onAttachmentClick}
              disabled={disabled}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: cn(
                    "h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground",
                    actionButtonClassName
                  ),
                })
              )}
            >
              <Paperclip className="h-4 w-4" />
              <Label className="sr-only">Attach file</Label>
            </Button>
          )}

          <div className="relative flex-1">
            <Textarea
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className={cn(
                "flex w-full resize-none rounded-md bg-transparent px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                "placeholder:text-muted-foreground/60",
                "min-h-[40px] max-h-[200px]",
                sizeClasses[size],
                inputClassName
              )}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
          </div>

          {showEmojiButton && (
            <Button
              type="button"
              onClick={onEmojiClick}
              disabled={disabled}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: cn(
                    "h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground",
                    actionButtonClassName
                  ),
                })
              )}
            >
              <Smile className="h-4 w-4" />
              <Label className="sr-only">Open emoji picker</Label>
            </Button>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">{additionalButtons}</div>
          {showSendButton && (
            <Button
              type="button"
              onClick={handleSend}
              disabled={disabled || isLoading || !value.trim()}
              className={cn(
                "gap-1.5",
                size === "sm" && "h-8 px-3 text-xs",
                size === "lg" && "h-11 px-6",
                sendButtonClassName
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {sendButtonText && <span>{sendButtonText}</span>}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
