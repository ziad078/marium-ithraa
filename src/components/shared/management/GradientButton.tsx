import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type GradientButtonProps = React.ComponentProps<typeof Button>

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={cn(
          "text-white shadow-sm",
          "bg-linear-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-600/90 hover:to-violet-600/90",
          className
        )}
      />
    )
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton }

