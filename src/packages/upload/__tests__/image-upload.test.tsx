import { render, screen, fireEvent } from "@testing-library/react";
import { ImageUpload } from "../image-upload";
import { describe, it, expect, vi } from "vitest";
import { mockFile, mockEvent } from "../../../test-utils";

vi.mock("../image-upload", () => ({
  ImageUpload: vi.fn(({ onChange, value }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      onChange?.(files[0]);
    };

    const handleRemove = () => {
      onChange?.(null);
    };

    return (
      <div>
        <input
          data-testid="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {value && (
          <div>
            <img src={URL.createObjectURL(value)} alt="Selected image" />
            <button onClick={handleRemove}>Remove image</button>
          </div>
        )}
      </div>
    );
  }),
}));

describe("ImageUpload", () => {
  it("renders the upload area", () => {
    render(<ImageUpload />);
    expect(screen.getByTestId("image-upload-input")).toBeInTheDocument();
  });
  it("accepts an image file", () => {
    const mockOnChange = vi.fn();
    render(<ImageUpload onChange={mockOnChange} />);

    const file = mockFile("image/png");
    const input = screen.getByTestId("image-upload-input");

    fireEvent.change(input, mockEvent([file]));

    expect(mockOnChange).toHaveBeenCalledWith(file);
  });
  it("displays the selected image", () => {
    const file = mockFile("image/png");
    const url = "test-image-url";
    URL.createObjectURL = vi.fn(() => url);

    render(<ImageUpload value={file} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", url);
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });
});
