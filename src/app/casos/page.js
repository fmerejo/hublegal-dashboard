import { getCasos } from "@/lib/airtable";
import CasosClient from "./CasosClient";

export const metadata = {
  title: "Casos — HubLegal.com.do",
  description: "Lista de casos de reestructuración y liquidación bajo la Ley 141-15.",
};

export default async function CasosPage() {
  const casos = await getCasos();

  // Serialize for client component
  const casosData = casos.map((c) => ({
    id: c.id,
    nombre: c["Nombre Deudor"] || "",
    expediente: c["No. Expediente"] || "",
    sector: c["Sector"] || "",
    estado: c["Estado"] || "",
    fechaSolicitud: c["Fecha Solicitud"] || "",
    tribunal: c["Tribunal"] || "",
    juez: c["Juez"] || "",
    solicitante: c["Solicitante"] || "",
    conciliador: c["Conciliador"] || "",
  }));

  return <CasosClient casos={casosData} />;
}
