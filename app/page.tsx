import { PaymentPanel } from "@/components/checkout/payment-panel";
import { SiteHeader } from "@/components/site-header";

// The header lives here rather than in the root layout, which the embedded card pages share.
export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-e2e-3 py-e2e-6 md:px-e2e-6">
        <div className="mx-auto w-full max-w-110">
          <PaymentPanel />
        </div>
      </main>
    </>
  );
}
