import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "$std/http/cookie.ts";

const TOKEN_KEY = "token";

function getUsernameFromToken(token: string): string | null {
  // TODO: tokens table
  if (token === Deno.env.get("DUMMY_API_TOKEN")!) {
    return "dudu";
  }

  return null;
}

export function getUsernameFromRequest(request: Request): string | null {
  const cookies = getCookies(request.headers);
  const token = cookies["token"];
  if (!token) {
    return null;
  }

  const username = getUsernameFromToken(token);
  if (username === null) {
    return null;
  }

  return username;
}

export function checkCredentials(
  username: string,
  password: string,
): boolean {
  // TODO: users table
  if (username === "dudu" && password === Deno.env.get("DUMMY_PASSWORD")!) {
    return true;
  }

  return false;
}

export function generateToken(username: string): string {
  // TODO: tokens table
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
    maxAge: 34560000, // 400 days, max Chrome allows
    sameSite: "Strict",
    domain: url.hostname,
    secure: true,
    httpOnly: true,
    path: "/", // for ajax requests to work
  };
  setCookie(headers, cookie);
}

export function clearTokenInCookies(
  request: Request,
  response: Response,
): void {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);

  deleteCookie(headers, TOKEN_KEY, {
    domain: url.hostname,
    path: "/",
  });

  response.headers.set("set-cookie", headers.get("set-cookie")!);
}
