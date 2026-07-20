import Link from "next/link";
import { Sparkles, Heart, PartyPopper } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { ScrollReveal } from "@/components/scroll-reveal";

const CELEBRANT_NAME = "[Celebrant's Name]";

const collageTiles = [
  {
    kind: "photo" as const,
    label: "Photo placeholder — replace with a favorite shot",
    span: "col-span-2 row-span-2",
    rotate: "-rotate-2",
  },
  {
    kind: "note" as const,
    text: "The friend who remembers everyone's birthday before they do.",
    span: "col-span-1 row-span-1",
    rotate: "rotate-3",
  },
  {
    kind: "photo" as const,
    label: "Photo placeholder",
    span: "col-span-1 row-span-1",
    rotate: "rotate-1",
  },
  {
    kind: "note" as const,
    text: "Turns ordinary Tuesdays into the best part of the week.",
    span: "col-span-1 row-span-1",
    rotate: "-rotate-2",
  },
  {
    kind: "photo" as const,
    label: "Photo placeholder",
    span: "col-span-1 row-span-2",
    rotate: "rotate-2",
  },
  {
    kind: "photo" as const,
    label: "Photo placeholder",
    span: "col-span-2 row-span-1",
    rotate: "-rotate-1",
  },
  {
    kind: "note" as const,
    text: "Loud laugh, louder heart. You know the one.",
    span: "col-span-1 row-span-1",
    rotate: "rotate-2",
  },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <ScrollReveal>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-primary">
              <PartyPopper className="size-4" />
              It&apos;s her birthday
            </p>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">
              Celebrating {CELEBRANT_NAME}
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              A little corner of the internet where everyone who loves her
              gets to say so — in photos, videos, and words.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {session?.user ? (
                <Button render={<Link href="/wishes/new" />} nativeButton={false} size="lg">
                  Leave your wish
                </Button>
              ) : (
                <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
                  Sign up to leave your wish
                </Button>
              )}
              <Button
                render={<Link href="/wishes" />}
                nativeButton={false}
                variant="outline"
                size="lg"
              >
                See her wishes
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="relative mx-auto w-full max-w-sm">
            <PlaceholderPhoto
              label="Hero photo placeholder"
              variant={1}
              className="aspect-[4/5] w-full rotate-2 rounded-3xl border-4 border-card shadow-xl"
            />
            <Sparkles className="absolute -top-4 -right-4 size-8 text-accent" />
            <Heart className="absolute -bottom-3 -left-3 size-7 fill-primary text-primary" />
          </ScrollReveal>
        </div>
      </section>

      {/* Scrapbook collage */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="font-heading text-3xl">A few reasons why</h2>
            <p className="mt-2 text-muted-foreground">
              Just a taste — read her full story below.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[140px]">
            {collageTiles.map((tile, index) => (
              <ScrollReveal
                key={index}
                delay={index * 0.06}
                y={16}
                className={`${tile.span} ${tile.rotate} transition-transform hover:rotate-0 hover:scale-[1.02]`}
              >
                {tile.kind === "photo" ? (
                  <PlaceholderPhoto
                    label={tile.label}
                    variant={index}
                    className="h-full min-h-32 w-full rounded-2xl border-4 border-card shadow-md"
                  />
                ) : (
                  <div className="flex h-full min-h-32 w-full items-center rounded-2xl border border-border/60 bg-card p-4 shadow-md">
                    <p className="font-heading text-base leading-snug text-foreground">
                      &ldquo;{tile.text}&rdquo;
                    </p>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Explore */}
      <section className="border-t border-border/60 bg-muted/40 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-8 text-center">
            <h2 className="font-heading text-3xl">Explore</h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/biography", label: "Her Story", desc: "Where it all began" },
              { href: "/achievements", label: "Achievements", desc: "Everything she's built" },
              { href: "/gallery", label: "Gallery", desc: "Photos and memories" },
              { href: "/wishes", label: "Wall of Wishes", desc: "What everyone's saying" },
            ].map((item, index) => (
              <ScrollReveal key={item.href} delay={index * 0.08}>
                <Link
                  href={item.href}
                  className="block rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="font-heading text-xl">{item.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
