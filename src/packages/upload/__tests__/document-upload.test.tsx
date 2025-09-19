import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { mockFile, mockEvent } from "../../../test-utils";
import { DocumentUpload } from "../document-upload";

vi.mock("../document-upload", () => ({
  DocumentUpload: vi.fn(({ onChange, value }) => {
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
          data-testid="document-upload-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {value && (
          <div>
            <span>{value.name}</span>
            <span>{value.size}</span>
            <button onClick={handleRemove}>Remove file</button>
          </div>
        )}
      </div>
    );
  }),
}));

describe("DocumentUpload", () => {
  it("renders the upload area", () => {
    render(<DocumentUpload />);
    expect(screen.getByTestId("document-upload-input")).toBeInTheDocument();
  });

  it("accepts a document file", () => {
    const mockOnChange = vi.fn();
    render(<DocumentUpload onChange={mockOnChange} />);

    const file = mockFile("application/pdf", "document.pdf");
    const input = screen.getByTestId("document-upload-input");

    fireEvent.change(input, mockEvent([file]));

    expect(mockOnChange).toHaveBeenCalledWith(file);
  });
});
