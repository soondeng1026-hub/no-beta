"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

function IconHome({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconAnalyze({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect
        x="7"
        y="9"
        width="10"
        height="6.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M9 12h6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function IconLibrary({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 17c2.8-6.5 4.8-8.5 7-8.5s4.2 2 7 8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const items = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/analyze", label: "Analyze", Icon: IconAnalyze },
  { href: "/library", label: "Library", Icon: IconLibrary },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 overflow-visible border-t-2 border-[#1a1a1a] bg-white"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-evenly px-1 pt-2">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex min-w-0 flex-1 justify-center">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-full max-w-[120px] flex-col items-center justify-start gap-1 rounded-[4px] px-1 pb-1 pt-0.5 transition-colors",
                  active
                    ? "bg-[#f5f4f0] font-semibold text-[#1a1a1a]"
                    : "font-medium text-[#1a1a1a]/60 hover:bg-[#f5f4f0]/70 hover:text-[#1a1a1a]"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 sm:size-6",
                    active ? "text-[#1a1a1a]" : "text-[#1a1a1a]/55"
                  )}
                />
                <span className="block w-full pb-0.5 text-center text-[11px] font-medium leading-[1.35] tracking-tight sm:text-xs">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
