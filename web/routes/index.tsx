import { FreshContext, Handlers } from "$fresh/server.ts";
import { Signal, useSignal } from "@preact/signals";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import CardsEditor from "../islands/CardsEditor.tsx";
import ExcerptInput from "../islands/ExcerptInput.tsx";
import { getUserIdFromRequest } from "../lib/auth.ts";
import { Card, generateEmptyCard } from "../lib/model.ts";

export const handler: Handlers = {
  async GET(request: Request, context: FreshContext) {
    // redirect to login page if not logged in
    const userId = getUserIdFromRequest(request);
    if (userId === null) {
      const headers = new Headers();
      headers.set("location", "/login");
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    // show home page if logged in
    const response = await context.render();
    return response;
  },
};

export default function Home() {
  const cardsSignal: Signal<Card[]> = useSignal([]);
  const customCardSignal = useSignal<Card>(generateEmptyCard());

  return (
    <main class="mx-16 lg:mx-64 mt-16">
      <Header />
      <ExcerptInput
        cardsSignal={cardsSignal}
        customCardSignal={customCardSignal}
      />
      <CardsEditor
        cardsSignal={cardsSignal}
        customCardSignal={customCardSignal}
      />
      <Footer />
    </main>
  );
}
