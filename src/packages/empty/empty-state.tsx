"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The title of the empty state
   */
  title?: string;
  /**
   * The description of the empty state
   */
  description?: string;
  /**
   * The icon to display
   */
  icon?: React.ReactNode;
  /**
   * The action button
   */
  action?: React.ReactNode;
  /**
   * Additional content to display below the action
   */
  footer?: React.ReactNode;
}

/**
 * A component to display an empty state with an icon, title, description, and optional action.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  footer,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 p-8 text-center",
        className
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}

      <div className="space-y-2">
        {title && <Label className="text-lg font-medium">{title}</Label>}
        {description && (
          <Label className="text-sm text-muted-foreground">{description}</Label>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
      {children}
      {footer && (
        <div className="pt-4 text-xs text-muted-foreground">{footer}</div>
      )}
    </div>
  );
}
