import { FreshContext, Handlers } from "$fresh/server.ts";
import { nanoid } from "nanoid";
import OpenAI from "openai";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import { Card } from "../../lib/model.ts";

interface Payload {
  excerpt: string;
}

export const handler: Handlers = {
  async POST(request: Request, _context: FreshContext) {
    if (getUserIdFromRequest(request) === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { excerpt } = await request.json() as Payload;

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

    console.log(Deno.env.get("GEMINI_API_KEY")!);

    const client = new OpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: Deno.env.get("GEMINI_API_KEY")!,
      dangerouslyAllowBrowser: true, // OpenAI library thinks SSR is browser environment
    });

    const result = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-2.0-flash-exp",
    });
    const response = result.choices[0].message.content!;

    const cards = response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => ({ ...JSON.parse(line), id: nanoid() } as Card));

    return Response.json({ success: true, cards });
  },
};
