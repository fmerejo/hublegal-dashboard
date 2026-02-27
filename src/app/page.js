import { getStats } from "@/lib/airtable";

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: "#1a2b4a", margin: "0 0 4px 0", letterSpacing: -0.5 }}>
          Observatorio de Insolvencia — República Dominicana
        </h1>
        <p style={{ color: "#8896ab", fontSize: 13, margin: "0 0 20px 0" }}>
          Ley 141-15 sobre Reestructuración y Liquidación de Empresas y Personas Físicas Comerciantes
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard label="Casos Catalogados" value={stats.totalCases} sub={`${stats.totalCases} con resoluciones analizadas`} icon="⬡" />
        <StatCard label="Auxiliares Registrados" value={stats.totalAuxiliares} sub="Conciliadores, verificadores y síndicos" icon="⊕" />
        <StatCard label="Eventos Procesales" value={stats.totalEvents} sub="Seguimiento cronológico detallado" icon="◈" />
        <StatCard label="Tribunales Especializados" value={stats.totalTribunales} sub="9na y 10ma Sala D.N. · 7ma Santiago" icon="⚖" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <Card title="Resultados de Procesos">
          <OutcomeDonut data={stats.outcomes} />
        </Card>
        <Card title="Casos por Año">
          <YearChart data={stats.years} />
        </Card>
        <Card title="Casos por Sector">
          <MiniBar data={stats.sectors} maxVal={Math.max(...Object.values(stats.sectors))} color="#3b82f6" />
        </Card>
      </div>

      {/* Judges + Recent Cases */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <Card title="Jueces Especializados">
          <MiniBar data={stats.judges} maxVal={Math.max(...Object.values(stats.judges))} color="#3b82f6" />
          <div style={{ marginTop: 18, padding: "14px 0 0 0", borderTop: "1px solid #e5e9f0" }}>
            <div style={{ color: "#8896ab", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Tribunales</div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>9na Sala D.N. · 10ma Sala D.N. · 7ma Sala Santiago</div>
          </div>
        </Card>
        <Card title="Casos Destacados">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stats.casos.slice(0, 8).map((c, i) => {
              const sc = getStatusColor(c["Estado"] || "");
              return (
                <a
                  key={i}
                  href={`/caso/${c.id}`}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#fafbfc", border: "1px solid transparent", textDecoration: "none" }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2b4a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c["Nombre Deudor"]}</div>
                    <div style={{ fontSize: 10, color: "#a0aec0" }}>{c["Sector"]} · {c["Tribunal"]}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.text, fontWeight: 600, flexShrink: 0, border: `1px solid ${sc.border}` }}>
                    {getStatusLabel(c["Estado"] || "")}
                  </span>
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── Helper Components ────────────────────────────────────── */

function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: "22px 26px", flex: 1, minWidth: 180, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20, opacity: 0.7 }}>{icon}</span>
        <span style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3 }}>{label}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, color: "#1a2b4a", fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: "#a0aec0", fontSize: 11.5, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <h3 style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 16px 0" }}>{title}</h3>
      {children}
    </div>
  );
}

function MiniBar({ data, maxVal, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {Object.entries(data).map(([key, val]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#64748b", fontSize: 11, width: 100, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{key}</span>
          <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 5, height: 20, overflow: "hidden", position: "relative" }}>
            <div style={{ width: `${(val / maxVal) * 100}%`, background: `linear-gradient(90deg, ${color}33, ${color})`, height: "100%", borderRadius: 5 }} />
            <span style={{ position: "absolute", right: 8, top: 2, fontSize: 10, color: "#475569", fontWeight: 700 }}>{val}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function YearChart({ data }) {
  const max = Math.max(...Object.values(data));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {Object.entries(data).map(([year, count]) => (
        <div key={year} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, marginBottom: 4 }}>{count}</span>
          <div style={{ width: "100%", maxWidth: 32, height: `${(count / max) * 80}px`, minHeight: 4, background: "linear-gradient(180deg, #60a5fa, #3b82f6)", borderRadius: "6px 6px 2px 2px" }} />
          <span style={{ fontSize: 9, color: "#94a3b8", marginTop: 5, fontWeight: 600 }}>{year.replace("20", "'")}</span>
        </div>
      ))}
    </div>
  );
}

function OutcomeDonut({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const colors = ["#b8860b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#94a3b8"];
  let cumPercent = 0;
  const segments = Object.entries(data).map(([key, val], i) => {
    const percent = (val / total) * 100;
    const offset = cumPercent;
    cumPercent += percent;
    return { key, val, percent, offset, color: colors[i % colors.length] };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg viewBox="0 0 42 42" style={{ width: 110, height: 110, flexShrink: 0 }}>
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="6" />
        {segments.map((seg, i) => (
          <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={seg.color} strokeWidth="6"
            strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
            strokeDashoffset={-seg.offset + 25} strokeLinecap="butt" />
        ))}
        <text x="21" y="20" textAnchor="middle" fill="#1a2b4a" fontSize="8" fontWeight="700" fontFamily="'DM Serif Display', Georgia, serif">{total}</text>
        <text x="21" y="26" textAnchor="middle" fill="#94a3b8" fontSize="3.5">casos</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {segments.map((seg) => (
          <div key={seg.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: "#64748b" }}>{seg.key}</span>
            <span style={{ fontSize: 10.5, color: "#1a2b4a", fontWeight: 700, marginLeft: "auto" }}>{seg.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Status helpers ────────────────────────────────────── */

function getStatusColor(estado) {
  const e = (estado || "").toLowerCase();
  if (e.includes("homologad")) return { bg: "#ecfdf5", text: "#047857", dot: "#10b981", border: "#a7f3d0" };
  if (e.includes("reestructuración") || e.includes("conciliación") || e.includes("verificación") || e.includes("admisión")) return { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6", border: "#bfdbfe" };
  if (e.includes("liquidación")) return { bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444", border: "#fecaca" };
  if (e.includes("desestimada") || e.includes("inadmisible") || e.includes("irrecibible")) return { bg: "#f8f5f0", text: "#92630d", dot: "#b8860b", border: "#e8d5b0" };
  if (e.includes("desistimiento") || e.includes("archivado")) return { bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6", border: "#ddd6fe" };
  return { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8", border: "#e2e8f0" };
}

function getStatusLabel(estado) {
  const e = (estado || "").toLowerCase();
  if (e.includes("homologad")) return "Plan Homologado";
  if (e.includes("reestructuración") || e.includes("conciliación") || e.includes("verificación")) return "En Proceso";
  if (e.includes("admisión")) return "Admitido";
  if (e.includes("liquidación")) return "Liquidación";
  if (e.includes("desestimada") || e.includes("inadmisible") || e.includes("irrecibible")) return "Desestimada";
  if (e.includes("desistimiento") || e.includes("archivado")) return "Desistimiento";
  return estado ? estado.slice(0, 20) : "—";
}
