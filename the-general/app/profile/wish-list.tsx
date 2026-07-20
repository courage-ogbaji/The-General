"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deleteWishAction } from "./actions";
import { Button } from "@/components/ui/button";
import type { Wish } from "@/lib/generated/prisma/client";

export function WishList({ wishes }: { wishes: Wish[] }) {
  if (wishes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You haven&apos;t posted a wish yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {wishes.map((wish) => (
        <WishRow key={wish.id} wish={wish} />
      ))}
    </ul>
  );
}

function WishRow({ wish }: { wish: Wish }) {
  const [isPending, startTransition] = useTransition();
  const thumbnail = wish.mediaUrls[0];

  return (
    <li className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3">
      {thumbnail && (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {wish.caption && (
          <p className="line-clamp-2 text-sm text-foreground">{wish.caption}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(wish.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        aria-label="Delete wish"
        onClick={() => startTransition(() => deleteWishAction(wish.id))}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
