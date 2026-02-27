"use client";
import { useState, useMemo } from "react";

export default function PrecedentesClient({ categories, total }) {
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (p) =>
            p.codigo.toLowerCase().includes(q) ||
            p.titulo.toLowerCase().includes(q) ||
            p.caso.toLowerCase().includes(q) ||
            p.regla.toLowerCase().includes(q) ||
            p.articulos.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, search]);

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: "#1a2b4a", margin: "0 0 6px 0" }}>
        Índice de Precedentes — Ley 141-15
      </h2>
      <p style={{ color: "#8896ab", fontSize: 13, margin: "0 0 20px 0" }}>
        {total} precedentes organizados en {categories.length} categorías temáticas con índices cruzados
      </p>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text" placeholder="Buscar por código, título, caso, artículo o regla..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: 500, background: "#ffffff", border: "1px solid #d0d9e6", borderRadius: 10, padding: "10px 16px", color: "#2d3748", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
        />
        {search && (
          <span style={{ marginLeft: 12, color: "#94a3b8", fontSize: 12 }}>
            {totalFiltered} resultado{totalFiltered !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {filteredCategories.map((cat, i) => (
          <div key={i}>
            <div
              onClick={() => setExpandedCat(expandedCat === i ? null : i)}
              style={{
                background: "#ffffff", border: expandedCat === i ? "1px solid #93c5fd" : "1px solid #e5e9f0",
                borderRadius: 12, padding: 18, cursor: "pointer",
                boxShadow: expandedCat === i ? "0 2px 8px rgba(59,130,246,0.08)" : "0 1px 3px rgba(0,0,0,0.03)",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ color: "#1a2b4a", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                    {cat.name.replace(/^[IVXLCDM]+\.\s*/, "")}
                  </h4>
                </div>
                <span style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 11px", borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0, border: "1px solid #bfdbfe", marginLeft: 8 }}>
                  {cat.count}
                </span>
              </div>
            </div>

            {/* Expanded precedent list */}
            {expandedCat === i && (
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                {cat.items.map((p, j) => (
                  <div key={j} style={{ background: "#ffffff", border: "1px solid #f0f2f5", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, fontFamily: "monospace", flexShrink: 0 }}>{p.codigo}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a2b4a" }}>{p.titulo}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                      <strong>Caso:</strong> {p.caso} {p.fecha && `(${p.fecha})`}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
                      {p.regla.slice(0, 250)}{p.regla.length > 250 ? "..." : ""}
                    </div>
                    {p.articulos && (
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{p.articulos}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-index links */}
      <div style={{ marginTop: 24, background: "#ffffff", border: "1px solid #e5e9f0", borderRadius: 14, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h3 style={{ color: "#8896ab", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 14px 0" }}>
          Índices Cruzados Disponibles
        </h3>
        <div style={{ display: "flex", gap: 16 }}>
          {["Por Artículo de Ley", "Por Juez", "Por Tema"].map((idx) => (
            <div key={idx} style={{ flex: 1, background: "#f8fafc", border: "1px solid #e5e9f0", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ color: "#2563eb", fontSize: 13, fontWeight: 700 }}>{idx}</div>
              <div style={{ color: "#a0aec0", fontSize: 10, marginTop: 4 }}>Búsqueda transversal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
