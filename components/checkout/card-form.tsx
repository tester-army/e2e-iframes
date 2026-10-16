"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { CardField } from "@/components/checkout/card-field";
import { LightButton } from "@/components/ui/light-button";
import {
  DECLINED_CARD,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  validateCard,
  type CardErrors,
  type CardFields,
} from "@/lib/card";
import { formatUsd } from "@/lib/cart";
import { isHostToCardMessage, type CardToHostMessage } from "@/lib/checkout-messages";

const EMPTY_FIELDS: CardFields = { name: "", number: "", expiry: "", cvc: "" };
const FAKE_NETWORK_MS = 800;

function postToHost(message: CardToHostMessage) {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}

export function CardForm() {
  const rootRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<CardFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<CardErrors>({});
  const [amount, setAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const height = () => Math.ceil(root.getBoundingClientRect().height);

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (!isHostToCardMessage(event.data)) return;
      if (event.data.type === "host:ping") postToHost({ type: "card:ready", height: height() });
      if (event.data.type === "host:amount") setAmount(event.data.amount);
    }

    window.addEventListener("message", onMessage);
    postToHost({ type: "card:ready", height: height() });

    const observer = new ResizeObserver(() => postToHost({ type: "card:resize", height: height() }));
    observer.observe(root);

    return () => {
      window.removeEventListener("message", onMessage);
      observer.disconnect();
    };
  }, []);

  function update<K extends keyof CardFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateCard(fields, new Date());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    postToHost({ type: "card:submit" });
    await new Promise((resolve) => setTimeout(resolve, FAKE_NETWORK_MS));
    setSubmitting(false);

    const number = digitsOnly(fields.number);
    if (number === DECLINED_CARD) {
      postToHost({ type: "card:error", message: "Your card was declined. Try a different card." });
      return;
    }
    postToHost({ type: "card:success", last4: number.slice(-4), name: fields.name.trim() });
  }

  const payLabel = submitting ? "Processing..." : amount === null ? "Pay" : `Pay ${formatUsd(amount)}`;

  return (
    <form ref={rootRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-5 p-5" data-testid="card-form">
      <CardField
        id="card-name"
        label="Name on card"
        value={fields.name}
        onChange={(value) => update("name", value)}
        error={errors.name}
        autoComplete="cc-name"
        placeholder="Ada Lovelace"
        disabled={submitting}
        data-testid="card-name"
      />
      <CardField
        id="card-number"
        label="Card number"
        value={fields.number}
        onChange={(value) => update("number", formatCardNumber(value))}
        error={errors.number}
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="4242 4242 4242 4242"
        disabled={submitting}
        data-testid="card-number"
      />
      <div className="grid grid-cols-2 gap-4">
        <CardField
          id="card-expiry"
          label="Expiry"
          value={fields.expiry}
          onChange={(value) => update("expiry", formatExpiry(value))}
          error={errors.expiry}
          autoComplete="cc-exp"
          inputMode="numeric"
          placeholder="MM/YY"
          disabled={submitting}
          data-testid="card-expiry"
        />
        <CardField
          id="card-cvc"
          label="CVC"
          value={fields.cvc}
          onChange={(value) => update("cvc", digitsOnly(value).slice(0, 4))}
          error={errors.cvc}
          autoComplete="cc-csc"
          inputMode="numeric"
          placeholder="123"
          disabled={submitting}
          data-testid="card-cvc"
        />
      </div>
      <LightButton type="submit" fullWidth disabled={submitting} className="mt-1">
        <span data-testid="pay-button">{payLabel}</span>
      </LightButton>
    </form>
  );
}
