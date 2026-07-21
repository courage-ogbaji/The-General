import Link from "next/link";
import {
  Sparkles,
  Heart,
  PartyPopper,
  BookOpen,
  Award,
  Images,
  MessageCircleHeart,
} from "lucide-react";
import { auth } from "@/auth";
import { IslandCTA } from "@/components/island-cta";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

const CELEBRANT_NAME = "[Celebrant's Name]";

const exploreItems = [
  {
    href: "/biography",
    label: "Her Story",
    desc: "Where it all began",
    icon: BookOpen,
    badge: "bg-jewel-plum/15 text-jewel-plum group-hover:bg-jewel-plum",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    href: "/achievements",
    label: "Achievements",
    desc: "Everything she's built",
    icon: Award,
    badge: "bg-jewel-gold/15 text-jewel-gold group-hover:bg-jewel-gold",
    span: "",
  },
  {
    href: "/gallery",
    label: "Gallery",
    desc: "Photos and memories",
    icon: Images,
    badge: "bg-jewel-teal/15 text-jewel-teal group-hover:bg-jewel-teal",
    span: "",
  },
  {
    href: "/wishes",
    label: "Wall of Wishes",
    desc: "What everyone's saying",
    icon: MessageCircleHeart,
    badge: "bg-jewel-rose/15 text-jewel-rose group-hover:bg-jewel-rose",
    span: "lg:col-span-2",
  },
];

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
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="bg-warm-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <ScrollReveal>
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-primary uppercase">
              <PartyPopper className="size-3" />
              It&apos;s her birthday
            </span>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">
              Celebrating {CELEBRANT_NAME}
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              A little corner of the internet where everyone who loves her
              gets to say so — in photos, videos, and words.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {session?.user ? (
                <IslandCTA href="/wishes/new">Leave your wish</IslandCTA>
              ) : (
                <IslandCTA href="/signup">Sign up to leave your wish</IslandCTA>
              )}
              <IslandCTA href="/wishes" variant="outline">
                See her wishes
              </IslandCTA>
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
      <section className="px-4 pb-32">
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
      <section className="bg-confetti-dots relative border-t border-border/60 px-4 py-16">
        <div className="absolute inset-0 bg-muted/50" />
        <div className="relative mx-auto max-w-5xl">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="font-heading text-3xl">Explore</h2>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {exploreItems.map((item, index) => (
              <ScrollReveal
                key={item.href}
                delay={index * 0.08}
                className={item.span}
              >
                <Link
                  href={item.href}
                  className="bezel-shell group block h-full transition-all duration-500 ease-fluid hover:-translate-y-1"
                >
                  <div
                    className={cn(
                      "bezel-core flex h-full flex-col justify-between gap-6 bg-card p-6 transition-shadow group-hover:shadow-lg",
                      index === 0 && "sm:p-8"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full transition-colors group-hover:text-white",
                        item.badge
                      )}
                    >
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-xl">{item.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
