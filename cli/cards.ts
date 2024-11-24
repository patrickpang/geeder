import { baseUrl, fetchWithCookies } from "./api.ts";
import { Card } from "./model.ts";

interface PullCardsResponse {
  success: boolean;
  cards: Card[];
}

interface DeleteCardsResponse {
  success: boolean;
  rowsDeleted: number;
}

export async function pullCards(): Promise<Card[] | null> {
  try {
    console.info("pullCards start");
    const response = await fetchWithCookies(baseUrl + "/cards/pull", {
      credentials: "same-origin",
    });
    if (!response.ok) {
      console.error({
        statusCode: response.status,
        error: await response.text(),
      });
      return null;
    }

    const { cards } = (await response.json()) as PullCardsResponse;
    console.info("pullCards end", { cards });
    return cards;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

export async function deleteCards(cardIds: string[]): Promise<number | null> {
  try {
    console.info("deleteCards start");
    const response = await fetchWithCookies(baseUrl + "/cards/delete", {
      method: "POST",
      body: JSON.stringify({ cardIds }),
      credentials: "same-origin",
    });
    if (!response.ok) {
      console.error({
        statusCode: response.status,
        error: await response.text(),
      });
      return null;
    }

    const { rowsDeleted } = (await response.json()) as DeleteCardsResponse;
    console.info("pullCards end", { rowsDeleted });
    return rowsDeleted;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
