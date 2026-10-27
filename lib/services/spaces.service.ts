import { prisma } from "@/lib/prisma";
import type { SpaceInput } from "@/lib/schemas/space.schema";

export const listSpaces = () =>
  prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

export const getSpace = (id: string) =>
  prisma.space.findFirst({
    where: { id, isActive: true },
  });

export const createSpace = (data: SpaceInput) =>
  prisma.space.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
    },
  });

export const updateSpace = (id: string, data: SpaceInput) =>
  prisma.space.update({
    where: { id },
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
    },
  });

export const deactivateSpace = async (id: string) =>
  prisma.$transaction(async (tx) => {
    const futureReservations = await tx.reservation.count({
      where: {
        spaceId: id,
        status: "CONFIRMED",
        startAt: { gt: new Date() },
      },
    });

    if (futureReservations > 0) {
      throw new Error("SPACE_HAS_FUTURE_RESERVATIONS");
    }

    return tx.space.update({
      where: { id },
      data: { isActive: false },
    });
  });