import Link from "next/link";

import { Logo } from "@/components/ui/logo";

const E2E_DOCS_URL = "https://e2e.tester.army/docs";

export function SiteHeader() {
  return (
    <header className="border-b border-e2e-neutral-800">
      <div className="mx-auto flex h-e2e-8 w-full max-w-312 items-center justify-between px-e2e-3 md:px-e2e-6">
        <Link
          href="/"
          aria-label="e2e home"
          className="flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-e2e-green"
        >
          <Logo label="" className="h-e2e-3 w-auto" />
        </Link>
        <a
          href={E2E_DOCS_URL}
          target="_blank"
          rel="noreferrer"
          className="type-caption text-e2e-off-white outline-none hover:text-e2e-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-e2e-green"
        >
          [ docs ]
        </a>
      </div>
    </header>
  );
}
