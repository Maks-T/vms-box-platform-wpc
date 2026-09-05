import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/shared/lib/utils";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-border has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-border has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-ring has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-4xl [&>[data-slot=select-trigger]:not([class*=w-])]:w-fit [&>input]:flex-1 has-[>[data-variant=outline]]:[&>input]:border-border has-[>[data-variant=outline]]:[&>input:focus-visible]:border-ring",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot]:first-child]:rounded-l-4xl! [&>[data-slot]:has(~[data-slot])]:rounded-r-none! [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-4xl! [&>[data-slot]~[data-slot]]:rounded-l-none! [&>[data-slot]~[data-slot]]:border-l-0",
        vertical:
          "flex-col [&>[data-slot]:first-child]:rounded-t-4xl! [&>[data-slot]:has(~[data-slot])]:rounded-b-none! [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-4xl! [&>[data-slot]~[data-slot]]:rounded-t-none! [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

interface ButtonGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof buttonGroupVariants> {
}

function ButtonGroup({
                       className,
                       orientation = "horizontal",
                       ...props
                     }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({orientation}), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
                           className,
                           children,
                           ...props
                         }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-4xl border border-border bg-muted px-3 text-sm font-medium text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {ButtonGroup, ButtonGroupText, buttonGroupVariants};