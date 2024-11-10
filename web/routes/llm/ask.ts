import { FreshContext, Handlers } from "$fresh/server.ts";
import OpenAI from "openai";
import { getUsernameFromRequest } from "../../lib/auth.ts";

export const handler: Handlers = {
  async POST(request: Request, _context: FreshContext) {
    if (getUsernameFromRequest(request) === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { excerpt } = await request.json();

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
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: Deno.env.get("GROQ_API_KEY")!,
    });

    const result = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.2-90b-text-preview",
    });
    const response = result.choices[0].message.content!;

    const cards = response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => JSON.parse(line));

    return Response.json({ success: true, cards });
  },
};
