export default function SettingsPage() {
  return (
    <div
      className="ml-64 min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-page)" }}
    >
      <div className="text-center space-y-3">
        <p className="text-4xl">⚙️</p>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Account settings coming soon.
        </p>
      </div>
    </div>
  );
}
