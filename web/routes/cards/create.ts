import { define } from "../../utils.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import type { Card } from "../../lib/model.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const userId = getUserIdFromRequest(ctx.req);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id, question, answer } = await ctx.req.json() as Card;
    const createdAt = new Date().toISOString();
    await ctx.state.turso.execute({
      sql: `
        insert into cards (id, user_id, question, answer, created_at)
        values (:id, :userId, :question, :answer, :createdAt)
      `,
      args: { id, userId, question, answer, createdAt },
    });

    return Response.json({ success: true, id });
  },
});
