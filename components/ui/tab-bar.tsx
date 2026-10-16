"use client";

import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

export type CodeWindowTone = "raised" | "flush";

export type CodeTab = {
  id: string;
  label: string;
};

const TONE_CLASSES = {
  raised: {
    bar: "bg-e2e-tab-bar",
    dots: "px-6",
    tab: "h-[43px] px-4 type-tab",
    active: "border-x border-e2e-chrome bg-e2e-panel-raised text-e2e-tab-active",
    inactive: "border-r border-e2e-chrome text-e2e-tab-inactive",
  },
  flush: {
    bar: "gap-4 bg-e2e-canvas px-6",
    dots: "",
    tab: "type-tab-s",
    active: "text-e2e-tab-active",
    inactive: "text-e2e-tab-inactive",
  },
} as const satisfies Record<CodeWindowTone, Record<string, string>>;

const DOTS_CLASSES = {
  always: "flex",
  "xs-up": "hidden xs:flex",
  none: "hidden",
} as const;

export type TabBarDots = keyof typeof DOTS_CLASSES;

type TabBarProps = {
  tone: CodeWindowTone;
  tabs: CodeTab[];
  activeTab: string;
  onSelectTab?: (id: string) => void;
  dots?: TabBarDots;
  id?: string;
  "aria-label"?: string;
  className?: string;
};

export function TabBar({
  tone,
  tabs,
  activeTab,
  onSelectTab,
  dots = "always",
  id,
  "aria-label": ariaLabel,
  className,
}: TabBarProps) {
  const tones = TONE_CLASSES[tone];
  const interactive = onSelectTab !== undefined;

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!onSelectTab) return;
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + last) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    const target = tabs[next];
    if (!target) return;
    onSelectTab(target.id);
    const button = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
      `[data-tab-id="${target.id}"]`,
    );
    button?.focus();
  }

  return (
    <div
      role={interactive ? "tablist" : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      className={cn("flex h-11 items-center border-b border-e2e-chrome", tones.bar, className)}
    >
      <div aria-hidden="true" className={cn("gap-1.5", DOTS_CLASSES[dots], tones.dots)}>
        <span className="e2e-dot size-2 bg-e2e-chrome-dot" />
        <span className="e2e-dot size-2 bg-e2e-chrome-dot" />
        <span className="e2e-dot size-2 bg-e2e-chrome-dot" />
      </div>
      {tabs.map((tab, index) => {
        const active = tab.id === activeTab;
        const tabClassName = cn(
          "flex shrink-0 items-center",
          tones.tab,
          active ? tones.active : tones.inactive,

          tone === "raised" && active && index > 0 && "-ml-px",
        );
        const tabId = id ? `${id}-tab-${tab.id}` : undefined;
        if (!interactive) {
          return (
            <span key={tab.id} id={tabId} data-active={active || undefined} className={tabClassName}>
              {tab.label}
            </span>
          );
        }
        return (
          <button
            key={tab.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={id ? `${id}-panel` : undefined}
            tabIndex={active ? 0 : -1}
            data-tab-id={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onKeyDown={(event) => moveFocus(event, index)}
            className={cn(
              tabClassName,
              "cursor-pointer transition-colors duration-200 motion-reduce:transition-none",
              "focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-e2e-button-stroke",
              !active && "hover:text-e2e-text-link focus-visible:text-e2e-text-link",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
