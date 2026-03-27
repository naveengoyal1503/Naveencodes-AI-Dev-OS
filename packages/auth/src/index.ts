import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { UserRole } from "@naveencodes/core";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createAccessToken(payload: AuthTokenPayload, secret: string): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "7d"
  });
}

export function verifyAccessToken(token: string, secret: string): AuthTokenPayload {
  return jwt.verify(token, secret) as AuthTokenPayload;
}
