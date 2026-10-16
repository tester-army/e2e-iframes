import { cn } from "@/lib/utils";

type HairlineTone = "hairline" | "hairline-strong" | "chrome";

const TONE_CLASSES: Record<HairlineTone, string> = {
  hairline: "border-e2e-hairline",
  "hairline-strong": "border-e2e-hairline-strong",
  chrome: "border-e2e-chrome",
};

type HairlineProps = {
  orientation?: "horizontal" | "vertical";
  dashed?: boolean;
  tone?: HairlineTone;
  className?: string;
};

export function Hairline({ orientation = "horizontal", dashed = false, tone = "hairline", className }: HairlineProps) {
  const style = dashed ? "border-dashed" : "border-solid";

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-0 border-0 border-l", style, TONE_CLASSES[tone], className)}
      />
    );
  }

  return <hr className={cn("h-0 border-0 border-t", style, TONE_CLASSES[tone], className)} />;
}
