import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xs font-sans font-bold uppercase tracking-cta transition-[background-color,color,border-color,transform] duration-200 ease-out select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Acid lime: the primary call to action across the brand */
        primary: "bg-lime text-ink hover:bg-lime-2 active:translate-y-px",
        lime: "bg-lime text-ink hover:bg-lime-2 active:translate-y-px",
        /** Off-white solid, for secondary emphasis on dark surfaces */
        solid: "bg-bone text-ink hover:bg-white active:translate-y-px",
        outline: "border border-bone/25 bg-transparent text-bone hover:border-lime hover:text-lime",
        outlineLight: "border border-bone/25 bg-transparent text-bone hover:border-lime hover:text-lime",
        ghost: "bg-transparent text-bone hover:bg-bone/8",
        ghostLight: "bg-transparent text-bone hover:bg-bone/8",
        danger: "bg-danger text-white hover:bg-[#d84c3c]",
        link: "h-auto rounded-none px-0 py-0 tracking-normal normal-case underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-[11px]",
        md: "h-11 px-5 text-xs",
        lg: "h-14 px-7 text-sm",
        icon: "size-10 px-0",
        iconSm: "size-8 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a Next.js Link) with button styles. */
  asChild?: boolean;
  /** Append an arrow that nudges right on hover. */
  withArrow?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  withArrow = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const decorate = (label: React.ReactNode) => (
    <>
      {loading ? (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {label}
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="arrow transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ children?: React.ReactNode }>;
    return (
      <Slot.Root className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {React.cloneElement(child, undefined, decorate(child.props.children))}
      </Slot.Root>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {decorate(children)}
    </button>
  );
}

export { buttonVariants };
