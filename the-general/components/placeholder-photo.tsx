import { Heart, Sparkles, Star, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = [
  { gradient: "from-jewel-rose via-jewel-coral to-jewel-gold", icon: Heart },
  { gradient: "from-jewel-plum via-jewel-rose to-jewel-coral", icon: Sparkles },
  { gradient: "from-jewel-teal via-jewel-plum to-jewel-rose", icon: Star },
  { gradient: "from-jewel-gold via-jewel-coral to-jewel-plum", icon: Gift },
  { gradient: "from-jewel-coral via-jewel-gold to-jewel-teal", icon: Sparkles },
  { gradient: "from-jewel-rose via-jewel-plum to-jewel-teal", icon: Heart },
];

export function PlaceholderPhoto({
  label,
  variant = 0,
  className,
}: {
  label: string;
  variant?: number;
  className?: string;
}) {
  const { gradient, icon: Icon } = VARIANTS[variant % VARIANTS.length];

  return (
    <div
      className={cn(
        "group relative isolate flex items-end overflow-hidden bg-gradient-to-br text-white",
        gradient,
        className
      )}
    >
      {/* soft sheen for depth, independent of gradient hue */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/15" />
      <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/15 blur-2xl" />

      <Icon
        className="absolute top-3 right-3 size-4 text-white/70"
        strokeWidth={1.75}
      />

      <span className="relative z-10 line-clamp-2 px-3 pb-3 text-[11px] leading-snug font-medium text-white/90">
        {label}
      </span>
    </div>
  );
}
