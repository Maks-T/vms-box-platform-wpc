import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { Link } from '@inertiajs/react';
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export interface LegacyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withArrow?: boolean;
  href?: string;
  target?: string;
}

const Button = React.forwardRef<HTMLButtonElement, LegacyButtonProps>(
  ({ className, variant, size, asChild = false, withArrow = false, href, children, ...props }, ref) => {
    if (href) {
      const isExternal = href.startsWith('http') || props.target === '_blank';
      const Comp = isExternal ? 'a' : Link;

      return (
        // @ts-ignore
        <Comp
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
          {withArrow && <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />}
        </Comp>
      );
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? children : (
          <>
            {children}
            {withArrow && <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };