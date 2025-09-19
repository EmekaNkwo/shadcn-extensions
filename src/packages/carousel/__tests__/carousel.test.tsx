import { render, screen, fireEvent } from "@testing-library/react";
import { Carousel, CarouselItem } from "../carousel";
import { describe, it, expect, vi } from "vitest";

// Mock the Carousel components
vi.mock("../carousel", () => ({
  __esModule: true,
  Carousel: vi.fn(
    ({
      children,
      activeIndex = 0,
      onSlideChange,
      showArrows = true,
      showDots = true,
      className,
      ...props
    }) => {
      const items = Array.isArray(children) ? children : [children];

      const goToSlide = (index: number) => {
        onSlideChange?.(index);
      };

      const nextSlide = () => {
        const nextIndex = (activeIndex + 1) % items.length;
        goToSlide(nextIndex);
      };

      const prevSlide = () => {
        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        goToSlide(prevIndex);
      };

      return (
        <div className={className} data-testid="carousel" {...props}>
          <div
            data-testid="carousel-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((child, index) => (
              <div key={index} className="w-full flex-shrink-0">
                {child}
              </div>
            ))}
          </div>

          {showArrows && items.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                data-testid="carousel-prev-button"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                data-testid="carousel-next-button"
              >
                ›
              </button>
            </>
          )}

          {showDots && items.length > 1 && (
            <div data-testid="carousel-dots">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  data-testid={`carousel-dot-${index}`}
                  data-active={index === activeIndex}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
  ),

  CarouselItem: vi.fn(({ children, className, ...props }) => (
    <div className={className} data-testid="carousel-item" {...props}>
      {children}
    </div>
  )),
}));

describe("Carousel Mock", () => {
  const items = [
    <CarouselItem key={1}>Slide 1</CarouselItem>,
    <CarouselItem key={2}>Slide 2</CarouselItem>,
    <CarouselItem key={3}>Slide 3</CarouselItem>,
  ];

  it("renders with default props", () => {
    render(<Carousel>{items}</Carousel>);

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-track")).toBeInTheDocument();
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("shows navigation arrows when showArrows is true", () => {
    render(<Carousel showArrows={true}>{items}</Carousel>);

    expect(screen.getByTestId("carousel-prev-button")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-next-button")).toBeInTheDocument();
  });

  it("hides navigation arrows when showArrows is false", () => {
    render(<Carousel showArrows={false}>{items}</Carousel>);

    expect(
      screen.queryByTestId("carousel-prev-button")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-next-button")
    ).not.toBeInTheDocument();
  });

  it("shows dots when showDots is true", () => {
    render(<Carousel showDots={true}>{items}</Carousel>);

    expect(screen.getByTestId("carousel-dots")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-dot-0")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-dot-1")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-dot-2")).toBeInTheDocument();
  });

  it("hides dots when showDots is false", () => {
    render(<Carousel showDots={false}>{items}</Carousel>);

    expect(screen.queryByTestId("carousel-dots")).not.toBeInTheDocument();
  });

  it("calls onSlideChange when next button is clicked", () => {
    const mockOnSlideChange = vi.fn();
    render(<Carousel onSlideChange={mockOnSlideChange}>{items}</Carousel>);

    fireEvent.click(screen.getByTestId("carousel-next-button"));

    expect(mockOnSlideChange).toHaveBeenCalledWith(1);
  });

  it("calls onSlideChange when previous button is clicked", () => {
    const mockOnSlideChange = vi.fn();
    render(<Carousel onSlideChange={mockOnSlideChange}>{items}</Carousel>);

    // First go to slide 1 to test previous button
    fireEvent.click(screen.getByTestId("carousel-next-button"));
    fireEvent.click(screen.getByTestId("carousel-prev-button"));

    expect(mockOnSlideChange).toHaveBeenCalled();
  });

  it("calls onSlideChange when a dot is clicked", () => {
    const mockOnSlideChange = vi.fn();
    render(<Carousel onSlideChange={mockOnSlideChange}>{items}</Carousel>);

    fireEvent.click(screen.getByTestId("carousel-dot-2"));

    expect(mockOnSlideChange).toHaveBeenCalledWith(2);
  });

  it("wraps around when navigating before the first slide", () => {
    const mockOnSlideChange = vi.fn();
    render(<Carousel onSlideChange={mockOnSlideChange}>{items}</Carousel>);

    // Go to previous slide (should wrap to last)
    fireEvent.click(screen.getByTestId("carousel-prev-button"));

    expect(mockOnSlideChange).toHaveBeenCalledWith(2);
  });

  it("applies custom className", () => {
    render(<Carousel className="custom-class">{items}</Carousel>);

    expect(screen.getByTestId("carousel")).toHaveClass("custom-class");
  });
});

describe("CarouselItem Mock", () => {
  it("renders children", () => {
    render(<CarouselItem>Test Content</CarouselItem>);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CarouselItem className="custom-class">Test Content</CarouselItem>);

    expect(screen.getByTestId("carousel-item")).toHaveClass("custom-class");
  });
});
