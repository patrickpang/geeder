import { Client } from "npm:@libsql/client/web";
import { FreshContext } from "$fresh/server.ts";
import { getTursoClient } from "../lib/turso.ts";

export interface State {
  turso: Client;
}

export function handler(
  _request: Request,
  context: FreshContext<State>,
) {
  context.state.turso = getTursoClient();
  return context.next();
}
