import {
  type Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "jsr:@std/http/cookie";

const TOKEN_KEY = "token";

function getUserIdFromToken(token: string): string | null {
  if (token === Deno.env.get("DUMMY_API_TOKEN")!) {
    return "dudu";
  }
  return null;
}

export function getUserIdFromRequest(request: Request): string | null {
  const cookies = getCookies(request.headers);
  const token = cookies["token"];
  if (!token) return null;
  return getUserIdFromToken(token);
}

export function checkCredentials(username: string, password: string): boolean {
  return username === "dudu" && password === Deno.env.get("DUMMY_PASSWORD")!;
}

export function generateToken(_userId: string): string {
  return Deno.env.get("DUMMY_API_TOKEN")!;
}

export function setTokenInCookies(
  request: Request,
  headers: Headers,
  token: string,
): void {
  const url = new URL(request.url);
  const cookie: Cookie = {
    name: TOKEN_KEY,
    value: token,
    maxAge: 34560000,
    sameSite: "Strict",
    domain: url.hostname,
    secure: true,
    httpOnly: true,
    path: "/",
  };
  setCookie(headers, cookie);
}

export function deleteTokenCookie(request: Request, headers: Headers): void {
  const url = new URL(request.url);
  deleteCookie(headers, TOKEN_KEY, { domain: url.hostname, path: "/" });
}
