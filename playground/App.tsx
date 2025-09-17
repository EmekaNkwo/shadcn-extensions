// playground/App.tsx
import React, { useState } from "react";
import { ChatLayout, ChatMessage, ChatInput, ChatList } from "../src";

export default function App() {
  const [activeChat, setActiveChat] = useState("1");
  const [messages, setMessages] = useState(() => {
    const sampleMessages = [];
    for (let i = 1; i <= 50; i++) {
      const isUser = i % 2 === 1;
      sampleMessages.push({
        id: i,
        role: isUser ? "user" : "ai",
        text: isUser
          ? `Message ${i}: This is a sample user message.`
          : `Message ${i}: This is a sample AI response.`,
      });
    }
    return sampleMessages;
  });

  const chatListItems = [
    {
      id: "1",
      title: "Support Chat",
      subtitle: "AI Assistant",
      lastMessage: "How can I help you today?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
    },
    {
      id: "2",
      title: "Team Discussion",
      subtitle: "John, Sarah, Mike",
      lastMessage: "Let's discuss the new project",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "3",
      title: "Customer Support",
      subtitle: "Jane Smith",
      lastMessage: "Thanks for your help!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];

  return (
    <div className="h-screen bg-background">
      <ChatLayout
        chatListProps={{
          items: chatListItems,
          onNewChat: () => console.log("New chat clicked"),
        }}
        chatContainerProps={{
          showHeader: true,
          headerProps: {
            title: "AI Assistant",
            subtitle: "Online",
            showBackButton: false,
          },
          contentClassName: "h-full ",
          maxWidth: "full",
          maxHeight: "full",
          scrollable: true,
        }}
        activeChatId={activeChat}
        onChatSelect={setActiveChat}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role as "user" | "ai" | "system" | "assistant"}
                variant="primary"
                name={m.role === "user" ? "You" : "AI Assistant"}
                timestamp={new Date()}
              >
                {m.text}
              </ChatMessage>
            ))}
          </div>
          <div className="border-t p-4">
            <ChatInput
              onSend={(text) =>
                setMessages((prev) => [
                  ...prev,
                  { id: Date.now(), role: "user", text },
                ])
              }
            />
          </div>
        </div>
      </ChatLayout>
    </div>
  );
}
