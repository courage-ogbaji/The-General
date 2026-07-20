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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
