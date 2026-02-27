"use client";
import { useState, useMemo } from "react";

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

export default function CasosClient({ casos }) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const sectors = useMemo(() => ["Todos", ...new Set(casos.map((c) => c.sector).filter(Boolean))], [casos]);
  const statuses = ["Todos", "Plan Homologado", "En Proceso", "Admitido", "Liquidación", "Desestimada", "Desistimiento"];

  const filtered = useMemo(() => {
    return casos.filter((c) => {
      const matchSearch = !search || c.nombre.toLowerCase().includes(search.toLowerCase()) || c.expediente.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === "Todos" || c.sector === sectorFilter;
      const matchStatus = statusFilter === "Todos" || getStatusLabel(c.estado) === statusFilter;
      return matchSearch && matchSector && matchStatus;
    });
  }, [casos, search, sectorFilter, statusFilter]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: "#1a2b4a", margin: 0 }}>Casos — Ley 141-15</h2>
        <span style={{ color: "#a0aec0", fontSize: 12 }}>{filtered.length} de {casos.length} casos</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input type="text" placeholder="Buscar por nombre o expediente..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 250, background: "#ffffff", border: "1px solid #d0d9e6", borderRadius: 10, padding: "10px 16px", color: "#2d3748", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
        />
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
          style={{ background: "#ffffff", border: "1px solid #d0d9e6", borderRadius: 10, padding: "10px 16px", color: "#64748b", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {sectors.map((s) => <option key={s} value={s}>{s === "Todos" ? "Todos los sectores" : s}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "#ffffff", border: "1px solid #d0d9e6", borderRadius: 10, padding: "10px 16px", color: "#64748b", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {statuses.map((s) => <option key={s} value={s}>{s === "Todos" ? "Todos los estados" : s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eef1f6" }}>
                {["Deudor", "Expediente", "Sector", "Estado", "Fecha", "Tribunal", "Juez", "Solicitante"].map((h) => (
                  <th key={h} style={{ padding: "13px 14px", textAlign: "left", color: "#8896ab", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", background: "#fafbfc" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = getStatusColor(c.estado);
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f0f2f5", cursor: "pointer" }}
                    onClick={() => window.location.href = `/caso/${c.id}`}>
                    <td style={{ padding: "13px 14px", fontWeight: 600, color: "#1a2b4a", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nombre}</td>
                    <td style={{ padding: "13px 14px", color: "#94a3b8", fontFamily: "monospace", fontSize: 10 }}>{c.expediente}</td>
                    <td style={{ padding: "13px 14px", color: "#64748b" }}>{c.sector}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.text, fontWeight: 600, whiteSpace: "nowrap", border: `1px solid ${sc.border}` }}>{getStatusLabel(c.estado)}</span>
                    </td>
                    <td style={{ padding: "13px 14px", color: "#94a3b8", whiteSpace: "nowrap" }}>{c.fechaSolicitud}</td>
                    <td style={{ padding: "13px 14px", color: "#64748b", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.tribunal}</td>
                    <td style={{ padding: "13px 14px", color: "#64748b", whiteSpace: "nowrap" }}>{c.juez}</td>
                    <td style={{ padding: "13px 14px" }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: c.solicitante === "Deudor" ? "#eff6ff" : "#fef9f0", color: c.solicitante === "Deudor" ? "#2563eb" : "#92630d", border: `1px solid ${c.solicitante === "Deudor" ? "#bfdbfe" : "#e8d5b0"}` }}>{c.solicitante}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
