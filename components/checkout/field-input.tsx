"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

import { CARD_FIELDS, type CardFieldKey } from "@/lib/card-fields";
import { isFormToFieldMessage, isSameOrigin, postToParent } from "@/lib/checkout-messages";

export function FieldInput({ field }: { field: CardFieldKey }) {
  const { label, placeholder, autoComplete, inputMode, format } = CARD_FIELDS[field];
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [{ disabled, invalid }, setFormState] = useState({ disabled: false, invalid: false });

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!isSameOrigin(event) || event.source !== window.parent || !isFormToFieldMessage(event.data)) return;

      const message = event.data;
      if (message.type === "form:focus") inputRef.current?.focus();
      else setFormState({ disabled: message.disabled, invalid: message.invalid });
    }

    window.addEventListener("message", onMessage);
    postToParent({ type: "field:ready", field });
    return () => window.removeEventListener("message", onMessage);
  }, [field]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const next = format(event.target.value);
    setValue(next);
    postToParent({ type: "field:change", field, value: next });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") postToParent({ type: "field:enter", field });
  }

  return (
    <input
      ref={inputRef}
      id={`card-${field}`}
      aria-label={label}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete={autoComplete}
      inputMode={inputMode}
      placeholder={placeholder}
      disabled={disabled}
      data-testid={`card-${field}`}
      className={clsx(
        "block h-[46px] w-full border bg-e2e-field-fill px-4 type-field text-e2e-text-bright caret-e2e-caret",
        "placeholder:text-e2e-text-faint",
        "transition-[border-color,background-color] duration-200 motion-reduce:transition-none",
        "hover:border-e2e-white-50 focus:border-e2e-button-stroke focus:bg-e2e-panel-raised focus:outline-none",
        "disabled:pointer-events-none disabled:opacity-40",
        invalid ? "border-e2e-accent" : "border-e2e-field-stroke",
      )}
    />
  );
}
