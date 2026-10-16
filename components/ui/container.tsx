import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
  bleed?: boolean;
  className?: string;
};

export function Container({ children, as = "div", bleed = false, className }: ContainerProps) {
  const Tag = as;
  return <Tag className={cn(bleed ? "e2e-bleed" : "e2e-container", className)}>{children}</Tag>;
}
