import { render, screen } from "@testing-library/react";
import { EmptyState } from "../empty-state";
import { describe, it, expect } from "vitest";

// Mock the Label component
vi.mock("@/components/ui/label", () => ({
  Label: vi.fn(({ children, className }) => (
    <span className={className}>{children}</span>
  )),
}));

// Mock the cn utility
vi.mock("@/lib/utils", () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(" ")),
}));

describe("EmptyState", () => {
  it("displays the title when provided", () => {
    const title = "No items found";
    render(<EmptyState title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(title)).toHaveClass("text-lg font-medium");
  });

  it("displays the description when provided", () => {
    const description = "You haven't created any items yet";
    render(<EmptyState description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(description)).toHaveClass(
      "text-sm text-muted-foreground"
    );
  });

  it("displays the icon when provided", () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    render(<EmptyState icon={icon} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("displays the action when provided", () => {
    const action = <button data-testid="test-action">Create Item</button>;
    render(<EmptyState action={action} />);

    expect(screen.getByTestId("test-action")).toBeInTheDocument();
  });

  it("displays the footer when provided", () => {
    const footer = "Need help? Contact support";
    render(<EmptyState footer={footer} />);

    expect(screen.getByText(footer)).toBeInTheDocument();
    expect(screen.getByText(footer)).toHaveClass(
      "pt-4 text-xs text-muted-foreground"
    );
  });

  it("renders children when provided", () => {
    const children = <div data-testid="test-children">Additional content</div>;
    render(<EmptyState>{children}</EmptyState>);

    expect(screen.getByTestId("test-children")).toBeInTheDocument();
  });

  it("applies additional props to the container element", () => {
    render(<EmptyState data-testid="custom-testid" aria-label="Empty state" />);

    expect(screen.getByTestId("custom-testid")).toBeInTheDocument();
    expect(screen.getByLabelText("Empty state")).toBeInTheDocument();
  });

  it("renders all elements together correctly", () => {
    const title = "No items";
    const description = "Create your first item";
    const icon = <div data-testid="icon">Icon</div>;
    const action = <button>Create</button>;
    const footer = "Footer text";
    const children = <div>Children content</div>;

    render(
      <EmptyState
        title={title}
        description={description}
        icon={icon}
        action={action}
        footer={footer}
      >
        {children}
      </EmptyState>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByText("Footer text")).toBeInTheDocument();
    expect(screen.getByText("Children content")).toBeInTheDocument();
  });
});
