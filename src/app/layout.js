import "./globals.css";

export const metadata = {
  title: "HubLegal.com.do — Observatorio de Insolvencia RD",
  description: "Dashboard de casos de reestructuración y liquidación bajo la Ley 141-15 de la República Dominicana.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px" }}>
          {children}
        </main>
        <footer style={{ textAlign: "center", padding: 20, color: "#b0bec5", fontSize: 11 }}>
          Base de datos actualizada al 2026 · Fuente: Observatorio de Insolvencia RD · © HubLegal.com.do
        </footer>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e9f0",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color: "#ffffff",
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            H
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 21, color: "#3b82f6", letterSpacing: -0.5 }}>Hub</span>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 21, color: "#7c8a9e", letterSpacing: -0.5 }}>Legal</span>
            <span style={{ fontSize: 10, color: "#a0aec0", marginLeft: 6, fontWeight: 600, letterSpacing: 0.8 }}>.COM.DO</span>
          </div>
        </a>

        <nav style={{ display: "flex", gap: 4 }}>
          {[
            { href: "/", label: "Dashboard", icon: "◈" },
            { href: "/casos", label: "Casos", icon: "◇" },
            { href: "/precedentes", label: "Precedentes", icon: "§" },
            { href: "/auxiliares", label: "Auxiliares", icon: "⊕" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                background: "transparent",
                border: "1px solid transparent",
                color: "#8896ab",
                padding: "7px 18px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ marginRight: 6, fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#a0aec0", fontWeight: 600, letterSpacing: 0.5 }}>LEY 141-15</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
        </div>
      </div>
    </header>
  );
}
