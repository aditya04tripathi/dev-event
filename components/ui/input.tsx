import type * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-10 w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-all duration-150",
        // Placeholder and text
        "placeholder:text-muted-foreground text-foreground",
        // Border states
        "border-input hover:border-muted-foreground/50",
        // Focus states
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-ring",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
        // Error state
        error && "border-destructive focus-visible:ring-destructive/30",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
