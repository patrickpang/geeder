import { ankiConnectCallRpc } from "./anki_connect.ts";
import { Card } from "./model.ts";

export async function addCards(deck: string, cards: Card[]): Promise<void> {
  const notes = cards.map((card) => ({
    "deckName": deck,
    "modelName": "Basic",
    "fields": { "Front": card.question, "Back": card.answer },
    "tags": ["geeder"],
  }));
  console.info("addCards start");
  try {
    const result = await ankiConnectCallRpc("addNotes", { notes });
    console.info("addCards end", { result });
  } catch (error) {
    console.error("addCards error", { error });
  }
}
