import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = {
  index: "01" | "02" | "03" | "04" | string;
  children: ReactNode;
  id?: string;
  className?: string;
};

export function Eyebrow({ index, children, id, className }: EyebrowProps) {
  return (
    <p id={id} className={cn("type-eyebrow text-e2e-text-secondary", className)}>
      {`[${index}] `}
      {children}
    </p>
  );
}
