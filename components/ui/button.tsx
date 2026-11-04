import clsx from "clsx";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "light";

/** The e2e button classes, for a link that looks like a button. */
export function buttonClassName(variant: Variant = "primary", className?: string) {
  return clsx("e2e-button", `e2e-button-${variant}`, className);
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type={type} className={buttonClassName(variant, className)} {...props} />;
}
