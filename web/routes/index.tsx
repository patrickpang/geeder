import { RouteContext } from "$fresh/server.ts";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import ExcerptInput from "../islands/ExcerptInput.tsx";
import { getUsernameFromRequest } from "../lib/auth.ts";

export default async function Home(request: Request, _context: RouteContext) {
  // redirect to login page if not logged in
  const username = getUsernameFromRequest(request);
  if (username === null) {
    const headers = new Headers();
    headers.set("location", "/login");
    return new Response(null, {
      status: 303,
      headers,
    });
  }

  return (
    <main class="mx-16 lg:mx-64 mt-16">
      <Header />
      <ExcerptInput />
      <Footer />
    </main>
  );
}
