import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "className">;

export function CardField({ id, label, value, onChange, error, className, ...inputProps }: CardFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-label-xs text-e2e-text-faint">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-[46px] w-full border bg-e2e-field-fill px-4 type-field text-e2e-text-bright caret-e2e-caret",
          "placeholder:text-e2e-text-faint",
          "transition-[border-color,background-color] duration-200 motion-reduce:transition-none",
          "hover:border-e2e-white-50 focus:border-e2e-button-stroke focus:bg-e2e-panel-raised focus:outline-none",
          "disabled:pointer-events-none disabled:opacity-40",
          error ? "border-e2e-accent" : "border-e2e-field-stroke",
        )}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="type-caption text-e2e-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
