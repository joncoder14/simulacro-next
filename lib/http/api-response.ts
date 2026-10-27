import { NextResponse } from "next/server";

export const apiError = (
  status: number,
  code: string,
  message: string
) =>
  NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );

export const apiSuccess = <T>(data: T, status = 200) =>
  NextResponse.json({ success: true, data }, { status });