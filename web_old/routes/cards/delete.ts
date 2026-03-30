import { FreshContext, Handlers } from "$fresh/server.ts";
import { getUserIdFromRequest } from "../../lib/auth.ts";
import { State } from "../_middleware.ts";

interface Payload {
  cardIds: string[];
}

export const handler: Handlers = {
  async POST(request: Request, context: FreshContext<State>) {
    const userId = getUserIdFromRequest(request);
    if (userId === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { cardIds } = await request.json() as Payload;
    const results = await context.state.turso.batch(
      cardIds.map((id) => ({
        sql: "delete from cards where id = :id",
        args: { id },
      })),
      "write",
    );
    const rowsDeleted = results.map((result) => result.rowsAffected).reduce(
      (a, b) => a + b,
      0,
    );

    return Response.json({
      success: true,
      rowsDeleted,
    });
  },
};
