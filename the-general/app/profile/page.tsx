import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl mb-1">Your profile</h1>
      <p className="text-muted-foreground mb-8">
        Update how you appear to her and everyone else.
      </p>

      <ProfileForm
        displayName={user.displayName}
        bio={user.bio ?? ""}
        profilePhotoUrl={user.profilePhotoUrl}
      />

      <div className="mt-12">
        <h2 className="font-heading text-2xl mb-4">Your wishes</h2>
        <WishList
          wishes={wishes}
          currentUser={{ id: user.id, role: user.role }}
        />
      </div>
    </div>
  );
}
