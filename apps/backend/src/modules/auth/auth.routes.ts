import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { createAccessToken, hashPassword, verifyPassword } from "@naveencodes/auth";

import { requireAuthenticatedUser } from "../../infrastructure/auth-context.js";
import {
  createActivityLog,
  createUser,
  findUserByEmail,
  findUserById,
  getUserApiKey,
  listActivityLogsByUser,
  upsertUserApiKey
} from "../../infrastructure/repositories.js";
import { encryptSecret } from "../../infrastructure/secrets.js";

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

const apiKeySchema = z.object({
  provider: z.enum(["openai"]).default("openai"),
  apiKey: z.string().min(20)
});

function buildUserResponse(user: Awaited<ReturnType<typeof findUserById>>) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", async (request, reply) => {
    const payload = registerSchema.parse(request.body);
    const email = payload.email.toLowerCase();
    const existing = await findUserByEmail(app.db, email);

    if (existing) {
      return reply.status(409).send({ message: "User already exists" });
    }

    const user = await createUser(app.db, {
      id: crypto.randomUUID(),
      email,
      fullName: payload.fullName,
      passwordHash: await hashPassword(payload.password),
      role: payload.role
    });

    if (!user) {
      return reply.status(500).send({ message: "Unable to create user" });
    }

    await createActivityLog(app.db, {
      id: crypto.randomUUID(),
      userId: user.id,
      type: "auth.register",
      title: "Workspace account created",
      status: "completed",
      metadataJson: JSON.stringify({ email: user.email })
    });

    return reply.status(201).send(buildUserResponse(user));
  });

  app.post("/api/auth/login", async (request, reply) => {
    const payload = loginSchema.parse(request.body);
    const email = payload.email.toLowerCase();
    const user = await findUserByEmail(app.db, email);

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    await createActivityLog(app.db, {
      id: crypto.randomUUID(),
      userId: user.id,
      type: "auth.login",
      title: "User logged in",
      status: "completed"
    });

    return {
      accessToken: createAccessToken(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        app.config.JWT_SECRET
      ),
      user: buildUserResponse(user)
    };
  });

  app.get("/api/auth/me", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const user = await findUserById(app.db, session.id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return {
      user: buildUserResponse(user)
    };
  });

  app.get("/api/auth/history", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const items = await listActivityLogsByUser(app.db, session.id);

    return {
      userId: session.id,
      items: items.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        createdAt: item.createdAt,
        status: item.status,
        metadata: item.metadataJson ? JSON.parse(item.metadataJson) : null
      }))
    };
  });

  app.get("/api/auth/api-key", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const storedKey = await getUserApiKey(app.db, session.id, app.config.AI_PROVIDER);

    return {
      provider: app.config.AI_PROVIDER,
      configured: Boolean(storedKey),
      keyHint: storedKey?.keyHint ?? null,
      updatedAt: storedKey?.updatedAt ?? null
    };
  });

  app.put("/api/auth/api-key", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const payload = apiKeySchema.parse(request.body);
    const encrypted = encryptSecret(payload.apiKey, app.config.ENCRYPTION_SECRET);

    await upsertUserApiKey(app.db, {
      userId: session.id,
      provider: payload.provider,
      encryptedKey: encrypted.encryptedKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyHint: encrypted.keyHint
    });

    await createActivityLog(app.db, {
      id: crypto.randomUUID(),
      userId: session.id,
      type: "auth.api_key",
      title: `${payload.provider} API key updated`,
      status: "completed",
      metadataJson: JSON.stringify({ provider: payload.provider, keyHint: encrypted.keyHint })
    });

    return reply.status(204).send();
  });
}
