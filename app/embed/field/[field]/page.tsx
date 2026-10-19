import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FieldInput } from "@/components/checkout/field-input";
import { CARD_FIELD_KEYS, isCardFieldKey } from "@/lib/card-fields";

export const metadata: Metadata = {
  title: "Card field",
  robots: { index: false },
};

export async function generateStaticParams() {
  return CARD_FIELD_KEYS.map((field) => ({ field }));
}

type Params = PageProps<"/embed/field/[field]">["params"];

async function Field({ params }: { params: Params }) {
  const { field } = await params;
  if (!isCardFieldKey(field)) notFound();
  return <FieldInput field={field} />;
}

export default function CardFieldEmbedPage({ params }: PageProps<"/embed/field/[field]">) {
  return (
    <Suspense fallback={null}>
      <Field params={params} />
    </Suspense>
  );
}
