import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WisherFilter } from "./wisher-filter";
import { WishCard } from "./wish-card";

export default async function WishesPage({
  searchParams,
}: {
  searchParams: Promise<{ author?: string }>;
}) {
  const { author } = await searchParams;
  const session = await auth();
  const currentUser = session?.user
    ? { id: session.user.id, role: session.user.role }
    : null;

  const [wishes, wishers] = await Promise.all([
    prisma.wish.findMany({
      where: {
        published: true,
        ...(author ? { authorId: author } : {}),
      },
      include: {
        author: true,
        comments: {
          include: {
            author: {
              select: { id: true, displayName: true, profilePhotoUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { wishes: { some: { published: true } } },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:py-28">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-primary uppercase">
            Wall of Wishes
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl">Every wish, for her</h1>
          <p className="mt-1 text-muted-foreground">
            Every message, photo, and video from everyone who loves her.
          </p>
        </div>
        {wishers.length > 0 && <WisherFilter wishers={wishers} />}
      </div>

      {wishes.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No published wishes {author ? "from this wisher " : ""}yet — check
          back soon.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}
