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
      where: author ? { authorId: author } : undefined,
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
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { wishes: { some: {} } },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl mb-1">Wall of Wishes</h1>
          <p className="text-muted-foreground">
            Every message, photo, and video from everyone who loves her.
          </p>
        </div>
        {wishers.length > 0 && <WisherFilter wishers={wishers} />}
      </div>

      {wishes.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No wishes {author ? "from this wisher " : ""}yet — be the first.
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
