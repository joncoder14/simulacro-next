import { z } from "zod";

export const reservationSchema = z.object({
  spaceId: z.string().min(1),
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
});

export type ReservationInput = z.infer<typeof reservationSchema>;