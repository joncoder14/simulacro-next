export type ReservationSummary = {
  id: string;
  spaceId: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
};