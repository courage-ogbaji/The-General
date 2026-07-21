import Image from "next/image";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { ScrollReveal } from "@/components/scroll-reveal";
import { prisma } from "@/lib/prisma";

export default async function BiographyPage() {
  const sections = await prisma.biographySection.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:py-28">
      <ScrollReveal className="mb-20 text-center">
        <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-primary uppercase">
          Her Story
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl">
          How she got here
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every chapter that made her who she is today.
        </p>
      </ScrollReveal>

      {sections.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Her story is being written — check back soon.
        </p>
      ) : (
        <ol className="space-y-20 sm:space-y-32">
          {sections.map((section, index) => {
            const reversed = index % 2 === 1;
            return (
              <li
                key={section.id}
                className="grid items-center gap-8 sm:grid-cols-2"
              >
                <ScrollReveal
                  className={reversed ? "sm:order-2" : undefined}
                >
                  {section.imageUrl ? (
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-card shadow-lg">
                      <Image
                        src={section.imageUrl}
                        alt={section.title}
                        fill
                        sizes="(min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <PlaceholderPhoto
                      label={`Photo placeholder — ${section.title}`}
                      variant={index}
                      className={`aspect-[4/5] w-full rounded-3xl border-4 border-card shadow-lg ${
                        reversed ? "-rotate-2" : "rotate-2"
                      }`}
                    />
                  )}
                </ScrollReveal>
                <ScrollReveal
                  delay={0.1}
                  className={reversed ? "sm:order-1" : undefined}
                >
                  <span className="text-xs font-medium tracking-[0.15em] text-primary uppercase">
                    Chapter {index + 1}
                  </span>
                  <h2 className="font-heading mt-1 text-2xl sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {section.body}
                  </p>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
