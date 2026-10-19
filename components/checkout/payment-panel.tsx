"use client";

import { useEffect, useRef, useState } from "react";

import { CART_TOTAL } from "@/lib/cart";
import { isCardToHostMessage, isSameOrigin, postToFrame } from "@/lib/checkout-messages";

type PaymentResult = { ok: true; last4: string } | { ok: false; error: string };

export function PaymentPanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(420);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!isSameOrigin(event) || event.source !== iframeRef.current?.contentWindow) return;
      if (!isCardToHostMessage(event.data)) return;

      const message = event.data;
      switch (message.type) {
        case "card:ready":
          setHeight(message.height);
          postToFrame(iframeRef.current, { type: "host:amount", amount: CART_TOTAL });
          break;
        case "card:resize":
          setHeight(message.height);
          break;
        case "card:submit":
          setResult(null);
          break;
        case "card:success":
          setResult({ ok: true, last4: message.last4 });
          break;
        case "card:error":
          setResult({ ok: false, error: message.message });
          break;
      }
    }

    window.addEventListener("message", onMessage);
    // The card may have loaded before this listener existed; ask it to announce itself again.
    postToFrame(iframeRef.current, { type: "host:ping" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <iframe
        ref={iframeRef}
        src="/embed/card"
        title="Card payment"
        data-testid="checkout-iframe"
        style={{ height }}
        className="block w-full border border-e2e-hairline-strong"
      />
      {result === null ? null : result.ok ? (
        <p role="status" className="type-code-s text-e2e-text-soft" data-testid="confirmed-last4">
          {result.last4}
        </p>
      ) : (
        <p role="alert" className="type-code-s text-e2e-accent" data-testid="host-error">
          {result.error}
        </p>
      )}
    </div>
  );
}
