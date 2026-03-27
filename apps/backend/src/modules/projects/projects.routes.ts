import type { FastifyInstance } from "fastify";
import { z } from "zod";

const seedProjects = [
  {
    id: crypto.randomUUID(),
    name: "NaveenCodes.com",
    status: "active",
    targetUrl: "https://naveencodes.com",
    environment: "production",
    seoScore: 94,
    performanceScore: 91
  },
  {
    id: crypto.randomUUID(),
    name: "Client Commerce QA",
    status: "monitoring",
    targetUrl: "https://shop-demo.naveencodes.com",
    environment: "staging",
    seoScore: 88,
    performanceScore: 84
  },
  {
    id: crypto.randomUUID(),
    name: "Docs Portal",
    status: "draft",
    targetUrl: "https://docs-demo.naveencodes.com",
    environment: "preview",
    seoScore: 90,
    performanceScore: 93
  }
];

const createProjectSchema = z.object({
  name: z.string().min(2),
  targetUrl: z.string().url(),
  environment: z.enum(["production", "staging", "preview"]).default("production")
});

export async function registerProjectRoutes(app: FastifyInstance) {
  app.get("/api/projects", async () => ({
    items: seedProjects
  }));

  app.post("/api/projects", async (request, reply) => {
    const payload = createProjectSchema.parse(request.body);
    const project = {
      id: crypto.randomUUID(),
      name: payload.name,
      status: "active",
      targetUrl: payload.targetUrl,
      environment: payload.environment,
      seoScore: 89,
      performanceScore: 87
    };

    seedProjects.unshift(project);
    return reply.status(201).send({ project });
  });

  app.get("/api/projects/active", async () => ({
    project: seedProjects[0]
  }));
}
