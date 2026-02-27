import { getPrecedentes } from "@/lib/airtable";
import PrecedentesClient from "./PrecedentesClient";

export const metadata = {
  title: "Precedentes — HubLegal.com.do",
  description: "Índice de precedentes jurisprudenciales de la Ley 141-15 sobre reestructuración y liquidación.",
};

export default async function PrecedentesPage() {
  const precedentes = await getPrecedentes();

  // Group by category
  const categories = {};
  precedentes.forEach((p) => {
    const cat = p["Categoría"] || "Sin categoría";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({
      codigo: p["Código"] || "",
      titulo: p["Título"] || "",
      caso: p["Caso"] || "",
      regla: p["Regla"] || "",
      articulos: p["Artículos"] || "",
      juez: p["Juez"] || "",
      tribunal: p["Tribunal"] || "",
      fecha: p["Fecha Resolución"] || "",
      subcategoria: p["Subcategoría"] || "",
    });
  });

  const categoryList = Object.entries(categories).map(([name, items]) => ({
    name,
    count: items.length,
    items,
  }));

  return <PrecedentesClient categories={categoryList} total={precedentes.length} />;
}
