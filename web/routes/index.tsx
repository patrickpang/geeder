function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center mb-2">
        <img
          src="/android-chrome-512x512.png"
          alt="Geeder"
          className="w-12 mr-2"
        />
        <h1 className="text-4xl font-bold">Geeder</h1>
      </div>
      <p>Your study copilot with Anki cards</p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 mb-16 flex justify-between items-center">
      <p className="text-sm">Made with ❤️ by Patrick</p>
      <p className="text-sm">Version: 2024.11.09</p>
    </footer>
  );
}

export default function Home() {
  return (
    <div class="mx-16 lg:mx-64 mt-16">
      <Header />
      <Footer />
    </div>
  );
}
