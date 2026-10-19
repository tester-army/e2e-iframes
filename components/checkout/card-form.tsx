"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";

import { CardField } from "@/components/checkout/card-field";
import { LightButton } from "@/components/ui/light-button";
import { DECLINED_CARD, digitsOnly, validateCard, type CardErrors, type CardFields } from "@/lib/card";
import type { CardFieldKey } from "@/lib/card-fields";
import { formatUsd } from "@/lib/cart";
import {
  isFieldToFormMessage,
  isHostToCardMessage,
  isSameOrigin,
  postToParent,
  readHostOrigin,
  type CardToHostMessage,
} from "@/lib/checkout-messages";

const FAKE_NETWORK_MS = 800;

function isChildFrame(source: MessageEventSource | null): boolean {
  return source !== null && (source as Window).parent === window && source !== window;
}

// Without a host origin there is nobody to report to, so messages are dropped rather than broadcast.
function postToHost(hostOrigin: string | null, message: CardToHostMessage) {
  if (hostOrigin) postToParent(message, hostOrigin);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function CardForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const hostOriginRef = useRef<string | null>(null);
  // Field values are only read on submit, so keystrokes don't need to re-render the form.
  const valuesRef = useRef<CardFields>({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<CardErrors>({});
  const [amount, setAmount] = useState<number | null>(null);
  const [readyFields, setReadyFields] = useState<Partial<Record<CardFieldKey, true>>>({});
  const [isSubmitting, startSubmit] = useTransition();

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const hostOrigin = readHostOrigin(window.location.hash);
    hostOriginRef.current = hostOrigin;

    const height = () => Math.ceil(form.getBoundingClientRect().height);

    function onMessage(event: MessageEvent) {
      if (event.origin === hostOrigin && event.source === window.parent) {
        if (!isHostToCardMessage(event.data)) return;
        const message = event.data;
        if (message.type === "host:ping") postToHost(hostOrigin, { type: "card:ready", height: height() });
        else setAmount(message.amount);
        return;
      }

      if (!isSameOrigin(event) || !isChildFrame(event.source) || !isFieldToFormMessage(event.data)) return;

      const message = event.data;
      const { field } = message;
      switch (message.type) {
        case "field:ready":
          setReadyFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
          break;
        case "field:change":
          valuesRef.current[field] = message.value;
          setErrors((prev) => (prev[field] === undefined ? prev : { ...prev, [field]: undefined }));
          break;
        case "field:enter":
          form?.requestSubmit();
          break;
      }
    }

    window.addEventListener("message", onMessage);
    postToHost(hostOrigin, { type: "card:ready", height: height() });

    const observer = new ResizeObserver(() => postToHost(hostOrigin, { type: "card:resize", height: height() }));
    observer.observe(form);

    return () => {
      window.removeEventListener("message", onMessage);
      observer.disconnect();
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const values = { ...valuesRef.current };
    const nextErrors = validateCard(values, new Date());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startSubmit(async () => {
      postToHost(hostOriginRef.current, { type: "card:submit" });
      await wait(FAKE_NETWORK_MS);

      const number = digitsOnly(values.number);
      if (number === DECLINED_CARD) {
        postToHost(hostOriginRef.current, {
          type: "card:error",
          message: "Your card was declined. Try a different card.",
        });
      } else {
        postToHost(hostOriginRef.current, { type: "card:success", last4: number.slice(-4) });
      }
    });
  }

  const payLabel = isSubmitting ? "Processing..." : amount === null ? "Pay" : `Pay ${formatUsd(amount)}`;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-5 p-5" data-testid="card-form">
      <CardField field="name" ready={readyFields.name === true} disabled={isSubmitting} error={errors.name} />
      <CardField field="number" ready={readyFields.number === true} disabled={isSubmitting} error={errors.number} />
      <div className="grid grid-cols-2 gap-4">
        <CardField field="expiry" ready={readyFields.expiry === true} disabled={isSubmitting} error={errors.expiry} />
        <CardField field="cvc" ready={readyFields.cvc === true} disabled={isSubmitting} error={errors.cvc} />
      </div>
      <LightButton type="submit" disabled={isSubmitting} className="mt-1">
        <span data-testid="pay-button">{payLabel}</span>
      </LightButton>
    </form>
  );
}
