import { exists } from "$std/fs/mod.ts";

export async function getApiUrl(): Promise<string> {
  const isInsideDocker = await exists("/.dockerenv");
  const apiUrl = isInsideDocker
    ? "http://host.docker.internal:8765"
    : "http://localhost:8765";

  console.info("getApiUrl", { isInsideDocker, apiUrl });
  return apiUrl;
}

export async function healthCheck(): Promise<boolean> {
  const apiUrl = await getApiUrl();
  const response = await fetch(apiUrl);
  await response.text();
  const isConnected = response.status === 200;

  console.info("healthCheck", { isConnected });
  return isConnected;
}

export async function ankiConnectCallRpc(
  action: string,
  params: Record<string, any>,
): Promise<any> {
  const payload = {
    action,
    params,
    version: 6,
  };
  console.info("jsonRpcCall", { action });

  const apiUrl = await getApiUrl();
  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.result;
}
