import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { requireAuthenticatedUser } from "../../infrastructure/auth-context.js";
import { createActivityLog, createProject, getActiveProject, listProjectsByUser } from "../../infrastructure/repositories.js";

const createProjectSchema = z.object({
  name: z.string().min(2),
  targetUrl: z.string().url(),
  environment: z.enum(["production", "staging", "preview"]).default("production")
});

export async function registerProjectRoutes(app: FastifyInstance) {
  app.get("/api/projects", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const items = await listProjectsByUser(app.db, session.id);

    return {
      items
    };
  });

  app.post("/api/projects", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const payload = createProjectSchema.parse(request.body);
    const project = await createProject(app.db, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: payload.name,
      targetUrl: payload.targetUrl,
      environment: payload.environment,
      status: "active",
      seoScore: 0,
      performanceScore: 0
    });

    if (!project) {
      return reply.status(500).send({ message: "Unable to create project" });
    }

    await createActivityLog(app.db, {
      id: crypto.randomUUID(),
      userId: session.id,
      type: "project.create",
      title: `Project created: ${project.name}`,
      status: "completed",
      metadataJson: JSON.stringify({ projectId: project.id, targetUrl: project.targetUrl })
    });

    return reply.status(201).send({ project });
  });

  app.get("/api/projects/active", async (request, reply) => {
    const session = requireAuthenticatedUser(app, request, reply);
    if (!session) {
      return;
    }

    const project = await getActiveProject(app.db, session.id);

    return {
      project
    };
  });
}
