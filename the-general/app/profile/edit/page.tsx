import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "../profile-form";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile/edit");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login?callbackUrl=/profile/edit");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:py-28">
      <h1 className="font-heading text-3xl mb-1">Edit profile</h1>
      <p className="text-muted-foreground mb-8">
        Update how you appear to her and everyone else.
      </p>

      <ProfileForm
        displayName={user.displayName}
        bio={user.bio ?? ""}
        location={user.location ?? ""}
        phone={user.phone ?? ""}
        profilePhotoUrl={user.profilePhotoUrl}
      />
    </div>
  );
}
