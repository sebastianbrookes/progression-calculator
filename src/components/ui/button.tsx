import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-normal whitespace-nowrap transition-[color,background-color,box-shadow,scale] duration-150 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary font-medium text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)] hover:bg-primary/90",
        outline: "bg-surface text-foreground ring-1 ring-white/10 hover:bg-white/[0.07]",
        ghost: "text-secondary-foreground hover:bg-white/5 hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonStyleProps = VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: React.ComponentProps<"button"> & ButtonStyleProps) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

// A link that looks like a button, for actions that navigate.
function ButtonLink({ className, variant, size, ...props }: React.ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, ButtonLink, buttonVariants }
