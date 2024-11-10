import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  checkCredentials,
  generateToken,
  getUsernameFromRequest,
  setTokenInCookies,
} from "../../lib/auth.ts";

export const handler: Handlers = {
  async POST(request: Request, _context: FreshContext) {
    // already logged in
    const existingUsername = getUsernameFromRequest(request);
    console.log({ existingUsername });
    if (existingUsername !== null) {
      return Response.json({ success: true, message: "Already logged in" });
    }

    // check credentials
    const { username, password } = await request.json();
    const isCorrectCredentials = checkCredentials(username, password);
    if (!isCorrectCredentials) {
      return Response.json({ success: false, message: "Wrong credentials" });
    }

    // set cookies
    const token = generateToken(username);
    const headers = new Headers();
    setTokenInCookies(request, headers, token);
    return Response.json({ success: true, message: "Logged in successfully" }, {
      headers,
    });
  },
};
