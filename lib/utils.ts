import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TYPE_ROLE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const twMerge = extendTailwindMerge<"e2e-type" | "e2e-fade">({
  extend: {
    classGroups: {
      "e2e-type": [{ type: [(value: string) => TYPE_ROLE.test(value)] }],
      "e2e-fade": [{ "e2e-fade": ["hero", "code", "footer", "meadow"] }],
      animate: [{ animate: ["e2e-line-flash", "e2e-tab-fade"] }],
    },
    conflictingClassGroups: {
      "e2e-fade": ["bg-image"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
