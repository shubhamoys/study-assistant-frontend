import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      suppressHydrationWarning
      className={cn(
        "min-h-24 w-full min-w-0 resize-y rounded-[var(--radius-btn)] border-[3px] border-border bg-input px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
