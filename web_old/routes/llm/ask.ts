import { FreshContext, Handlers } from "$fresh/server.ts";
import { nanoid } from "nanoid";
import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai";
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
    `;

    const schema = {
      description: "list of cards",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "question",
            nullable: false,
          },
          answer: {
            type: SchemaType.STRING,
            description: "answer",
            nullable: false,
          },
        },
        required: ["question", "answer"],
      },
    };

    const client = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = client.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cards = JSON.parse(response)
      .map((qna) => ({ ...qna, id: nanoid() } as Card));

    return Response.json({ success: true, cards });
  },
};
