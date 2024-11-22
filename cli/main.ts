import { load as dotenv } from "$std/dotenv/mod.ts";
import { addCard } from "./anki.ts";
import { healthCheck } from "./anki_connect.ts";
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
if (!cards) Deno.exit(1);

const isConnected = await healthCheck();
if (!isConnected) Deno.exit(1);

for (const card of cards) {
  await addCard("Default", card.question, card.answer);
}
