import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditWishForm } from "./edit-wish-form";
import type { WishMedia } from "@/lib/validations/wish";

export default async function EditWishPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/wishes/${wishId}/edit`);
  }

  const wish = await prisma.wish.findUnique({ where: { id: wishId } });
  if (!wish || wish.authorId !== session.user.id) {
    notFound();
  }

  const initialMedia: WishMedia[] = wish.mediaUrls.map((url) => ({
    url,
    type: /\.(mp4|mov|webm)$/i.test(url) ? "VIDEO" : "IMAGE",
  }));

  return (
    <EditWishForm
      wishId={wish.id}
      initialCaption={wish.caption ?? ""}
      initialMedia={initialMedia}
    />
  );
}
