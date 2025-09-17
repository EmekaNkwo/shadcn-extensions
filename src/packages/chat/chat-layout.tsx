"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChatContainer, ChatContainerProps } from "./chat-container";
import { ChatList, ChatListProps } from "./chat-list";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ChatLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Props for the chat list
   */
  chatListProps: Omit<ChatListProps, "onChatSelect" | "activeChatId">;
  /**
   * Props for the chat container
   */
  chatContainerProps: Omit<ChatContainerProps, "children">;
  /**
   * The currently active chat ID
   */
  activeChatId?: string;
  /**
   * Callback when a chat is selected
   */
  onChatSelect?: (chatId: string) => void;
  /**
   * The children to render inside the chat container
   */
  children: React.ReactNode;
  /**
   * Whether to show the chat list
   * @default true
   */

  showChatList?: boolean;
  /**
   * The width of the chat list
   * @default "320px"
   */
  chatListWidth?: string;
}

export function ChatLayout({
  className,
  chatListProps,
  chatContainerProps,
  activeChatId,
  onChatSelect,
  children,
  showChatList = true,
  chatListWidth = "320px",
  ...props
}: ChatLayoutProps) {
  const [isChatListOpen, setIsChatListOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden",
        "bg-background",
        className
      )}
      {...props}
    >
      {isMobile && !isChatListOpen && (
        <Button
          variant="ghost"
          size="icon"
          className=" md:hidden"
          onClick={() => setIsChatListOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {isChatListOpen || !isMobile ? (
        <>
          {showChatList && (
            <div
              className="h-full border-r"
              style={{ width: chatListWidth, minWidth: chatListWidth }}
            >
              <ChatList
                {...chatListProps}
                activeChatId={activeChatId}
                onChatSelect={onChatSelect}
                isOpen={isChatListOpen}
                onClose={() => setIsChatListOpen(false)}
              />
            </div>
          )}
        </>
      ) : null}
      <ChatContainer {...chatContainerProps}>{children}</ChatContainer>
      {/* <div className="flex-1 overflow-hidden"></div> */}
    </div>
  );
}
