"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The children of the carousel (should be CarouselItem components)
   */
  children: React.ReactNode;
  /**
   * The index of the active slide
   */
  activeIndex?: number;
  /**
   * Callback when the active slide changes
   */
  onSlideChange?: (index: number) => void;
  /**
   * Show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  /**
   * Show pagination dots
   * @default true
   */
  showDots?: boolean;
  /**
   * Auto play the carousel
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Auto play interval in milliseconds
   * @default 5000
   */
  interval?: number;
  /**
   * Enable swipe gestures on touch devices
   * @default true
   */
  swipeable?: boolean;
  /**
   * Size of the pagination dots
   * @default "default"
   */
  dotSize?: "sm" | "default" | "lg";
  /**
   * Variant of the pagination dots
   * @default "dot"
   */
  dotVariant?: "dot" | "line" | "square";
  /**
   * Custom class for the pagination dots
   */
  dotClassName?: string;
  /**
   * Size of the navigation arrows
   * @default "default"
   */
  arrowSize?: "sm" | "default" | "lg";
  /**
   * Variant of the navigation arrows
   * @default "default"
   */
  arrowVariant?: "default" | "circle" | "square" | "ghost";
  /**
   * Position of the navigation arrows
   * @default "default"
   */
  arrowPosition?: "default" | "inside" | "outside";
  /**
   * Custom class for the navigation arrows
   */
  arrowClassName?: string;
  /**
   * Custom left arrow component
   */
  leftArrow?: React.ReactNode;
  /**
   * Custom right arrow component
   */
  rightArrow?: React.ReactNode;
  /**
   * Show arrow on hover only
   * @default false
   */
  arrowOnHover?: boolean;

  /**
   * Background color for the navigation arrows
   * @default "black/30"
   */
  arrowBgColor?: string;
  /**
   * Hover background color for the navigation arrows
   * @default "black/50"
   */
  arrowHoverBgColor?: string;
  /**
   * Custom class for the carousel container
   */
  className?: string;
  /**
   * Custom class for the carousel track
   */
  trackClassName?: string;
}

export function Carousel({
  children,
  activeIndex: controlledIndex,
  onSlideChange,
  arrowBgColor = "black/30",
  arrowHoverBgColor = "black/50",
  showArrows = true,
  showDots = true,
  autoPlay = false,
  interval = 5000,
  swipeable = true,
  dotSize = "default",
  dotVariant = "dot",
  arrowSize = "default",
  arrowVariant = "default",
  arrowPosition = "default",
  arrowOnHover = false,
  leftArrow,
  rightArrow,
  className,
  trackClassName,
  arrowClassName,
  dotClassName,
  ...props
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);
  const items = React.Children.toArray(children);
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const goToSlide = (index: number) => {
    const newIndex = (index + items.length) % items.length;
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    onSlideChange?.(newIndex);
  };

  const nextSlide = () => goToSlide(activeIndex + 1);
  const prevSlide = () => goToSlide(activeIndex - 1);

  // Auto play effect
  React.useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, activeIndex]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeable) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeable) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!swipeable) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Get dot size classes
  const getDotSizeClasses = () => {
    switch (dotSize) {
      case "sm":
        return "h-1.5 w-1.5";
      case "lg":
        return "h-2.5 w-2.5";
      case "default":
      default:
        return "h-2 w-2";
    }
  };

  // Get dot variant classes
  const getDotVariantClasses = (isActive: boolean) => {
    const baseClasses = "transition-all duration-300";
    const activeClasses = isActive ? "bg-white" : "bg-white/50";

    switch (dotVariant) {
      case "line":
        return cn(
          baseClasses,
          isActive ? "w-6" : "w-2",
          "h-1.5",
          activeClasses,
          dotClassName
        );
      case "square":
        return cn(
          baseClasses,
          isActive ? "scale-100" : "scale-75",
          getDotSizeClasses()
            .split(" ")
            .map((size) => size.replace("rounded-full", "rounded-sm")),
          activeClasses,
          dotClassName
        );
      case "dot":
      default:
        return cn(
          baseClasses,
          getDotSizeClasses(),
          activeClasses,
          dotClassName
        );
    }
  };

  // Get arrow size classes
  const getArrowSizeClasses = () => {
    switch (arrowSize) {
      case "sm":
        return "h-7 w-7";
      case "lg":
        return "h-12 w-12";
      case "default":
      default:
        return "h-10 w-10";
    }
  };

  // Get arrow variant classes
  const getArrowVariantClasses = (direction: "left" | "right") => {
    const baseClasses = cn(
      "absolute top-1/2 z-10 flex items-center justify-center text-white transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30",
      "transform -translate-y-1/2", // Ensure vertical centering
      arrowOnHover ? "opacity-0 group-hover:opacity-100" : "opacity-100",
      getArrowSizeClasses(),
      arrowClassName
    );

    const positionClasses = {
      left: {
        default: "left-4",
        inside: "left-4",
        outside: "-left-12",
      },
      right: {
        default: "right-4",
        inside: "right-4",
        outside: "-right-12",
      },
    };

    const variantClasses = {
      default: `bg-${arrowBgColor} hover:bg-${arrowHoverBgColor} rounded-full p-2`,
      circle: `bg-${arrowBgColor} hover:bg-${arrowHoverBgColor} rounded-full p-2`,
      square: `bg-${arrowBgColor} hover:bg-${arrowHoverBgColor} rounded-md p-2`,
      ghost: `bg-transparent hover:bg-${arrowHoverBgColor} rounded-full p-2`,
    };

    return cn(
      baseClasses,
      positionClasses[direction][arrowPosition],
      variantClasses[arrowVariant]
    );
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex transition-transform duration-300 ease-in-out",
          trackClassName
        )}
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {showArrows && items.length > 1 && (
        <>
          <Button
            type="button"
            onClick={prevSlide}
            className={getArrowVariantClasses("left")}
            aria-label="Previous slide"
          >
            {leftArrow || <ChevronLeft className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            onClick={nextSlide}
            className={getArrowVariantClasses("right")}
            aria-label="Next slide"
          >
            {rightArrow || <ChevronRight className="h-5 w-5" />}
          </Button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {items.map((_, index) => (
            <Button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={cn(
                "rounded-full p-0 transition-all hover:scale-110",
                getDotVariantClasses(index === activeIndex)
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({
  children,
  className,
  ...props
}: CarouselItemProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
