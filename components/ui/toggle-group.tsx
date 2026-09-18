"use client";

// biome-ignore lint/performance/noNamespaceImport: Radix UI namespace import is standard pattern
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "class-variance-authority";
// biome-ignore lint/performance/noNamespaceImport: React namespace import for context and hooks
import * as React from "react";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "group/toggle-group flex w-fit items-center gap-1 rounded-full border border-border bg-[rgba(255,255,255,0.42)] p-1 shadow-sm backdrop-blur-sm dark:bg-[rgba(255,255,255,0.04)] data-[variant=outline]:shadow-xs",
        className
      )}
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-full border-0 shadow-none transition-all duration-200 hover:bg-[var(--surface-muted)] data-[state=on]:bg-[linear-gradient(135deg,var(--primary),#cfe5ff)] data-[state=on]:text-[var(--primary-foreground)] data-[state=on]:shadow-[0_10px_18px_rgba(129,119,196,0.15)] focus:z-10 focus-visible:z-10",
        className
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
