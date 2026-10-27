import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/passwords";

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Configura ADMIN_EMAIL y ADMIN_PASSWORD de al menos 12 caracteres");
  }

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      name: process.env.ADMIN_NAME ?? "CoSpace Admin",
      email,
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    },
  });

  const spaces = [
    {
      name: "Escritorio individual",
      description: "Espacio cómodo para trabajar concentrado.",
      type: "DESK" as const,
      pricePerHour: 10000,
      capacity: 1,
      imageUrl: null,
    },
    {
      name: "Sala de reuniones",
      description: "Sala para reuniones de equipo y clientes.",
      type: "MEETING_ROOM" as const,
      pricePerHour: 40000,
      capacity: 6,
      imageUrl: null,
    },
    {
      name: "Cabina privada",
      description: "Cabina para llamadas y videoconferencias.",
      type: "PHONE_BOOTH" as const,
      pricePerHour: 15000,
      capacity: 1,
      imageUrl: null,
    },
  ];

  for (const space of spaces) {
    const existing = await prisma.space.findFirst({
      where: { name: space.name },
    });

    if (!existing) {
      await prisma.space.create({ data: space });
    }
  }

  console.log("Seed de CoSpace completado");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });