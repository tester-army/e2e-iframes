import type { RefObject } from "react";

import { CARD_FIELDS, fieldSrc, type CardFieldKey } from "@/lib/card-fields";
import type { FormToFieldMessage } from "@/lib/checkout-messages";
import { cn } from "@/lib/utils";

type CardFieldProps = {
  field: CardFieldKey;
  frameRef: RefObject<HTMLIFrameElement | null>;
  error?: string;
  className?: string;
};

export function CardField({ field, frameRef, error, className }: CardFieldProps) {
  const { label } = CARD_FIELDS[field];
  const errorId = `card-${field}-error`;

  function focusField() {
    const message: FormToFieldMessage = { type: "form:focus" };
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span onClick={focusField} className="type-label-xs text-e2e-text-faint">
        {label}
      </span>
      <iframe
        ref={frameRef}
        src={fieldSrc(field)}
        title={label}
        aria-describedby={error ? errorId : undefined}
        data-testid={`card-${field}-frame`}
        className="block h-[46px] w-full"
      />
      {error ? (
        <p id={errorId} className="type-caption text-e2e-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
