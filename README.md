# HubLegal.com.do — Observatorio de Insolvencia RD

Dashboard de casos de reestructuración y liquidación bajo la **Ley 141-15** de la República Dominicana.

## Stack

- **Next.js 14** (App Router)
- **Airtable** (base de datos / CMS)
- **Vercel** (hosting + auto-deploy)

## Estructura

```
src/
├── app/
│   ├── layout.js          # Header + layout global
│   ├── page.js            # Dashboard principal
│   ├── globals.css        # Estilos globales
│   ├── casos/
│   │   ├── page.js        # Lista de casos (server)
│   │   └── CasosClient.js # Filtros y búsqueda (client)
│   ├── caso/
│   │   └── [id]/
│   │       └── page.js    # Detalle del caso + Resumen + Timeline
│   ├── precedentes/
│   │   ├── page.js        # Índice de precedentes (server)
│   │   └── PrecedentesClient.js # Búsqueda y expansión (client)
│   └── auxiliares/
│       └── page.js        # League table
└── lib/
    └── airtable.js        # API de Airtable
```

## Setup

### 1. Variables de entorno

En Vercel → Settings → Environment Variables, agregar:

| Variable | Valor |
|---|---|
| `AIRTABLE_TOKEN` | Tu personal access token |
| `AIRTABLE_BASE_ID` | El ID de tu base (empieza con `app`) |

### 2. Tablas requeridas en Airtable

- **Casos** — campo clave: `Nombre Deudor`
- **Precedentes** — campo clave: `Código`
- **Timeline** — campo clave: `No. Expediente`
- **Datos Financieros** (para fase premium)
- **Resoluciones Pendientes** (interno, no se muestra)

### 3. Campo "Resumen" en Airtable

Para agregar resúmenes a casos individuales:
1. En la tabla **Casos**, agrega una columna llamada exactamente **"Resumen"**
2. Tipo: **Long text**
3. Escribe el resumen del caso en esa celda
4. Se mostrará automáticamente en la página del caso

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local
# Editar .env.local con tus credenciales
npm run dev
```

## Deploy

Cada push a `main` en GitHub despliega automáticamente en Vercel.
