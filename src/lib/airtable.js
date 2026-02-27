const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function fetchTable(tableName, options = {}) {
  const params = new URLSearchParams();
  if (options.maxRecords) params.set("maxRecords", options.maxRecords);
  if (options.view) params.set("view", options.view);
  if (options.filterByFormula) params.set("filterByFormula", options.filterByFormula);
  if (options.sort) {
    options.sort.forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      params.set(`sort[${i}][direction]`, s.direction || "asc");
    });
  }

  let allRecords = [];
  let offset = null;

  do {
    if (offset) params.set("offset", offset);
    const url = `${API_URL}/${encodeURIComponent(tableName)}?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.error(`Airtable error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;
  } while (offset && !options.maxRecords);

  return allRecords.map((r) => ({ id: r.id, ...r.fields }));
}

export async function getCasos() {
  return fetchTable("Casos", {
    sort: [{ field: "Nombre Deudor", direction: "asc" }],
  });
}

export async function getCasoById(id) {
  const records = await fetchTable("Casos", {
    filterByFormula: `RECORD_ID() = '${id}'`,
    maxRecords: 1,
  });
  return records[0] || null;
}

export async function getPrecedentes() {
  return fetchTable("Precedentes", {
    sort: [{ field: "Código", direction: "asc" }],
  });
}

export async function getTimeline(expediente) {
  if (!expediente) return [];
  return fetchTable("Timeline", {
    filterByFormula: `{No. Expediente} = '${expediente}'`,
    sort: [{ field: "Fecha Evento", direction: "asc" }],
  });
}

export async function getStats() {
  const casos = await getCasos();

  const sectors = {};
  const judges = {};
  const years = {};
  const outcomes = {
    "Desestimada/Inadmisible": 0,
    "En proceso": 0,
    "Plan homologado": 0,
    "Liquidación": 0,
    "Desistimiento": 0,
    "Otro": 0,
  };
  const conciliadores = new Set();
  const verificadores = new Set();

  casos.forEach((c) => {
    // Sectors
    const sector = c["Sector"] || "No especificado";
    sectors[sector] = (sectors[sector] || 0) + 1;

    // Judges
    const juez = c["Juez"] || "No especificado";
    judges[juez] = (judges[juez] || 0) + 1;

    // Years
    const fecha = c["Fecha Solicitud"] || "";
    const yearMatch = fecha.match(/(\d{4})/);
    if (yearMatch) {
      const year = yearMatch[1];
      years[year] = (years[year] || 0) + 1;
    }

    // Outcomes
    const estado = (c["Estado"] || "").toLowerCase();
    if (estado.includes("desestimada") || estado.includes("inadmisible") || estado.includes("irrecibible")) {
      outcomes["Desestimada/Inadmisible"]++;
    } else if (estado.includes("reestructuración") || estado.includes("conciliación") || estado.includes("verificación") || estado.includes("admisión")) {
      outcomes["En proceso"]++;
    } else if (estado.includes("homologad")) {
      outcomes["Plan homologado"]++;
    } else if (estado.includes("liquidación")) {
      outcomes["Liquidación"]++;
    } else if (estado.includes("desistimiento") || estado.includes("archivado")) {
      outcomes["Desistimiento"]++;
    } else {
      outcomes["Otro"]++;
    }

    // Auxiliares
    if (c["Conciliador"] && c["Conciliador"] !== "—" && !c["Conciliador"].toLowerCase().includes("no designado")) {
      conciliadores.add(c["Conciliador"]);
    }
    if (c["Verificador"] && c["Verificador"] !== "—" && !c["Verificador"].toLowerCase().includes("no designado")) {
      verificadores.add(c["Verificador"]);
    }
  });

  // Sort sectors and judges by count, take top entries
  const sortedSectors = Object.fromEntries(
    Object.entries(sectors).sort((a, b) => b[1] - a[1]).slice(0, 8)
  );
  const sortedJudges = Object.fromEntries(
    Object.entries(judges).sort((a, b) => b[1] - a[1]).slice(0, 5)
  );
  const sortedYears = Object.fromEntries(
    Object.entries(years).sort((a, b) => a[0].localeCompare(b[0]))
  );

  return {
    totalCases: casos.length,
    totalAuxiliares: conciliadores.size + verificadores.size,
    totalEvents: 397, // Will be dynamic when timeline is fully loaded
    totalTribunales: 3,
    sectors: sortedSectors,
    judges: sortedJudges,
    years: sortedYears,
    outcomes,
    casos,
  };
}
