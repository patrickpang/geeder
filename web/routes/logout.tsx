import { define } from "../utils.ts";
import { deleteTokenCookie } from "../lib/auth.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const headers = new Headers();
    deleteTokenCookie(ctx.req, headers);
    const resp = await ctx.render();
    headers.forEach((value, key) => resp.headers.append(key, value));
    return resp;
  },
});

export default define.page(function Logout() {
  return (
    <main class="mx-16 lg:w-96 lg:mx-auto mt-16">
      <h1 class="font-bold text-xl mb-8">See you!</h1>
      <p>Logged out successfully.</p>
      <p>See you next time.</p>
    </main>
  );
});
