"use client";

import { useEffect, useRef } from "react";

import { CARD_FIELDS, fieldSrc, type CardFieldKey } from "@/lib/card-fields";
import { postToFrame } from "@/lib/checkout-messages";

type CardFieldProps = {
  field: CardFieldKey;
  ready: boolean;
  disabled: boolean;
  error?: string;
};

export function CardField({ field, ready, disabled, error }: CardFieldProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { label } = CARD_FIELDS[field];
  const errorId = `card-${field}-error`;
  const invalid = error !== undefined;

  // The input lives in another document, so its state has to be pushed to it.
  useEffect(() => {
    if (ready) postToFrame(frameRef.current, { type: "form:state", disabled, invalid });
  }, [ready, disabled, invalid]);

  return (
    <div className="flex flex-col gap-2">
      <span
        onClick={() => postToFrame(frameRef.current, { type: "form:focus" })}
        className="type-label-xs text-e2e-text-faint"
      >
        {label}
      </span>
      <iframe
        ref={frameRef}
        src={fieldSrc(field)}
        title={label}
        aria-describedby={invalid ? errorId : undefined}
        data-testid={`card-${field}-frame`}
        className="block h-[46px] w-full"
      />
      {invalid ? (
        <p id={errorId} className="type-caption text-e2e-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
