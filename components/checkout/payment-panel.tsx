"use client";

import { useEffect, useRef, useState } from "react";

import { CART_TOTAL } from "@/lib/cart";
import { cardSrc, isCardToHostMessage, postToFrame } from "@/lib/checkout-messages";
import { CARD_ORIGIN, HOST_ORIGIN } from "@/lib/origins";

type PaymentResult = { ok: true; last4: string } | { ok: false; error: string };

export function PaymentPanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(420);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== CARD_ORIGIN || event.source !== iframeRef.current?.contentWindow) return;
      if (!isCardToHostMessage(event.data)) return;

      const message = event.data;
      switch (message.type) {
        case "card:ready":
          setHeight(message.height);
          postToFrame(iframeRef.current, { type: "host:amount", amount: CART_TOTAL }, CARD_ORIGIN);
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
    postToFrame(iframeRef.current, { type: "host:ping" }, CARD_ORIGIN);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <iframe
        ref={iframeRef}
        src={cardSrc(CARD_ORIGIN, HOST_ORIGIN)}
        title="Card payment"
        data-testid="checkout-iframe"
        style={{ height }}
        className="block w-full border border-e2e-hairline-strong"
      />
      <PaymentResultMessage result={result} />
    </div>
  );
}

function PaymentResultMessage({ result }: { result: PaymentResult | null }) {
  if (!result) return null;

  if (!result.ok) {
    return (
      <p role="alert" className="type-code-s text-e2e-accent" data-testid="host-error">
        {result.error}
      </p>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-col gap-1 border border-e2e-hairline-strong bg-e2e-panel p-5"
      data-testid="payment-success"
    >
      <p className="type-body-s font-medium text-e2e-text-bright">Payment succeeded</p>
      <p className="type-code-s text-e2e-text-soft">
        Card ending in <span data-testid="confirmed-last4">{result.last4}</span>
      </p>
    </div>
  );
}
