import { ScrollReveal } from "@/components/scroll-reveal";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "./gallery-grid";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ScrollReveal className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium text-primary">Gallery</p>
        <h1 className="font-heading text-4xl sm:text-5xl">
          Photos and memories
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tap a photo for the story behind it.
        </p>
      </ScrollReveal>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          The gallery is filling up soon.
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  );
}
