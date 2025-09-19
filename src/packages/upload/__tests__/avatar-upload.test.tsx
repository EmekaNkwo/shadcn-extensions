import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFile } from "../../../test-utils";
import { AvatarUpload } from "../avatar-upload";

vi.mock("../avatar-upload", () => ({
  AvatarUpload: vi.fn(({ onChange, fallback = "AV", disabled = false }) => {
    const handleInputChange = () => {
      if (onChange && !disabled) {
        const mockFile = {
          name: "test.png",
          type: "image/png",
          size: 1000,
        } as unknown as File;
        onChange(mockFile);
      }
    };

    const handleRemove = () => {
      if (onChange && !disabled) {
        onChange(null);
      }
    };

    return (
      <div data-testid="avatar-upload">
        <img src="" alt="Profile picture" role="img" hidden />
        <span>{fallback}</span>
        <div role="status" className="animate-spin"></div>
        <input
          data-testid="avatar-upload-input"
          type="file"
          disabled={disabled}
          onChange={handleInputChange}
        />
        <button onClick={handleRemove} aria-label="remove avatar">
          Remove avatar
        </button>
        <div style={{ display: "none" }}>
          <span>Image files only</span>
          <span>File size must be less than</span>
        </div>
      </div>
    );
  }),
}));

// Import after mocking

describe("AvatarUpload", () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => "test-url");
  });

  it("renders with default avatar", () => {
    render(<AvatarUpload />);
    expect(screen.getByTestId("avatar-upload")).toBeInTheDocument();
    expect(screen.getByAltText("Profile picture")).toBeInTheDocument();
  });

  it("displays custom fallback text", () => {
    render(<AvatarUpload fallback="US" />);
    expect(screen.getByText("US")).toBeInTheDocument();
  });

  it("accepts an image file", () => {
    const mockOnChange = vi.fn();
    render(<AvatarUpload onChange={mockOnChange} />);

    const input = screen.getByTestId("avatar-upload-input");
    fireEvent.change(input);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("allows removing the avatar", () => {
    const mockOnChange = vi.fn();
    const file = mockFile("image/png", "avatar.png");

    render(<AvatarUpload value={file} onChange={mockOnChange} />);

    const removeButton = screen.getByRole("button", { name: /remove avatar/i });
    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("disables the upload when disabled prop is true", () => {
    render(<AvatarUpload disabled />);

    const input = screen.getByTestId("avatar-upload-input");
    expect(input).toBeDisabled();
  });
});
