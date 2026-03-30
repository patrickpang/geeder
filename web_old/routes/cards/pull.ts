import { FreshContext, Handlers } from "$fresh/server.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import { Card } from "../../lib/model.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers = {
  async GET(request: Request, context: FreshContext<State>) {
    const userId = getUserIdFromRequest(request);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const pageSize = parseInt(url.searchParams.get("page_size")!) || 10;

    const result = await context.state.turso.execute(
      {
        sql: `
          select id, question, answer
          from cards
          where user_id = :userId
          order by created_at
          limit :pageSize
        `,
        args: { userId, pageSize },
      },
    );

    const cards = (result.rows as object[]) as Card[];
    return Response.json({ success: true, cards });
  },
};
