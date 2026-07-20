import Image from "next/image";
import { Award } from "lucide-react";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { ScrollReveal } from "@/components/scroll-reveal";
import { prisma } from "@/lib/prisma";

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <ScrollReveal className="mb-14 text-center">
        <p className="mb-2 text-sm font-medium text-primary">Achievements</p>
        <h1 className="font-heading text-4xl sm:text-5xl">
          Everything she&apos;s built
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The milestones, big and small, that got her here.
        </p>
      </ScrollReveal>

      {achievements.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Her achievements are coming soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <ScrollReveal
              key={achievement.id}
              delay={(index % 3) * 0.1}
              className={index % 5 === 0 ? "sm:col-span-2" : undefined}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                {achievement.mediaUrl ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={achievement.mediaUrl}
                      alt={achievement.title}
                      fill
                      sizes="(min-width: 1024px) 380px, 90vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <PlaceholderPhoto
                    label="Photo/video placeholder"
                    variant={index}
                    className="aspect-video w-full"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Award className="size-4" />
                    {achievement.date && (
                      <span className="text-xs font-medium tracking-wide uppercase">
                        {new Date(achievement.date).toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-xl">{achievement.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
