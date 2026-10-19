"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { CardField } from "@/components/checkout/card-field";
import { LightButton } from "@/components/ui/light-button";
import { DECLINED_CARD, digitsOnly, validateCard, type CardErrors, type CardFields } from "@/lib/card";
import { CARD_FIELD_KEYS, type CardFieldKey } from "@/lib/card-fields";
import { formatUsd } from "@/lib/cart";
import {
  isFieldToFormMessage,
  isHostToCardMessage,
  type CardToHostMessage,
  type FormToFieldMessage,
} from "@/lib/checkout-messages";

const EMPTY_FIELDS: CardFields = { name: "", number: "", expiry: "", cvc: "" };
const FAKE_NETWORK_MS = 800;

function postToHost(message: CardToHostMessage) {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}

export function CardForm() {
  const rootRef = useRef<HTMLFormElement>(null);
  const nameFrame = useRef<HTMLIFrameElement>(null);
  const numberFrame = useRef<HTMLIFrameElement>(null);
  const expiryFrame = useRef<HTMLIFrameElement>(null);
  const cvcFrame = useRef<HTMLIFrameElement>(null);
  const [fields, setFields] = useState<CardFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<CardErrors>({});
  const [amount, setAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [readyFields, setReadyFields] = useState<Partial<Record<CardFieldKey, true>>>({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const frames = { name: nameFrame, number: numberFrame, expiry: expiryFrame, cvc: cvcFrame };
    const height = () => Math.ceil(root.getBoundingClientRect().height);

    function fieldForSource(source: MessageEventSource | null): CardFieldKey | undefined {
      return CARD_FIELD_KEYS.find((key) => frames[key].current?.contentWindow === source);
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      if (event.source === window.parent && isHostToCardMessage(event.data)) {
        if (event.data.type === "host:ping") postToHost({ type: "card:ready", height: height() });
        if (event.data.type === "host:amount") setAmount(event.data.amount);
        return;
      }

      const field = fieldForSource(event.source);
      if (!field || !isFieldToFormMessage(event.data) || event.data.field !== field) return;

      const message = event.data;
      switch (message.type) {
        case "field:ready":
          setReadyFields((prev) => ({ ...prev, [field]: true }));
          break;
        case "field:change":
          setFields((prev) => ({ ...prev, [field]: message.value }));
          setErrors((prev) => ({ ...prev, [field]: undefined }));
          break;
        case "field:enter":
          root?.requestSubmit();
          break;
      }
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

  useEffect(() => {
    const frames = { name: nameFrame, number: numberFrame, expiry: expiryFrame, cvc: cvcFrame };
    for (const field of CARD_FIELD_KEYS) {
      if (!readyFields[field]) continue;
      const message: FormToFieldMessage = { type: "form:state", disabled: submitting, invalid: Boolean(errors[field]) };
      frames[field].current?.contentWindow?.postMessage(message, window.location.origin);
    }
  }, [readyFields, submitting, errors]);

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
      <CardField field="name" frameRef={nameFrame} error={errors.name} />
      <CardField field="number" frameRef={numberFrame} error={errors.number} />
      <div className="grid grid-cols-2 gap-4">
        <CardField field="expiry" frameRef={expiryFrame} error={errors.expiry} />
        <CardField field="cvc" frameRef={cvcFrame} error={errors.cvc} />
      </div>
      <LightButton type="submit" fullWidth disabled={submitting} className="mt-1">
        <span data-testid="pay-button">{payLabel}</span>
      </LightButton>
    </form>
  );
}
