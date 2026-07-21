import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Primary hero-tier call-to-action: pill button with a nested trailing
 * icon "island" that gains kinetic tension (translate + scale) on hover.
 * Reserved for the one or two most important actions on a page — not a
 * drop-in replacement for the general Button component.
 */
export function IslandCTA({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-6 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-background text-foreground hover:bg-muted",
        className
      )}
    >
      {children}
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-current/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}
