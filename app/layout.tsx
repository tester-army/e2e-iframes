import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/e2e.css";

const display = localFont({
  src: "./fonts/stack-sans-notch-latin-wght-normal.woff2",
  variable: "--e2e-font-display",
  weight: "100 900",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/inter-latin-standard-normal.woff2",
  variable: "--e2e-font-sans",
  weight: "100 900",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "./fonts/dm-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--e2e-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "e2e iframe checkout",
  description: "A checkout page with the card form embedded in an iframe.",
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="e2e min-h-dvh">{children}</body>
    </html>
  );
}
