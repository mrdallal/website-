import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "wide" | "narrow";
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
}

const sizes = {
  default: "max-w-[1440px]",
  wide: "max-w-[1680px]",
  narrow: "max-w-[960px]",
};

export function Container({ size = "default", as: Comp = "div", className, ...props }: ContainerProps) {
  return <Comp className={cn("mx-auto w-full px-gutter", sizes[size], className)} {...props} />;
}
