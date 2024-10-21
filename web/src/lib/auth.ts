import type { APIEvent } from "@solidjs/start/server";
import { env } from "./cloudfare";

export function requireAuth(event: APIEvent) {
  const token = event.request.headers.get("Authorization")?.split(" ", 2)[1];
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (token !== env().GROQ_API_KEY) {
    // TODO: tokens table
    return new Response("Unauthorized", { status: 401 });
  }
}
