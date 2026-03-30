import { define } from "../../utils.ts";
import {
  checkCredentials,
  generateToken,
  getUserIdFromRequest,
  setTokenInCookies,
} from "../../lib/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const userId = getUserIdFromRequest(ctx.req);
    if (userId !== null) {
      return Response.json({ success: true, message: "Already logged in" });
    }

    const { username, password } = await ctx.req.json();
    const isCorrect = checkCredentials(username, password);
    if (!isCorrect) {
      return Response.json({ success: false, message: "Wrong credentials" });
    }

    const token = generateToken(username);
    const headers = new Headers();
    setTokenInCookies(ctx.req, headers, token);
    return Response.json(
      { success: true, message: "Logged in successfully" },
      { headers },
    );
  },
});
