import { useSignal } from "@preact/signals";
import { define } from "../utils.ts";
import { getUserIdFromRequest } from "../lib/auth.ts";
import { generateEmptyCard, type Card } from "../lib/model.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import ExcerptInput from "../islands/ExcerptInput.tsx";
import CardsEditor from "../islands/CardsEditor.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const userId = getUserIdFromRequest(ctx.req);
    if (!userId) {
      return new Response(null, {
        status: 303,
        headers: { location: "/login" },
      });
    }
    return ctx.render();
  },
});

export default define.page(function Home() {
  const cardsSignal = useSignal<Card[]>([]);
  const customCardSignal = useSignal<Card>(generateEmptyCard());

  return (
    <main class="mx-16 lg:mx-64 mt-16">
      <Header />
      <ExcerptInput cardsSignal={cardsSignal} customCardSignal={customCardSignal} />
      <CardsEditor cardsSignal={cardsSignal} customCardSignal={customCardSignal} />
      <Footer />
    </main>
  );
});
