import { getCasoById, getTimeline, getPrecedentes } from "@/lib/airtable";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const caso = await getCasoById(params.id);
  if (!caso) return { title: "Caso no encontrado" };
  return {
    title: `${caso["Nombre Deudor"]} — HubLegal.com.do`,
    description: `Caso de reestructuración: ${caso["Nombre Deudor"]} — Exp. ${caso["No. Expediente"]}`,
  };
}

export default async function CasoPage({ params }) {
  const caso = await getCasoById(params.id);
  if (!caso) notFound();

  const timeline = await getTimeline(caso["No. Expediente"]);

  // Get precedentes that reference this case
  const allPrecedentes = await getPrecedentes();
  const casoPrecedentes = allPrecedentes.filter((p) => {
    const caseName = (p["Caso"] || "").toLowerCase();
    const deudor = (caso["Nombre Deudor"] || "").toLowerCase();
    return caseName.includes(deudor.split(",")[0].split("(")[0].trim().toLowerCase());
  });

  const estado = caso["Estado"] || "";
  const sc = getStatusColor(estado);

  return (
    <div>
      {/* Back button */}
      <a href="/casos" style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 16 }}>
        ← Volver a lista de casos
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Main info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Header card */}
          <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#1a2b4a", margin: "0 0 6px 0" }}>
                  {caso["Nombre Deudor"]}
                </h1>
                <span style={{ color: "#a0aec0", fontSize: 12, fontFamily: "monospace" }}>
                  Exp. {caso["No. Expediente"]}
                </span>
              </div>
              <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {getStatusLabel(estado)}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="Sector" value={caso["Sector"]} />
              <Field label="Tipo" value={caso["Solicitante"] === "Deudor" ? "Solicitud del Deudor" : "Solicitud de Acreedor"} />
              <Field label="Tribunal" value={caso["Tribunal"]} />
              <Field label="Juez" value={caso["Juez"]} />
              <Field label="Conciliador" value={caso["Conciliador"]} />
              <Field label="Verificador" value={caso["Verificador"]} />
              <Field label="Fecha Solicitud" value={caso["Fecha Solicitud"]} />
              <Field label="Fecha Admisión" value={caso["Fecha Admisión"]} />
              <Field label="Pasivo Total Declarado" value={caso["Pasivo Total Declarado"]} />
              <Field label="No. Acreedores" value={caso["No. Acreedores"]} />
              <Field label="Presidente/Representante" value={caso["Presidente/Representante"]} />
              <Field label="Abogado Deudor" value={caso["Abogado Deudor"]} />
              <Field label="Artículos Interpretados" value={caso["Artículos Interpretados"]} span={2} />
            </div>
          </div>

          {/* Resumen del Caso */}
          {caso["Resumen"] && (
            <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ color: "#1a2b4a", fontSize: 16, fontFamily: "'DM Serif Display', Georgia, serif", margin: "0 0 14px 0" }}>
                Resumen del Caso
              </h3>
              <div style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {caso["Resumen"]}
              </div>
            </div>
          )}

          {/* Precedentes del caso */}
          {casoPrecedentes.length > 0 && (
            <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 16px 0" }}>
                Precedentes Identificados ({casoPrecedentes.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {casoPrecedentes.map((p, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "#fafbfc", borderRadius: 10, border: "1px solid #f0f2f5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, fontFamily: "monospace" }}>{p["Código"]}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a2b4a" }}>{p["Título"]}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                      {(p["Regla"] || "").slice(0, 200)}{(p["Regla"] || "").length > 200 ? "..." : ""}
                    </div>
                    {p["Artículos"] && (
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>
                        {p["Artículos"]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Timeline */}
          <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h4 style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px 0" }}>
              Timeline Procesal {timeline.length > 0 ? `(${timeline.length})` : ""}
            </h4>
            {timeline.length > 0 ? (
              <div style={{ borderLeft: "2px solid #e5e9f0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                {timeline.slice(0, 15).map((e, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute", left: -23, top: 4, width: 8, height: 8, borderRadius: "50%",
                      background: e["Hito"] ? "#3b82f6" : "#d0d9e6", border: "2px solid #ffffff"
                    }} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{e["Fecha Evento"]}</div>
                    <div style={{ fontSize: 12, fontWeight: e["Hito"] ? 700 : 500, color: e["Hito"] ? "#1a2b4a" : "#64748b" }}>
                      {e["Evento"] || e["Descripción"] || "Evento"}
                    </div>
                  </div>
                ))}
                {timeline.length > 15 && (
                  <div style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>
                    + {timeline.length - 15} eventos más
                  </div>
                )}
              </div>
            ) : (
              <div style={{ borderLeft: "2px solid #e5e9f0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                {["Solicitud", "Admisión", "Verificación", "Conciliación"].map((step, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: -23, top: 4, width: 8, height: 8, borderRadius: "50%", background: i < 1 ? "#3b82f6" : "#d0d9e6", border: "2px solid #ffffff" }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: i < 1 ? "#3b82f6" : "#a0aec0" }}>{step}</div>
                    <div style={{ fontSize: 11, color: "#a0aec0" }}>Fase procesal</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Case metadata */}
          <div style={{ background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h4 style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px 0" }}>
              Datos Registrales
            </h4>
            <Field label="RNC/Cédula" value={caso["RNC/Cédula"]} />
            <div style={{ height: 10 }} />
            <Field label="Registro Mercantil" value={caso["Registro Mercantil"]} />
            <div style={{ height: 10 }} />
            <Field label="Tipo Persona" value={caso["Tipo Persona"]} />
            <div style={{ height: 10 }} />
            <Field label="Domicilio" value={caso["Domicilio"]} />
          </div>

          {/* Premium CTA */}
          <div style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h4 style={{ color: "#3b82f6", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px 0" }}>
              🔒 Datos Premium
            </h4>
            <p style={{ color: "#8896ab", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
              Datos financieros completos, análisis de ratios, texto completo de resoluciones e índices cruzados disponibles con suscripción.
            </p>
            <button style={{
              marginTop: 14, background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none",
              color: "#ffffff", padding: "9px 22px", borderRadius: 9, fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(59,130,246,0.3)"
            }}>
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function Field({ label, value, span }) {
  return (
    <div style={span === 2 ? { gridColumn: "1 / -1" } : {}}>
      <div style={{ color: "#8896ab", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{label}</div>
      <div style={{ color: "#2d3748", fontSize: 14, fontWeight: 500 }}>{value || "—"}</div>
    </div>
  );
}

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
