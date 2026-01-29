import prisma from "../src/helper/pooler.js";
import { processesSeedData } from "./processes.seed.js";

async function main() {
  console.log("🌱 Seeding manufacturing processes...");

  for (const process of processesSeedData) {
    await prisma.process.create({
      data: {
        name: process.name,
        description: process.description,
        icon: process.icon,
        highlights: process.highlights,
      },
    });

    console.log(`✅ Seeded: ${process.name}`);
  }

  console.log("🎉 Process seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
