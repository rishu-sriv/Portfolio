export default function Home() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="glass rounded-window p-8 text-center space-y-2 shadow-window">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          macOS Portfolio
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Phase 1 complete — foundation ready.
        </p>
      </div>
    </main>
  );
}
