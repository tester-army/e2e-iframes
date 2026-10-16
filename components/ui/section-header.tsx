import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  subClassName?: string;
  titleType?: string;
  align?: "start" | "center";
  headingId?: string;
  children?: ReactNode;
  className?: string;
};

const ALIGN_CLASSES = {
  start: "items-start text-start",
  center: "items-center text-center",
} as const;

export function SectionHeader({
  index,
  eyebrow,
  title,
  sub,
  subClassName,
  titleType = "type-h2",
  align = "start",
  headingId,
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5", ALIGN_CLASSES[align], className)}>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 id={headingId} className={cn(titleType, "text-e2e-text-primary")}>
        {title}
      </h2>
      {sub !== undefined ? <p className={cn("type-body-xs text-e2e-text-muted", subClassName)}>{sub}</p> : null}
      {children}
    </div>
  );
}
