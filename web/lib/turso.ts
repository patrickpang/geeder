import { createClient } from "@libsql/client";

export const getTursoClient = () =>
  createClient({
    url: Deno.env.get("TURSO_DATABASE_URL")!,
    authToken: Deno.env.get("TURSO_AUTH_TOKEN")!,
  });
