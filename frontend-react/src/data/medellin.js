// ======================================
// MEDELLÍN — zona de cobertura, distancias y búsqueda de direcciones
// La búsqueda usa Nominatim (OpenStreetMap). Su política de uso no permite
// autocompletar mientras se escribe: solo se busca al presionar "Ubicar".
// ======================================

// Centro de Medellín y límites aproximados del Valle de Aburrá (zona de cobertura)
export const CENTRO_MEDELLIN = [6.2442, -75.5812];
export const LIMITES_VALLE = [
  [6.02, -75.75],
  [6.45, -75.42],
];

// Las vías en Medellín no son rectas (lomas, curvas, sentidos viales):
// la distancia real por carretera es aprox. 1,4 veces la línea recta.
export const FACTOR_VIAL = 1.4;

export function dentroDelValle({ lat, lng }) {
  const [[s, o], [n, e]] = LIMITES_VALLE;
  return lat >= s && lat <= n && lng >= o && lng <= e;
}

// Distancia en línea recta (km) entre dos puntos
export function distanciaRecta(a, b) {
  if (!a || !b) return 0;
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Distancia estimada por vía (km), con un decimal
export function distanciaVial(a, b) {
  return Math.round(distanciaRecta(a, b) * FACTOR_VIAL * 10) / 10;
}

// ---------- Búsqueda de direcciones ----------

const NOMINATIM = "https://nominatim.openstreetmap.org";
const VIEWBOX = `${LIMITES_VALLE[0][1]},${LIMITES_VALLE[1][0]},${LIMITES_VALLE[1][1]},${LIMITES_VALLE[0][0]}`;

// Abreviaturas comunes de la nomenclatura colombiana
const ABREVIATURAS = [
  [/^(cra|cr|kr|kra|carr)\.?\s+/i, "Carrera "],
  [/^(cl|cll|cal)\.?\s+/i, "Calle "],
  [/^(cq|circ)\.?\s+/i, "Circular "],
  [/^(tv|tr|transv)\.?\s+/i, "Transversal "],
  [/^(dg|diag)\.?\s+/i, "Diagonal "],
  [/^(av|avda)\.?\s+/i, "Avenida "],
];

/**
 * "Cra 70 #45-20" -> "Carrera 70". OpenStreetMap no tiene la numeración de
 * placas de Medellín, así que se busca la vía dentro del barrio indicado.
 */
export function viaPrincipal(direccion) {
  let via = direccion.split(/#|\bno\.?\s|\bn°/i)[0].trim();
  for (const [re, nombre] of ABREVIATURAS) via = via.replace(re, nombre);
  return via;
}

// Etiqueta corta a partir del display_name de Nominatim
const RUIDO = /^(Comuna|Perímetro|Valle de Aburrá|Antioquia|Colombia|RAP |\d{6})/;
const etiquetaCorta = (displayName) =>
  displayName
    .split(",")
    .map((p) => p.trim())
    .filter((p) => !RUIDO.test(p))
    .slice(0, 3)
    .join(", ");

async function nominatim(ruta, params) {
  const url = `${NOMINATIM}/${ruta}?${new URLSearchParams({ format: "jsonv2", "accept-language": "es", ...params })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Servicio de direcciones no disponible");
  return res.json();
}

const buscarTexto = async (q) =>
  (await nominatim("search", { q, viewbox: VIEWBOX, bounded: 1, limit: 5 })).map((r) => ({
    lat: Number(r.lat),
    lng: Number(r.lon),
    etiqueta: etiquetaCorta(r.display_name),
  }));

/**
 * Busca una dirección (o lugar) dentro de un barrio/municipio.
 * Devuelve { resultados, aproximado }; aproximado = true si solo se encontró el barrio.
 */
export async function buscarDireccion(direccion, barrio) {
  const via = viaPrincipal(direccion);
  const resultados = await buscarTexto([via, barrio].filter(Boolean).join(", "));
  if (resultados.length || !barrio) return { resultados, aproximado: false };

  // no apareció la vía: al menos ubicamos el barrio
  return { resultados: await buscarTexto(barrio), aproximado: true };
}

// Coordenadas -> { direccion, barrio }
export async function direccionDePunto({ lat, lng }) {
  try {
    const data = await nominatim("reverse", { lat, lon: lng, zoom: 18 });
    const a = data.address || {};
    return {
      direccion: a.road ? (a.house_number ? `${a.road} #${a.house_number}` : a.road) : "",
      barrio: a.neighbourhood || a.suburb || (a.city || a.town || a.village || "").replace("Perímetro Urbano ", ""),
    };
  } catch {
    return { direccion: "", barrio: "" };
  }
}
