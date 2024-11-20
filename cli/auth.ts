import { baseUrl, fetchWithCookies } from "./api.ts";

// TODO: extract this into client SDK and use the same in web UI

interface Payload {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

export async function login(payload: Payload): Promise<LoginResponse | null> {
  try {
    const response = await fetchWithCookies(baseUrl + "/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });
    if (!response.ok) {
      console.error({
        statusCode: response.status,
        error: await response.text(),
      });
      return null;
    }

    const data = (await response.json()) as LoginResponse;
    return data;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
