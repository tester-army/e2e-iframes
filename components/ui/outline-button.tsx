import type { ReactNode } from "react";

import {
  pickLinkOrButton,
  renderLinkOrButton,
  type ButtonProps,
  type CommonProps,
  type LinkProps,
} from "@/lib/button-props";
import { cn } from "@/lib/utils";

type OutlineButtonSize = "sm" | "md";

const SIZE_CLASSES: Record<OutlineButtonSize, { box: string; label: string; fill: string }> = {
  sm: { box: "h-9 gap-2 px-3.5", label: "type-button", fill: "bg-e2e-button-fill" },
  md: { box: "h-10 px-5", label: "type-button-xs lg:type-button-s", fill: "sm:bg-e2e-button-fill" },
};

type OutlineButtonOwnProps = CommonProps & {
  size?: OutlineButtonSize;
  icon?: ReactNode;
};

type OutlineButtonProps = OutlineButtonOwnProps & (LinkProps | ButtonProps);

function widthClass(size: OutlineButtonSize, fullWidth: boolean | undefined): string | undefined {
  if (fullWidth === true) return "w-full";
  if (fullWidth === false) return undefined;
  return size === "md" ? "w-full sm:w-auto" : undefined;
}

export function OutlineButton(props: OutlineButtonProps) {
  const { children, className, size = "md", icon, fullWidth, "aria-label": ariaLabel } = props;
  const sizeClasses = SIZE_CLASSES[size];

  return renderLinkOrButton(pickLinkOrButton(props), {
    "aria-label": ariaLabel,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "text-e2e-text-soft inset-ring-[0.5px] inset-ring-e2e-button-stroke",
      sizeClasses.fill,
      "transition duration-200 motion-reduce:transition-none",
      "hover:text-e2e-text-bright hover:inset-ring-e2e-text-bright",
      "focus-visible:text-e2e-text-bright focus-visible:inset-ring-e2e-text-bright",
      "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-e2e-button-stroke",
      "disabled:pointer-events-none disabled:opacity-40",
      sizeClasses.box,
      sizeClasses.label,
      widthClass(size, fullWidth),
      className,
    ),
    children: (
      <>
        {icon !== undefined ? (
          <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-full">
            {icon}
          </span>
        ) : null}
        {children}
      </>
    ),
  });
}
