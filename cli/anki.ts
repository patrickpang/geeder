import { ankiConnectCallRpc } from "./anki_connect.ts";

export async function addCard(
  deck: string,
  question: string,
  answer: string,
): Promise<void> {
  const note = {
    "deckName": deck,
    "modelName": "Basic",
    "fields": { "Front": question, "Back": answer },
    "tags": ["geeder"],
  };
  console.info("addCard start");
  const result = await ankiConnectCallRpc("addNotes", { notes: [note] });
  console.info("addCard end", { result });
}
