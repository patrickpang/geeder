import { load as dotenv } from "$std/dotenv/mod.ts";
import { login } from "./auth.ts";
import { pullCards } from "./cards.ts";

console.info("Geeder command line");

await dotenv({ export: true });
console.info("dotenv success");

const response = await login({
  username: "dudu",
  password: Deno.env.get("DUMMY_PASSWORD")!,
});
if (!response) Deno.exit(1);
console.info("login success");

const cards = await pullCards();
console.info({ cards });
