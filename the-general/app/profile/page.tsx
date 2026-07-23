import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { WisherProfileHeader } from "@/components/wisher-profile-header";
import { WishList } from "./wish-list";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  const wishes = await prisma.wish.findMany({
    where: { authorId: user.id },
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
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:py-28">
      <WisherProfileHeader
        displayName={user.displayName}
        profilePhotoUrl={user.profilePhotoUrl}
        bio={user.bio}
        location={user.location}
        phone={user.phone}
        action={
          <Button render={<Link href="/profile/edit" />} nativeButton={false} variant="outline">
            <Pencil className="size-4" />
            Edit profile
          </Button>
        }
      />

      <div>
        <h2 className="font-heading mb-4 text-2xl">Your wishes</h2>
        <WishList
          wishes={wishes}
          currentUser={{ id: user.id, role: user.role }}
        />
      </div>
    </div>
  );
}
