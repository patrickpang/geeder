import { define } from "../../utils.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import { nanoid } from "nanoid";

interface Payload {
  excerpt: string;
}

interface QnA {
  question: string;
  answer: string;
}

export const handler = define.handlers({
  async POST(ctx) {
    if (getUserIdFromRequest(ctx.req) === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { excerpt } = await ctx.req.json() as Payload;

    const prompt =
      `Generate multiple anki flashcards based on this textbook excerpt. ` +
      `Return ONLY a JSON array of objects with "question" and "answer" string fields. No other text, no markdown fences.\n\nExcerpt:\n${excerpt}`;

    const cmd = new Deno.Command("gemini", {
      args: ["-m", "gemini-3-flash-preview", prompt],
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout, stderr, success } = await cmd.output();
    if (!success) {
      console.error("gemini CLI error:", new TextDecoder().decode(stderr));
      return new Response("LLM error", { status: 500 });
    }

    const text = new TextDecoder().decode(stdout);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON array in gemini response:", text);
      return new Response("Failed to parse LLM response", { status: 500 });
    }

    const cards = (JSON.parse(jsonMatch[0]) as QnA[]).map((qna) => ({
      ...qna,
      id: nanoid(),
    }));

    return Response.json({ success: true, cards });
  },
});
