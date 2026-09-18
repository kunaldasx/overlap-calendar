import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium text-sm outline-none transition-all duration-200 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--primary),#cfe5ff)] text-[var(--primary-foreground)] shadow-[0_10px_20px_rgba(129,119,196,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(129,119,196,0.22)]",
        destructive:
          "bg-[linear-gradient(135deg,var(--destructive),#f3d4cc)] text-[var(--foreground)] shadow-[0_10px_18px_rgba(193,144,132,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(193,144,132,0.22)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border bg-white/70 text-foreground shadow-sm hover:-translate-y-0.5 hover:bg-[var(--surface-muted)] dark:border-[rgba(176,192,224,0.18)] dark:bg-[rgba(255,255,255,0.03)] dark:text-foreground",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--secondary)]/80",
        ghost:
          "text-foreground hover:bg-[var(--surface-muted)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.04)]",
        link: "text-[var(--foreground)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
