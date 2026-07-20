import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayCircle } from "lucide-react";
import type { Wish, User } from "@/lib/generated/prisma/client";

type WishWithAuthor = Wish & { author: User };

export function WishCard({ wish }: { wish: WishWithAuthor }) {
  const primaryMedia = wish.mediaUrls[0];
  const extraCount = wish.mediaUrls.length - 1;
  const isVideo = wish.type === "VIDEO" || (wish.type === "MIXED" && primaryMedia?.match(/\.(mp4|mov|webm)$/i));
  const initials = wish.author.displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {primaryMedia && (
        <div className="relative bg-muted">
          {isVideo ? (
            <div className="relative aspect-square">
              <video src={primaryMedia} className="size-full object-cover" muted />
              <PlayCircle className="absolute inset-0 m-auto size-10 text-white drop-shadow" />
            </div>
          ) : (
            <div className="relative aspect-square">
              <Image
                src={primaryMedia}
                alt=""
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover"
              />
            </div>
          )}
          {extraCount > 0 && (
            <span className="absolute right-2 bottom-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground">
              +{extraCount}
            </span>
          )}
        </div>
      )}
      <div className="space-y-2 p-4">
        {wish.caption && (
          <p className="text-sm text-foreground">{wish.caption}</p>
        )}
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage
              src={wish.author.profilePhotoUrl ?? undefined}
              alt={wish.author.displayName}
            />
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground">
            {wish.author.displayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(wish.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
