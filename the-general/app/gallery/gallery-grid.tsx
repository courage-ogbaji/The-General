"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { GalleryItem } from "@/lib/generated/prisma/client";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {items.map((item, index) => (
          <ScrollReveal
            key={item.id}
            delay={(index % 8) * 0.05}
            y={16}
            className="mb-3 break-inside-avoid sm:mb-4"
          >
            <button
              type="button"
              onClick={() => setActive(item)}
              className="block w-full overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.mediaUrl ? (
                item.type === "VIDEO" ? (
                  <div className="relative aspect-square">
                    <video src={item.mediaUrl} className="size-full object-cover" muted />
                    <PlayCircle className="absolute inset-0 m-auto size-9 text-white drop-shadow" />
                  </div>
                ) : (
                  <div className="relative aspect-square">
                    <Image
                      src={item.mediaUrl}
                      alt={item.caption ?? ""}
                      fill
                      sizes="(min-width: 1024px) 25vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                )
              ) : (
                <PlaceholderPhoto
                  label="Photo placeholder"
                  variant={index}
                  className="aspect-square w-full"
                />
              )}
            </button>
          </ScrollReveal>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                {active.mediaUrl ? (
                  active.type === "VIDEO" ? (
                    <video
                      src={active.mediaUrl}
                      className="size-full object-cover"
                      controls
                    />
                  ) : (
                    <Image
                      src={active.mediaUrl}
                      alt={active.caption ?? ""}
                      fill
                      sizes="500px"
                      className="object-cover"
                    />
                  )
                ) : (
                  <PlaceholderPhoto label="Photo placeholder" className="size-full" />
                )}
              </div>
              <DialogHeader>
                {active.date && (
                  <DialogDescription>
                    {new Date(active.date).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </DialogDescription>
                )}
                <DialogTitle className="font-heading text-lg font-normal">
                  {active.caption ?? "A memory"}
                </DialogTitle>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
