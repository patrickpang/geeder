import type { APIEvent } from "@solidjs/start/server";
import { env } from "~/lib/cloudfare";

export async function GET({ request }: APIEvent) {
  console.log(env().GROQ_API_KEY);
  const token = request.headers.get("Authorization")?.split(" ", 2)[1];
  console.log({ token });
  return {};
}
