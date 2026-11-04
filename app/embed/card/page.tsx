import type { Metadata } from "next";

import { CardForm } from "@/components/checkout/card-form";

export const metadata: Metadata = {
  title: "card payment",
  robots: { index: false },
};

export default function CardEmbedPage() {
  return <CardForm />;
}
