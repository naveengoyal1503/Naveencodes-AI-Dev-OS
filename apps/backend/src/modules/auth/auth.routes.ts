import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { createAccessToken, hashPassword, verifyAccessToken, verifyPassword } from "@naveencodes/auth";
import type { UserRole } from "@naveencodes/core";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["admin", "manager", "member"]).default("member")
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const users = new Map<string, StoredUser>();

function readBearerToken(header?: string): string | null {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", async (request, reply) => {
    const payload = registerSchema.parse(request.body);
    const existing = users.get(payload.email.toLowerCase());

    if (existing) {
      return reply.status(409).send({ message: "User already exists" });
    }

    const user: StoredUser = {
      id: crypto.randomUUID(),
      email: payload.email.toLowerCase(),
      fullName: payload.fullName,
      passwordHash: await hashPassword(payload.password),
      role: payload.role
    };

    users.set(user.email, user);

    return reply.status(201).send({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    });
  });

  app.post("/api/auth/login", async (request, reply) => {
    const payload = loginSchema.parse(request.body);
    const user = users.get(payload.email.toLowerCase());

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    return {
      accessToken: createAccessToken(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        app.config.JWT_SECRET
      ),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  });

  app.get("/api/auth/me", async (request, reply) => {
    const token = readBearerToken(request.headers.authorization);

    if (!token) {
      return reply.status(401).send({ message: "Missing bearer token" });
    }

    try {
      const payload = verifyAccessToken(token, app.config.JWT_SECRET);
      const user = Array.from(users.values()).find((item) => item.id === payload.sub);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      };
    } catch {
      return reply.status(401).send({ message: "Invalid token" });
    }
  });

  app.get("/api/auth/history", async (request, reply) => {
    const token = readBearerToken(request.headers.authorization);

    if (!token) {
      return reply.status(401).send({ message: "Missing bearer token" });
    }

    try {
      const payload = verifyAccessToken(token, app.config.JWT_SECRET);

      return {
        userId: payload.sub,
        items: [
          {
            id: crypto.randomUUID(),
            type: "seo-scan",
            title: "Homepage SEO audit completed",
            createdAt: "2026-03-27T09:15:00.000Z",
            status: "completed"
          },
          {
            id: crypto.randomUUID(),
            type: "performance-run",
            title: "Performance sweep completed for staging",
            createdAt: "2026-03-26T18:45:00.000Z",
            status: "completed"
          },
          {
            id: crypto.randomUUID(),
            type: "ui-fix-loop",
            title: "UI overflow issue fixed and retested",
            createdAt: "2026-03-25T14:20:00.000Z",
            status: "resolved"
          }
        ]
      };
    } catch {
      return reply.status(401).send({ message: "Invalid token" });
    }
  });
}
