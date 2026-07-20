import { Users, MessageSquareHeart, Images } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WisherSearch } from "./wisher-search";

export default async function DashboardPage() {
  const [wishers, totalWishes, wishes] = await Promise.all([
    prisma.user.findMany({
      where: { role: "WISHER" },
      select: {
        id: true,
        displayName: true,
        profilePhotoUrl: true,
        _count: { select: { wishes: true } },
      },
      orderBy: { displayName: "asc" },
    }),
    prisma.wish.count(),
    prisma.wish.findMany({ select: { mediaUrls: true } }),
  ]);

  const totalMedia = wishes.reduce((sum, w) => sum + w.mediaUrls.length, 0);

  const stats = [
    { icon: Users, label: "Wishers", value: wishers.length },
    { icon: MessageSquareHeart, label: "Wishes", value: totalWishes },
    { icon: Images, label: "Photos & videos", value: totalMedia },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <ScrollReveal className="mb-10">
        <p className="mb-2 text-sm font-medium text-primary">
          Just for the birthday girl
        </p>
        <h1 className="font-heading text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Everyone who showed up, and everything they left you.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05} className="mb-10 grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card p-4 text-center sm:p-6"
          >
            <stat.icon className="mx-auto mb-2 size-5 text-primary" />
            <p className="font-heading text-2xl sm:text-3xl">{stat.value}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="font-heading mb-4 text-xl">Wishers</h2>
        {wishers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No one has signed up yet.
          </p>
        ) : (
          <WisherSearch
            wishers={wishers.map((w) => ({
              id: w.id,
              displayName: w.displayName,
              profilePhotoUrl: w.profilePhotoUrl,
              wishCount: w._count.wishes,
            }))}
          />
        )}
      </ScrollReveal>
    </div>
  );
}
