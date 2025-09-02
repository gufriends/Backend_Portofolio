import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ulid } from "ulid";

export async function seedAdmin(prisma: PrismaClient) {
  const countAdmin = await prisma.user.count();

  if (countAdmin === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
      data: {
        id: ulid(),
        fullName: "Admin Portfolio",
        password: hashedPassword,
        email: "admin@portfolio.com",
      },
    });

    console.log("Admin seeded");
  } else {
    console.log("Admin already exists");
  }
}
