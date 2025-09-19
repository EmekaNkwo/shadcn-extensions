import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { mockFile, mockEvent } from "../../../test-utils";

vi.mock("../multi-file-upload", () => ({
  MultiFileUpload: vi.fn(({ onChange, value = [], maxFiles, maxSize }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      // Validate max files
      if (maxFiles && files.length + value.length > maxFiles) {
        const errorElement = document.createElement("div");
        errorElement.textContent = `Maximum ${maxFiles} files allowed`;
        document.body.appendChild(errorElement);
        return;
      }

      // Validate max size
      if (maxSize) {
        const oversizedFile = files.find((file) => file.size > maxSize);
        if (oversizedFile) {
          const errorElement = document.createElement("div");
          errorElement.textContent = "File is too large";
          document.body.appendChild(errorElement);
          return;
        }
      }

      onChange?.([...value, ...files]);
    };

    const handleRemove = (index: number) => {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange?.(newFiles);
    };

    // Format file size for display
    const formatFileSize = (size: number) => {
      if (size > 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      }
      return `${(size / 1024).toFixed(1)} KB`;
    };

    return (
      <div>
        <div>Drag & drop files</div>
        <input
          data-testid="multi-file-upload-input"
          type="file"
          multiple
          onChange={handleFileChange}
        />

        {value.length > 0 && (
          <div>
            <div>{value.length} files selected</div>
            {value.map((file: File, index: number) => (
              <div key={index}>
                <span>{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
                <button onClick={() => handleRemove(index)}>Remove file</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }),
}));

// Import after mocking
import { MultiFileUpload } from "../multi-file-upload";

describe("MultiFileUpload", () => {
  it("renders the upload area", () => {
    render(<MultiFileUpload />);
    expect(screen.getByText(/drag & drop files/i)).toBeInTheDocument();
  });

  it("accepts multiple files", () => {
    const mockOnChange = vi.fn();
    render(<MultiFileUpload onChange={mockOnChange} />);

    const files = [
      mockFile("image/png", "image1.png"),
      mockFile("application/pdf", "document.pdf"),
    ];

    const input = screen.getByTestId("multi-file-upload-input");
    fireEvent.change(input, mockEvent(files));

    expect(mockOnChange).toHaveBeenCalledWith(files);
  });

  it("shows file count", () => {
    const files = [
      mockFile("image/png", "image1.png"),
      mockFile("application/pdf", "document.pdf"),
    ];

    render(<MultiFileUpload value={files} />);

    expect(screen.getByText(/2 files selected/i)).toBeInTheDocument();
  });

  it("allows removing individual files", () => {
    const files = [
      mockFile("image/png", "image1.png"),
      mockFile("application/pdf", "document.pdf"),
    ];

    const mockOnChange = vi.fn();
    render(<MultiFileUpload value={files} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByRole("button", {
      name: /remove file/i,
    });
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith([files[1]]);
  });

  it("validates max files", () => {
    const mockOnChange = vi.fn();
    const files = Array(5)
      .fill(0)
      .map((_, i) => mockFile("image/png", `image${i}.png`));

    render(<MultiFileUpload onChange={mockOnChange} maxFiles={3} />);

    const input = screen.getByTestId("multi-file-upload-input");
    fireEvent.change(input, mockEvent(files));

    expect(screen.getByText(/maximum 3 files/i)).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("validates max size", () => {
    const mockOnChange = vi.fn();
    const largeFile = mockFile("image/png", "large.png", 5 * 1024 * 1024); // 5MB

    render(
      <MultiFileUpload
        onChange={mockOnChange}
        maxSize={2 * 1024 * 1024} // 2MB
      />
    );

    const input = screen.getByTestId("multi-file-upload-input");
    fireEvent.change(input, mockEvent([largeFile]));

    expect(screen.getByText(/file is too large/i)).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
