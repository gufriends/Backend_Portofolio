import "../../src/paths";
import { seedAdmin } from "./seedAdmin";
import { prisma } from "../../src/utils/prisma.utils";
import { seedTecnology } from "./seedTechnology";

async function seed() {
  console.log("Start seeding...");
  await seedAdmin(prisma);
  await seedTecnology(prisma);
  console.log("Seeding finished.");
}

seed()
  .then(async () => {
    console.log("ALL SEEDING DONE");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
