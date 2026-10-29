export default function Splash({ text = "Cargando…" }: { text?: string }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Cuaderno de Cuadra
        </div>
        <div style={{ color: "var(--ink-3)", marginTop: 8, fontSize: ".9rem" }}>{text}</div>
      </div>
    </div>
  );
}
