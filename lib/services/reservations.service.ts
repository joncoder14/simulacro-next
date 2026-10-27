
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type CreateReservationInput = {
  userId: string;
  spaceId: string;
  startAt: Date;
  endAt: Date;
};

function getBogotaParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}

export const createReservation = async (
  input: CreateReservationInput,
) => {
  const { userId, spaceId, startAt, endAt } = input;
  const now = new Date();

  if (
    Number.isNaN(startAt.getTime()) ||
    Number.isNaN(endAt.getTime()) ||
    endAt <= startAt
  ) {
    throw new Error("INVALID_DURATION");
  }

  const duration =
    (endAt.getTime() - startAt.getTime()) / 3_600_000;

  const startUTC = {
    minutes: startAt.getUTCMinutes(),
    seconds: startAt.getUTCSeconds(),
    milliseconds: startAt.getUTCMilliseconds(),
  };

  const endUTC = {
    minutes: endAt.getUTCMinutes(),
    seconds: endAt.getUTCSeconds(),
    milliseconds: endAt.getUTCMilliseconds(),
  };

  const hoursAreWhole =
    startUTC.minutes === 0 &&
    startUTC.seconds === 0 &&
    startUTC.milliseconds === 0 &&
    endUTC.minutes === 0 &&
    endUTC.seconds === 0 &&
    endUTC.milliseconds === 0;

  if (
    !Number.isInteger(duration) ||
    duration < 1 ||
    duration > 4 ||
    !hoursAreWhole
  ) {
    throw new Error("INVALID_DURATION");
  }

  if (
    startAt <= now ||
    startAt.getTime() > now.getTime() + 30 * 24 * 60 * 60 * 1000
  ) {
    throw new Error("INVALID_DATE");
  }

  // El horario comercial se evalúa en la hora de Colombia.
  const startLocal = getBogotaParts(startAt);
  const endLocal = getBogotaParts(endAt);

  const sameLocalDay =
    startLocal.year === endLocal.year &&
    startLocal.month === endLocal.month &&
    startLocal.day === endLocal.day;

  const startHour = Number(startLocal.hour);
  const endHour = Number(endLocal.hour);
  const startMinute = Number(startLocal.minute);
  const endMinute = Number(endLocal.minute);

  if (
    !sameLocalDay ||
    startHour < 7 ||
    endHour > 21 ||
    startMinute !== 0 ||
    endMinute !== 0
  ) {
    throw new Error("OUTSIDE_BUSINESS_HOURS");
  }

  return prisma.$transaction(
    async (tx) => {
      const space = await tx.space.findFirst({
        where: {
          id: spaceId,
          isActive: true,
        },
      });

      if (!space) {
        throw new Error("SPACE_NOT_AVAILABLE");
      }

      const overlapping = {
        status: "CONFIRMED" as const,
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      };

      const [spaceConflict, userConflict, futureCount] =
        await Promise.all([
          tx.reservation.count({
            where: {
              spaceId,
              ...overlapping,
            },
          }),
          tx.reservation.count({
            where: {
              userId,
              ...overlapping,
            },
          }),
          tx.reservation.count({
            where: {
              userId,
              status: "CONFIRMED",
              startAt: { gt: now },
            },
          }),
        ]);

      if (spaceConflict > 0) {
        throw new Error("SPACE_TIME_CONFLICT");
      }

      if (userConflict > 0) {
        throw new Error("USER_TIME_CONFLICT");
      }

      if (futureCount >= 3) {
        throw new Error("RESERVATION_LIMIT");
      }

      return tx.reservation.create({
        data: {
          userId,
          spaceId,
          startAt,
          endAt,
          totalPrice: duration * space.pricePerHour,
        },
        include: {
          space: true,
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
};

export const listUserReservations = (userId: string) =>
  prisma.reservation.findMany({
    where: { userId },
    include: { space: true },
    orderBy: { startAt: "desc" },
  });

export const cancelReservation = async (
  reservationId: string,
  userId: string,
  isAdmin: boolean,
) => {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    if (!isAdmin && reservation.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (reservation.status !== "CONFIRMED") {
      throw new Error("ALREADY_CANCELLED");
    }

    if (
      !isAdmin &&
      reservation.startAt.getTime() - Date.now() <
        2 * 60 * 60 * 1000
    ) {
      throw new Error("CANCELLATION_TOO_LATE");
    }

    return tx.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" },
      include: { space: true },
    });
  });
};
