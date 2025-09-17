# ShadUI Extension 🚀

A **ShadCN-style CLI** for scaffolding custom UI components into your project.  
Currently includes a **Chat UI system** (`ChatContainer`, `ChatMessage`, `ChatInput`) built with **ShadUI + **Tailwind + Radix UI\*\*.

---

## ✨ Features

- ShadCN-style installation → components copied into your project (`src/components/`)
- Ready-to-use **Chat UI system**
- Built with **TailwindCSS** and **Radix UI**
- CLI automatically patches **Tailwind theme tokens**

---

## 📦 Installation

Install the package as a dev dependency:

```bash
npm install -D shadui-extension

# or

yarn add -D shadui-extension

# or

pnpm add -D shadui-extension
```

---

## 📦 Usage

```bash
npx shadui-extension add <chat>
```

This will create a `src/components/chat` directory with the following files:

- `src/components/chat/chat-container.tsx`
- `src/components/chat/chat-header.tsx`
- `src/components/chat/chat-input.tsx`
- `src/components/chat/chat-list.tsx`
- `src/components/chat/chat-message.tsx`
- `src/components/chat/index.ts`

### Project Structure After Install

```bash
src/
├── hooks/
│   └── use-media-query.ts
├── components/
│   └── chat/
│       ├── chat-container.tsx
│       ├── chat-header.tsx
│       ├── chat-input.tsx
│       ├── chat-layout.tsx
│       ├── chat-list.tsx
│       ├── chat-message.tsx
│       └── index.ts
└── components/ui/       (from ShadCN)
    ├── avatar.tsx
    ├── button.tsx
    ├── label.tsx
    ├── scroll-area.tsx
    └── utils.ts
```

Import the components into your app:

```tsx
import { ChatContainer, ChatMessage, ChatInput } from "@/components/chat";
```

Use the components in your app:

```tsx
export default function App() {
  return (
    <ChatContainer>
      <ChatMessage role="ai">Hello! 👋</ChatMessage>
      <ChatMessage role="user">Hi there!</ChatMessage>
      <ChatInput onSend={(msg) => console.log(msg)} />
    </ChatContainer>
  );
}
```

## 📦 License

MIT © 2025 Haymaykus
