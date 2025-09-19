import { ChatInput } from "..";
import { render, screen, fireEvent } from "@testing-library/react";

describe("ChatInput", () => {
  it("calls onSend when Enter is pressed", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSend).toHaveBeenCalledWith("Hello!");
  });
});
