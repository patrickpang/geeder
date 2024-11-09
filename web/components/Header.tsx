export default function Header() {
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
