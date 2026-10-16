import { HelmetMark } from "@/components/icons/helmet-mark";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href?: string;
  className?: string;
};

export function BrandLockup({ href = "/", className }: BrandLockupProps) {
  return (
    <a
      href={href}
      aria-label="e2e home"
      className={cn(
        "flex items-center gap-2.5 lg:gap-3",
        "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-e2e-button-stroke",
        className,
      )}
    >
      <HelmetMark className="size-8 text-e2e-icon-bright lg:-my-[3px] lg:size-[42px]" />
      <span aria-hidden="true" className="type-brand-slash text-e2e-text-primary">
        /
      </span>
      <span className="type-brand text-e2e-text-primary">e2e</span>
    </a>
  );
}
