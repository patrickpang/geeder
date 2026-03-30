import { define } from "../../utils.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";

interface Payload {
  cardIds: string[];
}

export const handler = define.handlers({
  async POST(ctx) {
    const userId = getUserIdFromRequest(ctx.req);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { cardIds } = await ctx.req.json() as Payload;
    const results = await ctx.state.turso.batch(
      cardIds.map((id) => ({
        sql: "delete from cards where id = :id",
        args: { id },
      })),
      "write",
    );
    const rowsDeleted = results.reduce((sum, r) => sum + r.rowsAffected, 0);

    return Response.json({ success: true, rowsDeleted });
  },
});
