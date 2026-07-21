import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WishItem } from "./wish-item";

export default async function WisherDetailPage({
  params,
}: {
  params: Promise<{ wisherId: string }>;
}) {
  const { wisherId } = await params;
  const session = await auth();
  const currentUser = session?.user
    ? { id: session.user.id, role: session.user.role }
    : null;

  const wisher = await prisma.user.findUnique({
    where: { id: wisherId },
    include: {
      wishes: {
        include: {
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
      },
    },
  });

  if (!wisher || wisher.role !== "WISHER") {
    notFound();
  }

  const initials = wisher.displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <ScrollReveal className="mb-10 flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage
            src={wisher.profilePhotoUrl ?? undefined}
            alt={wisher.displayName}
          />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl">
            {wisher.displayName}
          </h1>
          {wisher.bio && (
            <p className="text-sm text-muted-foreground">{wisher.bio}</p>
          )}
        </div>
      </ScrollReveal>

      {wisher.wishes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {`${wisher.displayName} hasn't left a wish yet.`}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {wisher.wishes.map((wish, index) => (
            <ScrollReveal key={wish.id} delay={(index % 4) * 0.06}>
              <WishItem wish={wish} currentUser={currentUser} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
