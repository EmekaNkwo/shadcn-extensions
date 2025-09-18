# ShadUI Extension 🚀

A **ShadCN-style CLI** for scaffolding custom UI components into your project.  
Currently includes:

- **Chat UI system** (`ChatContainer`, `ChatMessage`, `ChatInput`)
- **File Upload Components** (`ImageUpload`, `DocumentUpload`, `MultiFileUpload`)
- **Empty State** (`EmptyState`)
- **Carousel** (`Carousel`, `CarouselItem`)

Built with **ShadUI + Tailwind + Radix UI**.

---

## ✨ Features

- ShadCN-style installation → components copied into your project (`src/components/`)
- Ready-to-use **Chat UI system**
- **File Upload Components**:
  - `ImageUpload`: For single image uploads with preview
  - `DocumentUpload`: For single file uploads with type validation
  - `MultiFileUpload`: For handling multiple file uploads with previews
- **Empty State**:
  - `EmptyState`: For displaying an empty state with an icon, title, description, and optional action
- **Carousel**:
  - `Carousel`: For creating carousels with multiple items
  - `CarouselItem`: For creating carousel items
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
npx shadui-extension add chat
```

This will create a `src/components/chat` directory with the following files:

- `src/components/chat/chat-container.tsx`
- `src/components/chat/chat-header.tsx`
- `src/components/chat/chat-input.tsx`
- `src/components/chat/chat-list.tsx`
- `src/components/chat/chat-message.tsx`
- `src/components/chat/index.ts`

```bash
npx shadui-extension add upload
```

This will create a `src/components/upload` directory with the following files:

- `src/components/upload/image-upload.tsx`
- `src/components/upload/document-upload.tsx`
- `src/components/upload/multi-file-upload.tsx`
- `src/components/upload/single-file-upload.tsx`
- `src/components/upload/index.ts`

```bash
npx shadui-extension add empty
```

This will create a `src/components/empty` directory with the following files:

- `src/components/empty/empty-state.tsx`
- `src/components/empty/index.ts`

```bash
npx shadui-extension add carousel
```

This will create a `src/components/carousel` directory with the following files:

- `src/components/carousel/carousel.tsx`
- `src/components/carousel/carousel-item.tsx`
- `src/components/carousel/index.ts`

### Project Structure After Install

```bash
src/
├── hooks/
│   └── use-media-query.ts
├── components/
│   ├── chat/
│   │   ├── chat-container.tsx
│   │   ├── chat-header.tsx
│   │   ├── chat-input.tsx
│   │   ├── chat-layout.tsx
│   │   ├── chat-list.tsx
│   │   ├── chat-message.tsx
│   │   └── index.ts
│   └── upload/
│       ├── image-upload.tsx
│       ├── document-upload.tsx
│       ├── multi-file-upload.tsx
│       ├── single-file-upload.tsx
│       └── index.ts
│   └── empty/
│       ├── empty-state.tsx
│       └── index.ts
│   └── carousel/
│       ├── carousel.tsx
│       ├── carousel-item.tsx
│       └── index.ts
└── components/ui/       (from ShadCN)
    ├── avatar.tsx
    ├── button.tsx
    ├── label.tsx
    ├── scroll-area.tsx
    └── utils.ts
```

## 📚 Component Usage

### Chat Components

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

### Upload Components

```tsx
import {
  ImageUpload,
  DocumentUpload,
  MultiFileUpload,
  SingleFileUpload,
} from "@/components/upload";
```

Use the components in your app:

```tsx
export default function App() {
  return (
    <ImageUpload />
    <DocumentUpload />
    <MultiFileUpload />
    <SingleFileUpload />
  );
}
```

### Empty State

```tsx
import { EmptyState } from "@/components/empty";
```

Use the components in your app:

```tsx
export default function App() {
  return (
    <EmptyState
      icon={<UploadIcon className="h-8 w-8" />}
      title="No files uploaded"
      description="Drag and drop files here or click to upload"
      action={
        <Button>
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      }
    />
  );
}
```

### Carousel Components

```tsx
import { Carousel, CarouselItem } from "@/components/carousel";
```

Use the components in your app:

```tsx
export default function App() {
  return (
    <Carousel>
      <CarouselItem>Item 1</CarouselItem>
      <CarouselItem>Item 2</CarouselItem>
      <CarouselItem>Item 3</CarouselItem>
    </Carousel>
  );
}
```

## 📦 License

MIT © 2025 Haymaykus
