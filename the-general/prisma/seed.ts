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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
