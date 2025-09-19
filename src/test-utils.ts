import { vi } from "vitest";

export const createTestFile = (
  name: string,
  size: number,
  type: string
): File => {
  const file = new File(["test"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

export const mockFile = (
  type = "image/png",
  name = "test.png",
  size = 1000
) => {
  return createTestFile(name, size, type);
};

export const mockEvent = (files: File[]) => ({
  target: { files },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
});
