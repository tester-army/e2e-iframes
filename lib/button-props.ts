import { createElement, type MouseEventHandler, type ReactElement, type ReactNode } from "react";

export type CommonProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  "aria-label"?: string;
};

export type LinkProps = {
  href: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type LinkOrButtonProps = LinkProps | ButtonProps;

export function isLink(props: LinkOrButtonProps): props is LinkProps {
  return props.href !== undefined;
}

export function pickLinkOrButton(props: LinkOrButtonProps): LinkOrButtonProps {
  if (isLink(props)) {
    return { href: props.href, external: props.external, onClick: props.onClick };
  }
  return { type: props.type, disabled: props.disabled, onClick: props.onClick };
}

export type RenderAttrs = {
  className: string;
  children: ReactNode;
  "aria-label"?: string;
};

export function renderLinkOrButton(variant: LinkOrButtonProps, attrs: RenderAttrs): ReactElement {
  const { className, children, "aria-label": ariaLabel } = attrs;

  if (isLink(variant)) {
    return createElement(
      "a",
      {
        href: variant.href,
        className,
        "aria-label": ariaLabel,
        ...(variant.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        onClick: variant.onClick,
      },
      children,
    );
  }

  return createElement(
    "button",
    {
      type: variant.type ?? "button",
      disabled: variant.disabled,
      className,
      "aria-label": ariaLabel,
      onClick: variant.onClick,
    },
    children,
  );
}
