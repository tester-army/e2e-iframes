import type { ReactNode } from "react";

import {
  pickLinkOrButton,
  renderLinkOrButton,
  type ButtonProps,
  type CommonProps,
  type LinkProps,
} from "@/lib/button-props";
import { cn } from "@/lib/utils";

type LightButtonTone = "solid" | "glass";

const TONE_CLASSES: Record<LightButtonTone, string> = {
  solid: "h-10 gap-1.5 px-5 bg-e2e-button-fill-solid type-button-s font-medium",
  glass:
    "h-12 gap-1.5 px-3.5 bg-e2e-button-fill-light inset-ring-[0.5px] inset-ring-e2e-button-stroke sm:backdrop-blur-[4px] type-button-l",
};

type LightButtonOwnProps = CommonProps & {
  tone?: LightButtonTone;
  icon?: ReactNode;
};

type LightButtonProps = LightButtonOwnProps & (LinkProps | ButtonProps);

export function LightButton(props: LightButtonProps) {
  const { children, className, tone = "solid", icon, fullWidth, "aria-label": ariaLabel } = props;

  return renderLinkOrButton(pickLinkOrButton(props), {
    "aria-label": ariaLabel,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap text-e2e-text-on-light",
      "transition-colors duration-200 motion-reduce:transition-none",
      "hover:bg-e2e-paper-0 focus-visible:bg-e2e-paper-0",
      "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-e2e-button-stroke",
      "disabled:pointer-events-none disabled:opacity-40",
      TONE_CLASSES[tone],
      fullWidth === false ? undefined : fullWidth ? "w-full" : "w-full sm:w-auto",
      className,
    ),
    children: (
      <>
        {tone === "glass" && icon !== undefined ? (
          <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-full">
            {icon}
          </span>
        ) : null}
        {children}
      </>
    ),
  });
}
