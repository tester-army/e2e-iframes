"use client";

import { useEffect, useRef, useState } from "react";

import { CARD_FIELDS, type CardFieldKey } from "@/lib/card-fields";
import { isFormToFieldMessage, type FieldToFormMessage } from "@/lib/checkout-messages";
import { cn } from "@/lib/utils";

function postToForm(message: FieldToFormMessage) {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}

export function FieldInput({ field }: { field: CardFieldKey }) {
  const config = CARD_FIELDS[field];
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (!isFormToFieldMessage(event.data)) return;
      if (event.data.type === "form:focus") inputRef.current?.focus();
      if (event.data.type === "form:state") {
        setDisabled(event.data.disabled);
        setInvalid(event.data.invalid);
      }
    }

    window.addEventListener("message", onMessage);
    postToForm({ type: "field:ready", field });
    return () => window.removeEventListener("message", onMessage);
  }, [field]);

  function onChange(raw: string) {
    const next = config.format(raw);
    setValue(next);
    postToForm({ type: "field:change", field, value: next });
  }

  return (
    <input
      ref={inputRef}
      id={`card-${field}`}
      aria-label={config.label}
      aria-invalid={invalid ? true : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") postToForm({ type: "field:enter", field });
      }}
      autoComplete={config.autoComplete}
      inputMode={config.inputMode}
      placeholder={config.placeholder}
      disabled={disabled}
      data-testid={`card-${field}`}
      className={cn(
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
