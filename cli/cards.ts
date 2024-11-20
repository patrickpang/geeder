import { baseUrl, fetchWithCookies } from "./api.ts";
import { Card } from "./model.ts";

interface PullCardsResponse {
  success: boolean;
  cards: Card[];
}

export async function pullCards(): Promise<Card[] | null> {
  try {
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
    return cards;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
