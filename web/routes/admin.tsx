import { RouteContext } from "$fresh/server.ts";
import { State } from "./_middleware.ts";

export default async function Admin(
  _request: Request,
  context: RouteContext<void, State>,
) {
  context.data;
  const result = await context.state.turso.execute(
    "select sqlite_version() as sqlite_version",
  );
  const sqlite_version = result.rows[0]["sqlite_version"] as string;

  return (
    <main class="mx-16 lg:w-96 lg:mx-auto mt-16">
      <h1 class="font-bold text-xl mb-8">Admin</h1>
      <pre><code>{sqlite_version}</code></pre>
    </main>
  );
}
