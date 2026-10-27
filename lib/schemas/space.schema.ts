import { z } from "zod";

export const spaceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(1000),
  type: z.enum(["DESK", "MEETING_ROOM", "PHONE_BOOTH"]),
  pricePerHour: z.number().int().positive(),
  capacity: z.number().int().min(1).max(100),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type SpaceInput = z.infer<typeof spaceSchema>;