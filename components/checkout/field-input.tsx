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
        "block h-e2e-6 w-full bg-e2e-neutral-800 px-e2e-2 font-cassette text-base text-e2e-off-white",
        "placeholder:text-e2e-neutral-500",
        // The frame clips anything outside the input, so the rings sit inside it.
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-e2e-green",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid ? "outline-2 -outline-offset-2 outline-e2e-mint" : "outline-none",
      )}
    />
  );
}
