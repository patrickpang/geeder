import { FreshContext, Handlers } from "$fresh/server.ts";
import { clearTokenInCookies } from "../lib/auth.ts";

export const handler: Handlers = {
  async GET(request: Request, ctx: FreshContext) {
    const response = await ctx.render();
    clearTokenInCookies(request, response);
    return response;
  },
};

export default function Logout() {
  return (
    <main class="mx-16 lg:w-96 lg:mx-auto mt-16">
      <h1 class="font-bold text-xl mb-8">See you!</h1>
      <p>Logged out successfully.</p>
      <p>See you next time.</p>
    </main>
  );
}
