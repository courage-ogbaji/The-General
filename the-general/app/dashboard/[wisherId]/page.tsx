import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WisherProfileHeader } from "@/components/wisher-profile-header";
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:py-28">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <WisherProfileHeader
        displayName={wisher.displayName}
        profilePhotoUrl={wisher.profilePhotoUrl}
        bio={wisher.bio}
        location={wisher.location}
        phone={wisher.phone}
      />

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
