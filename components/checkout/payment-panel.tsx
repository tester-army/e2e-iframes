"use client";

import { useEffect, useRef, useState } from "react";

import { CART_TOTAL } from "@/lib/cart";
import { isCardToHostMessage, type HostToCardMessage } from "@/lib/checkout-messages";

const CARD_SRC = "/embed/card";
const INITIAL_HEIGHT = 420;

export function PaymentPanel() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(INITIAL_HEIGHT);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    function send(message: HostToCardMessage) {
      iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isCardToHostMessage(event.data)) return;

      const message = event.data;
      switch (message.type) {
        case "card:ready":
          setHeight(message.height);
          send({ type: "host:amount", amount: CART_TOTAL, currency: "USD" });
          break;
        case "card:resize":
          setHeight(message.height);
          break;
        case "card:submit":
          setResult(null);
          break;
        case "card:success":
          setResult({ ok: true, text: message.last4 });
          break;
        case "card:error":
          setResult({ ok: false, text: message.message });
          break;
      }
    }

    window.addEventListener("message", onMessage);
    send({ type: "host:ping" });

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <iframe
        ref={iframeRef}
        src={CARD_SRC}
        title="Card payment"
        data-testid="checkout-iframe"
        style={{ height }}
        className="block w-full border border-e2e-hairline-strong"
      />
      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={result.ok ? "type-code-s text-e2e-text-soft" : "type-code-s text-e2e-accent"}
          data-testid={result.ok ? "confirmed-last4" : "host-error"}
        >
          {result.text}
        </p>
      ) : null}
    </div>
  );
}
