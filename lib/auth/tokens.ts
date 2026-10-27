import { createHash, randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const getSecret = (name: string): Uint8Array => {
  const value = process.env[name];

  if (!value || value.length < 32) {
    throw new Error(`${name} debe tener al menos 32 caracteres`);
  }

  return new TextEncoder().encode(value);
};

export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const createAccessToken = async (
  userId: string,
  role: "USER" | "ADMIN"
): Promise<string> =>
  new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m")
    .sign(getSecret("JWT_ACCESS_SECRET"));

export const createRefreshToken = async (
  userId: string
): Promise<string> =>
  new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d")
    .sign(getSecret("JWT_REFRESH_SECRET"));

export const verifyAccessToken = async (token: string) =>
  jwtVerify(token, getSecret("JWT_ACCESS_SECRET"), {
    algorithms: ["HS256"],
  });

export const verifyRefreshToken = async (token: string) =>
  jwtVerify(token, getSecret("JWT_REFRESH_SECRET"), {
    algorithms: ["HS256"],
  });