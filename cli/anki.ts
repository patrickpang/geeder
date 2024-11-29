import { ankiConnectCallRpc } from "./anki_connect.ts";
import { Card } from "./model.ts";

export async function addCard(
  deck: string,
  card: Card,
): Promise<string | null> {
  const note = {
    "deckName": deck,
    "modelName": "Basic",
    "fields": { "Front": card.question, "Back": card.answer },
    "tags": ["geeder"],
  };
  console.info("addCard start");
  const id = card.id;
  try {
    const result = await ankiConnectCallRpc("addNotes", { notes: [note] });
    console.info("addCards end", { id, result });
    return id;
  } catch (error) {
    console.error("addCards error", { id, error });
    return null;
  }
}

export async function addCards(
  deck: string,
  cards: Card[],
): Promise<string[] | null> {
  const notes = cards.map((card) => ({
    "deckName": deck,
    "modelName": "Basic",
    "fields": { "Front": card.question, "Back": card.answer },
    "tags": ["geeder"],
  }));
  console.info("addCards start");
  const cardIds = cards.map((card) => card.id);
  try {
    const result = await ankiConnectCallRpc("addNotes", { notes });
    console.info("addCards end", { result });
    return cardIds;
  } catch (_error) {
    const errorDetails = await ankiConnectCallRpc(
      "canAddNotesWithErrorDetail",
      { notes },
    );
    console.error("addCards error", { notes, errorDetails });

    const hasUnknownErrors = errorDetails.some((errorDetail) =>
      !errorDetail.canAdd &&
      errorDetail.error !== "cannot create note because it is a duplicate"
    );
    if (hasUnknownErrors) {
      console.error("addCards error not due to duplicates");
      return null;
    }

    const validCards = cards.filter((_card, i) => errorDetails[i].canAdd);
    await addCards(deck, validCards);
    return cardIds; // delete all, including error cards
  }
}
