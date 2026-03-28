import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { verifyAccessToken } from "@naveencodes/auth";
import type { UserRole } from "@naveencodes/core";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export function readBearerToken(header?: string): string | null {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export function getAuthenticatedUser(app: FastifyInstance, request: FastifyRequest): AuthenticatedUser | null {
  const token = readBearerToken(request.headers.authorization);
  if (!token) {
    return null;
  }

  try {
    const payload = verifyAccessToken(token, app.config.JWT_SECRET);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function requireAuthenticatedUser(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): AuthenticatedUser | null {
  const user = getAuthenticatedUser(app, request);

  if (!user) {
    reply.code(401).send({ message: "Authentication required" });
    return null;
  }

  return user;
}
