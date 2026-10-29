"use client"

import { cn } from "@/lib/utils"
import { SRGECIcon } from "../logo-srgec"

interface LoaderProps {
  variant?: "dots" | "typing" | "spinner" | "logo-spin"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loader({
  variant = "dots",
  size = "md",
  className,
}: LoaderProps) {
  if (variant === "typing") {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <span
          className={cn(
            "rounded-full bg-current animate-bounce [animation-delay:-0.3s]",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5"
          )}
        />
        <span
          className={cn(
            "rounded-full bg-current animate-bounce [animation-delay:-0.15s]",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5"
          )}
        />
        <span
          className={cn(
            "rounded-full bg-current animate-bounce",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5"
          )}
        />
      </span>
    )
  }

  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
          size === "sm" && "h-4 w-4 border-2",
          size === "md" && "h-5 w-5 border-2",
          size === "lg" && "h-6 w-6 border-3",
          className
        )}
      />
    )
  }

  if (variant === "logo-spin") {
    return (
      <div className={cn("inline-block animate-pulse", className)}>
        <SRGECIcon className="w-5 h-5" />
      </div>
    )
  }

  return null
}
