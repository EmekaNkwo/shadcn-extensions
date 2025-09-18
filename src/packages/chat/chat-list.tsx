"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface ChatListItem {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  unreadCount?: number;
  isActive?: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface ChatListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ChatListItem[];
  activeChatId?: string;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
  title?: string;
  showSearch?: boolean;
  showNewChatButton?: boolean;
  itemClassName?: string;
  activeItemClassName?: string;
  /**
   * Whether the chat list is open (for mobile)
   */
  isOpen?: boolean;
  /**
   * Callback when the chat list is closed (for mobile)
   */
  onClose?: () => void;
}

export function ChatList({
  className,
  items,
  activeChatId,
  onChatSelect,
  onNewChat,
  title = "Chats",
  showSearch = true,
  showNewChatButton = true,
  itemClassName,
  activeItemClassName,
  isOpen = true,
  onClose,
  ...props
}: ChatListProps) {
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const handleItemClick = (chatId: string) => {
    onChatSelect?.(chatId);
    if (isMobile) {
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full md:w-80 bg-gray-50 border-r transition-transform duration-300 ease-in-out",
        "fixed inset-0 z-50 md:static md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Label className="text-lg font-semibold">{title}</Label>
        <div className="flex items-center gap-2">
          {showNewChatButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onNewChat}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">New chat</span>
            </Button>
          )}
          {isOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <Label className="sr-only">Close menu</Label>
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chats..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* Chat List */}
      <ScrollArea className="">
        <div className="divide-y">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-3 p-3 hover:bg-accent/50",
                item.isActive || activeChatId === item.id
                  ? cn("bg-accent", activeItemClassName)
                  : "",
                itemClassName
              )}
              onClick={() => handleItemClick(item.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.avatar} alt={item.title} />
                <AvatarFallback>
                  {item.title
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Label className="truncate font-medium">{item.title}</Label>
                  {item.lastMessageTime && (
                    <Label className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatTimeAgo(item.lastMessageTime)}
                    </Label>
                  )}
                </div>
                <Label className="truncate text-sm text-muted-foreground">
                  {item.lastMessage || item.subtitle}
                </Label>
              </div>
              {item.unreadCount ? (
                <Badge
                  variant="default"
                  className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {item.unreadCount > 9 ? "9+" : item.unreadCount}
                </Badge>
              ) : null}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffInSeconds < 604800)
    return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
