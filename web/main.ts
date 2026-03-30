import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { getTursoClient } from "./lib/turso.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(async (ctx) => {
  ctx.state.turso = getTursoClient();
  return await ctx.next();
});

app.fsRoutes();
