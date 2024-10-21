import type { APIEvent } from "@solidjs/start/server";
import OpenAI from "openai";
import { requireAuth } from "~/lib/auth";
import { env } from "~/lib/cloudfare";

export async function POST(event: APIEvent) {
  requireAuth(event);

  const payload = JSON.parse(await event.request.text());
  const excerpt = payload["excerpt"];

  console.log({ payload, excerpt });

  const prompt = `
    <task>Generate multiple anki cards based on <excerpt> from a textbook</task>
    <excerpt>
    ${excerpt}
    </excerpt>
    <format>
        Only return valid ndjson. 
        One card per line.
        No markdown.
        No introduction.
    </format>
    <example>
    {"question": str, "answer": str}
    </example>
  `;

  const client = new OpenAI({
    baseURL: env().GROQ_BASE_URL,
    apiKey: env().GROQ_API_KEY,
  });

  const result = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-70b-versatile",
  });
  const response = result.choices[0].message.content!;

  console.log({ response });

  const cards = response
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line));

  return cards;
}
