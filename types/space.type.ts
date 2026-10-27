export type SpaceSummary = {
  id: string;
  name: string;
  description: string;
  type: "DESK" | "MEETING_ROOM" | "PHONE_BOOTH";
  pricePerHour: number;
  capacity: number;
  imageUrl: string | null;
  isActive: boolean;
};