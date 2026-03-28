import type { BackendEnv } from "../config/env.js";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function extractContent(payload: ChatCompletionResponse) {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text ?? "")
      .join("\n")
      .trim();
  }

  return "";
}

export async function runAiChatCompletion(input: {
  env: BackendEnv;
  apiKey: string;
  prompt: string;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.env.AI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${normalizeBaseUrl(input.env.AI_PROVIDER_BASE_URL)}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.apiKey}`
      },
      body: JSON.stringify({
        model: input.env.AI_PROVIDER_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: input.env.AI_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: input.prompt
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI provider request failed with ${response.status}: ${errorText}`);
    }

    const payload = (await response.json()) as ChatCompletionResponse;
    const content = extractContent(payload);

    if (!content) {
      throw new Error("AI provider returned an empty response");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}
