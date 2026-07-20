"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type WisherSummary = {
  id: string;
  displayName: string;
  profilePhotoUrl: string | null;
  wishCount: number;
};

export function WisherSearch({ wishers }: { wishers: WisherSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wishers;
    return wishers.filter((w) => w.displayName.toLowerCase().includes(q));
  }, [wishers, query]);

  return (
    <div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search wishers by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No wishers match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((wisher) => {
            const initials = wisher.displayName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <Link
                key={wisher.id}
                href={`/dashboard/${wisher.id}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Avatar className="size-11">
                  <AvatarImage
                    src={wisher.profilePhotoUrl ?? undefined}
                    alt={wisher.displayName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {wisher.displayName}
                  </p>
                  <Badge variant="secondary" className="mt-0.5">
                    {wisher.wishCount} {wisher.wishCount === 1 ? "wish" : "wishes"}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
