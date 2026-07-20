import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.CELEBRANT_EMAIL;
  const password = process.env.CELEBRANT_PASSWORD;
  const displayName = process.env.CELEBRANT_NAME ?? "The Celebrant";

  if (!email || !password) {
    throw new Error(
      "Set CELEBRANT_EMAIL and CELEBRANT_PASSWORD in .env before seeding."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const celebrant = await prisma.user.upsert({
    where: { email },
    update: { role: "CELEBRANT" },
    create: {
      email,
      hashedPassword,
      displayName,
      role: "CELEBRANT",
    },
  });

  console.log(`Celebrant account ready: ${celebrant.email}`);

  const biographySectionCount = await prisma.biographySection.count();
  if (biographySectionCount === 0) {
    await prisma.biographySection.createMany({
      data: [
        {
          title: "Where it began",
          body: "[Placeholder] This is where her story starts — replace this with the real beginning: where she grew up, what she was like as a kid, the little details that made her, her.",
          orderIndex: 0,
        },
        {
          title: "Finding her people",
          body: "[Placeholder] The friendships, the found family, the people who showed up. Swap this in for the real story of how she built the circle she has today.",
          orderIndex: 1,
        },
        {
          title: "Chasing what mattered",
          body: "[Placeholder] School, career, the risks she took and the work she put in. This is the placeholder for the chapter about her ambition and what she's built.",
          orderIndex: 2,
        },
        {
          title: "Who she is today",
          body: "[Placeholder] The person everyone in this room showed up for. Replace this closing chapter with what makes her, her, right now.",
          orderIndex: 3,
        },
      ],
    });
    console.log("Seeded placeholder biography sections.");
  }

  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: "[Placeholder] Graduated with honors",
          description:
            "Replace with a real milestone — degree, certification, or big personal win.",
          date: new Date("2018-05-15"),
          orderIndex: 0,
        },
        {
          title: "[Placeholder] Landed the dream role",
          description:
            "Replace with the career achievement worth celebrating — a promotion, a launch, a leap of faith that paid off.",
          date: new Date("2021-03-01"),
          orderIndex: 1,
        },
        {
          title: "[Placeholder] Built something of her own",
          description:
            "Replace with a project, business, or creative work she's proud of.",
          date: new Date("2023-09-10"),
          orderIndex: 2,
        },
        {
          title: "[Placeholder] A milestone worth celebrating",
          description:
            "One more placeholder slot — a trip, a personal victory, whatever deserves a spot here.",
          date: new Date("2025-01-20"),
          orderIndex: 3,
        },
      ],
    });
    console.log("Seeded placeholder achievements.");
  }

  const galleryItemCount = await prisma.galleryItem.count();
  if (galleryItemCount === 0) {
    await prisma.galleryItem.createMany({
      data: [
        {
          type: "IMAGE",
          caption: "[Placeholder] Swap in a favorite photo and tell its story here.",
          date: new Date("2019-06-01"),
          orderIndex: 0,
        },
        {
          type: "IMAGE",
          caption: "[Placeholder] Another memory worth keeping.",
          date: new Date("2020-11-12"),
          orderIndex: 1,
        },
        {
          type: "IMAGE",
          caption: "[Placeholder] The one everyone always brings up.",
          date: new Date("2022-02-14"),
          orderIndex: 2,
        },
        {
          type: "IMAGE",
          caption: "[Placeholder] A quieter, still-favorite moment.",
          date: new Date("2023-07-04"),
          orderIndex: 3,
        },
        {
          type: "IMAGE",
          caption: "[Placeholder] One more for the gallery.",
          date: new Date("2024-12-25"),
          orderIndex: 4,
        },
        {
          type: "IMAGE",
          caption: "[Placeholder] The most recent one — for now.",
          date: new Date("2025-08-30"),
          orderIndex: 5,
        },
      ],
    });
    console.log("Seeded placeholder gallery items.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
