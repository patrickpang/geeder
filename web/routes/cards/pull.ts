import { define } from "../../utils.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import type { Card } from "../../lib/model.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const userId = getUserIdFromRequest(ctx.req);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(ctx.req.url);
    const pageSize = parseInt(url.searchParams.get("page_size") ?? "10");

    const result = await ctx.state.turso.execute({
      sql: `
        select id, question, answer
        from cards
        where user_id = :userId
        order by created_at
        limit :pageSize
      `,
      args: { userId, pageSize },
    });

    const cards = result.rows as unknown as Card[];
    return Response.json({ success: true, cards });
  },
});
