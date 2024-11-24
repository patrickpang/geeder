import { load as dotenv } from "$std/dotenv/mod.ts";
import { addCards } from "./anki.ts";
import { healthCheck } from "./anki_connect.ts";
import { login } from "./auth.ts";
import { deleteCards, pullCards } from "./cards.ts";

console.info("Geeder command line");

await dotenv({ export: true });
console.info("dotenv success");

const isConnected = await healthCheck();
if (!isConnected) Deno.exit(1);

const response = await login({
  username: "dudu",
  password: Deno.env.get("DUMMY_PASSWORD")!,
});
if (!response) Deno.exit(1);
console.info("login success");

while (true) {
  const cards = await pullCards();
  if (!cards) Deno.exit(1);
  if (cards.length === 0) {
    console.info("sync complete");
    Deno.exit(0);
  }

  await addCards("Default", cards);
  await deleteCards(cards.map((card) => card.id));
}
