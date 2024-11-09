import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import ExcerptInput from "../islands/ExcerptInput.tsx";

export default function Home() {
  return (
    <main class="mx-16 lg:mx-64 mt-16">
      <Header />
      <ExcerptInput />
      <Footer />
    </main>
  );
}
