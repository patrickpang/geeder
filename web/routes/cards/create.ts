import { FreshContext, Handlers } from "$fresh/server.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import { State } from "../_middleware.ts";

interface Payload {
  id: string;
  question: string;
  answer: string;
}

export const handler: Handlers = {
  async POST(request: Request, context: FreshContext<State>) {
    const userId = getUserIdFromRequest(request);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id, question, answer } = await request.json() as Payload;
    const createdAt = (new Date()).toISOString();
    console.log({ id, question, answer, userId, createdAt });
    await context.state.turso.execute({
      sql: `
        insert into cards (id, user_id, question, answer, created_at) 
        values (:id, :userId, :question, :answer, :createdAt)
      `,
      args: { id, question, answer, userId, createdAt },
    });

    return Response.json({ success: true, id });
  },
};
