import { getCasos } from "@/lib/airtable";

export const metadata = {
  title: "Auxiliares de la Justicia — HubLegal.com.do",
  description: "League table de conciliadores, verificadores y síndicos bajo la Ley 141-15.",
};

export default async function AuxiliaresPage() {
  const casos = await getCasos();

  // Extract conciliadores with their cases
  const conciliadoresMap = {};
  const verificadoresMap = {};

  casos.forEach((c) => {
    const conc = c["Conciliador"];
    if (conc && conc !== "—" && conc !== "N/A" && !conc.toLowerCase().includes("no designado") && !conc.toLowerCase().includes("pendiente") && conc.trim().length > 2) {
      if (!conciliadoresMap[conc]) conciliadoresMap[conc] = [];
      conciliadoresMap[conc].push(c["Nombre Deudor"]);
    }

    const verif = c["Verificador"];
    if (verif && verif !== "—" && verif !== "N/A" && !verif.toLowerCase().includes("no designado") && !verif.toLowerCase().includes("pendiente") && verif.trim().length > 2) {
      if (!verificadoresMap[verif]) verificadoresMap[verif] = [];
      verificadoresMap[verif].push(c["Nombre Deudor"]);
    }
  });

  const conciliadores = Object.entries(conciliadoresMap)
    .map(([name, cases]) => ({ name, cases: cases.length, caseNames: cases }))
    .sort((a, b) => b.cases - a.cases);

  const verificadores = Object.entries(verificadoresMap)
    .map(([name, cases]) => ({ name, cases: cases.length, caseNames: cases }))
    .sort((a, b) => b.cases - a.cases);

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: "#1a2b4a", margin: "0 0 6px 0" }}>
        League Table — Auxiliares de la Justicia
      </h2>
      <p style={{ color: "#8896ab", fontSize: 13, margin: "0 0 24px 0" }}>
        Conciliadores, verificadores y síndicos designados bajo la Ley 141-15
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Conciliadores */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#3b82f6", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 18px 0" }}>
            Conciliadores ({conciliadores.length})
          </h3>
          {conciliadores.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < conciliadores.length - 1 ? "1px solid #f0f2f5" : "none" }}>
              <div>
                <div style={{ color: "#1a2b4a", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "#a0aec0", fontSize: 10 }}>
                  {p.cases} caso{p.cases > 1 ? "s" : ""}: {p.caseNames.map((n) => n.split(",")[0]).join(", ")}
                </div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "#ecfdf5", color: "#047857", fontWeight: 600, border: "1px solid #a7f3d0", flexShrink: 0 }}>
                Activo
              </span>
            </div>
          ))}
          {conciliadores.length === 0 && (
            <div style={{ color: "#a0aec0", fontSize: 12 }}>No hay conciliadores registrados.</div>
          )}
        </div>

        {/* Verificadores */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 style={{ color: "#7c8a9e", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 18px 0" }}>
            Verificadores ({verificadores.length})
          </h3>
          {verificadores.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < verificadores.length - 1 ? "1px solid #f0f2f5" : "none" }}>
              <div>
                <div style={{ color: "#1a2b4a", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "#a0aec0", fontSize: 10 }}>
                  {p.cases} caso{p.cases > 1 ? "s" : ""}: {p.caseNames.map((n) => n.split(",")[0]).join(", ")}
                </div>
              </div>
            </div>
          ))}
          {verificadores.length === 0 && (
            <div style={{ color: "#a0aec0", fontSize: 12 }}>No hay verificadores registrados.</div>
          )}
        </div>
      </div>

      {/* Premium metrics CTA */}
      <div style={{ marginTop: 16, background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h3 style={{ color: "#2563eb", fontSize: 12, fontWeight: 700, margin: "0 0 8px 0" }}>🔒 Métricas Premium</h3>
        <p style={{ color: "#8896ab", fontSize: 12, margin: 0, lineHeight: 1.7 }}>
          Tasa de éxito, honorarios fijados, duración promedio de casos, y comparación entre auxiliares disponible con suscripción premium.
        </p>
      </div>
    </div>
  );
}
