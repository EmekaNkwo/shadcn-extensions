import { ChatContainer, ChatMessage } from "..";
import { render, screen } from "@testing-library/react";

describe("ChatContainer", () => {
  it("renders children messages", () => {
    render(
      <ChatContainer>
        <ChatMessage role="ai">Hello</ChatMessage>
        <ChatMessage role="user">Hi</ChatMessage>
      </ChatContainer>
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });
});
