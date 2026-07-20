import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p className="flex items-center gap-1.5">
          Made with <Heart className="size-3.5 fill-primary text-primary" />{" "}
          by everyone who loves her.
        </p>
        <div className="flex gap-4">
          <Link href="/wishes" className="hover:text-foreground">
            Wall of Wishes
          </Link>
          <Link href="/gift" className="hover:text-foreground">
            Gift
          </Link>
        </div>
      </div>
    </footer>
  );
}
