import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';

interface ChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
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
declare function ChatHeader({ className, title, subtitle, avatar, onBack, onCall, onVideoCall, onMoreOptions, showBackButton, showCallButtons, additionalButtons, ...props }: ChatHeaderProps): react_jsx_runtime.JSX.Element;

interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {
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
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | string;
    /**
     * Whether to show a scrollbar when content overflows
     * @default true
     */
    scrollable?: boolean;
    /**
     * Optional header component
     */
    header?: React.ReactNode;
    /**
     * Optional footer component
     */
    footer?: React.ReactNode;
    /**
     * Additional class name for the content wrapper
     */
    contentClassName?: string;
    /**
     * Additional class name for the header
     */
    headerClassName?: string;
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
    maxHeight?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | string;
}
declare function ChatContainer({ className, children, variant, height, maxHeight, maxWidth, scrollable, header, footer, contentClassName, headerClassName, footerClassName, showHeader, headerProps, style, ...props }: ChatContainerProps): react_jsx_runtime.JSX.Element;

type MessageRole = "user" | "ai" | "system" | "assistant";
type MessageVariant = "default" | "primary" | "success" | "warning" | "error";
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
declare function ChatMessage({ role, variant, name, avatar, timestamp, isRead, showAvatar, showTimestamp, isEditing, isPending, onCopy, onEdit, onDelete, className, bubbleClassName, avatarClassName, timestampClassName, actionsClassName, children, ...props }: ChatMessageProps): react_jsx_runtime.JSX.Element;

interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
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
declare function ChatInput({ className, value: valueProp, onValueChange, onSend, placeholder, sendButtonText, showSendButton, showAttachmentButton, showEmojiButton, disabled, isLoading, variant, size, additionalButtons, onAttachmentClick, onEmojiClick, inputClassName, sendButtonClassName, actionButtonClassName, ...props }: ChatInputProps): react_jsx_runtime.JSX.Element;

interface ChatListItem {
    id: string;
    title: string;
    subtitle?: string;
    avatar?: string;
    unreadCount?: number;
    isActive?: boolean;
    lastMessage?: string;
    lastMessageTime?: Date;
}
interface ChatListProps extends React.HTMLAttributes<HTMLDivElement> {
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
    /**
     * Breakpoint for mobile view
     * @default "md" (768px)
     */
    breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
}
declare function ChatList({ className, items, activeChatId, onChatSelect, onNewChat, title, showSearch, showNewChatButton, itemClassName, activeItemClassName, isOpen, onClose, breakpoint, ...props }: ChatListProps): react_jsx_runtime.JSX.Element;

interface ChatLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
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
declare function ChatLayout({ className, chatListProps, chatContainerProps, activeChatId, onChatSelect, children, showChatList, chatListWidth, ...props }: ChatLayoutProps): react_jsx_runtime.JSX.Element;

export { ChatContainer, ChatHeader, ChatInput, ChatLayout, ChatList, ChatMessage };
