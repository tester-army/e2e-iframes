import type { Metadata } from "next";

import { CardForm } from "@/components/checkout/card-form";

export const metadata: Metadata = {
  title: "Card payment",
  robots: { index: false },
};

export default function CardEmbedPage() {
  return <CardForm />;
}
