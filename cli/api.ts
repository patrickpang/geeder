import makeFetchCookie from "fetch-cookie";

export const baseUrl = "https://geeder.patrickpang.me";

export const fetchWithCookies = makeFetchCookie(fetch);
