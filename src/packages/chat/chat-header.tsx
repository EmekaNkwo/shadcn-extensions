"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Label } from "@/components/ui/label";

export interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the conversation
   */
  title?: string;
  /**
   * The subtitle or status of the conversation
   */
  subtitle?: string;
  /**
   * The avatar URL or element to display
   */
  avatar?: string | React.ReactNode;
  /**
   * Callback when the back button is clicked
   */
  onBack?: () => void;
  /**
   * Callback when the call button is clicked
   */
  onCall?: () => void;
  /**
   * Callback when the video call button is clicked
   */
  onVideoCall?: () => void;
  /**
   * Callback when the more options button is clicked
   */
  onMoreOptions?: () => void;
  /**
   * Whether to show the back button
   * @default false
   */
  showBackButton?: boolean;
  /**
   * Whether to show the call buttons
   * @default true
   */
  showCallButtons?: boolean;
  /**
   * Additional buttons to render in the header
   */
  additionalButtons?: React.ReactNode;
}

export function ChatHeader({
  className,
  title,
  subtitle,
  avatar,
  onBack,
  onCall,
  onVideoCall,
  onMoreOptions,
  showBackButton = false,
  showCallButtons = true,
  additionalButtons,
  ...props
}: ChatHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
            <Label className="sr-only">Back</Label>
          </Button>
        )}

        {avatar && (
          <div className="flex-shrink-0">
            {typeof avatar === "string" ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt={title} />
                <AvatarFallback>{getInitials(title)}</AvatarFallback>
              </Avatar>
            ) : (
              avatar
            )}
          </div>
        )}

        <div className="min-w-0">
          {title && (
            <Label className="truncate text-base font-semibold">{title}</Label>
          )}
          {subtitle && (
            <Label className="truncate text-sm text-muted-foreground">
              {subtitle}
            </Label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {additionalButtons}

        {showCallButtons && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={onCall}
            >
              <Phone className="h-4 w-4" />
              <Label className="sr-only">Call</Label>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={onVideoCall}
            >
              <Video className="h-4 w-4" />
              <Label className="sr-only">Video call</Label>
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={onMoreOptions}
        >
          <MoreVertical className="h-4 w-4" />
          <Label className="sr-only">More options</Label>
        </Button>
      </div>
    </div>
  );
}
