import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-primary/30 via-accent/25 to-secondary/40",
  "from-accent/35 via-primary/20 to-secondary/30",
  "from-secondary/50 via-primary/25 to-accent/30",
  "from-primary/25 via-secondary/35 to-accent/25",
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
  const gradient = GRADIENTS[variant % GRADIENTS.length];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-gradient-to-br text-center",
        gradient,
        className
      )}
    >
      <ImageIcon className="size-6 text-foreground/40" strokeWidth={1.5} />
      <span className="px-3 text-xs font-medium text-foreground/50">
        {label}
      </span>
    </div>
  );
}
