import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const headingVariants = cva("word-wrap-break-word font-sans not-italic", {
  variants: {
    variant: {
      h1: "text-[32px] md:text-[40px] font-bold leading-[1.15] text-foreground tracking-[-0.02em]",
      h2: "text-[28px] md:text-[34px] font-semibold leading-[1.2] text-foreground tracking-tight",
      h3: "text-[20px] md:text-[24px] font-semibold leading-[1.3] text-foreground",
      h4: "text-[16px] md:text-[18px] font-semibold leading-[1.4] text-foreground",
    }
  },
  defaultVariants: { variant: "h2" },
});

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  asChild?: boolean;
  as?: "h1" | "h2" | "h3" | "h4";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, asChild = false, as: Component = "h2", ...props }, ref) => {
    const Comp = asChild ? Slot : Component;
    return <Comp className={cn(headingVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Heading.displayName = "Heading";

export const H1 = (props: Omit<HeadingProps, "as" | "variant">) => <Heading as="h1" variant="h1" {...props} />;
export const H2 = (props: Omit<HeadingProps, "as" | "variant">) => <Heading as="h2" variant="h2" {...props} />;
export const H3 = (props: Omit<HeadingProps, "as" | "variant">) => <Heading as="h3" variant="h3" {...props} />;

const textVariants = cva("word-wrap-break-word font-sans not-italic", {
  variants: {
    variant: {
      leadDark: "text-[15px] md:text-[16px] text-muted-foreground font-normal leading-relaxed",
      baseWhite: "text-[14px] md:text-[15px] text-white font-normal leading-snug",
      base: "text-[14px] md:text-[15px] text-foreground font-normal leading-snug",
    }
  },
  defaultVariants: { variant: "base" }
});

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return <Comp className={cn(textVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Text.displayName = "Text";

export const Accent = ({
                         className,
                         variant = "primary",
                         children,
                         ...props
                       }: {
  variant?: "light" | "primary" | "heavy",
  className?: string,
  children: React.ReactNode
}) => {
  const variants = {
    light: "text-sky-600 font-bold",
    primary: "text-[#005ECA] font-bold",
    heavy: "text-[#005ECA] font-black",
  };
  return <span className={cn("not-italic", variants[variant], className)} {...props}>{children}</span>;
};