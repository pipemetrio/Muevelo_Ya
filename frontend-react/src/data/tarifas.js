// ======================================
// TARIFAS — Muévelo Ya (valores aproximados de simulación en COP)
// El cliente ve UN solo valor del servicio, que sube con la distancia.
// Internamente se calcula como arranque + valor por km (nunca menor al mínimo);
// esos componentes son solo para el cálculo y no se muestran.
// Referencias usadas para calibrar:
//   - Acarreo de un comedor de Santa Cruz a La Ladera (~6,5 km) ≈ $90.000
//   - Acarreo de una nevera desde ~$70.000
//   - Trasteo normal entre $150.000 y $200.000
// ======================================

export const SERVICIOS = {
  envio: {
    id: "envio",
    icon: "📦",
    nombre: "Envío",
    desc: "Paquetes, cajas pequeñas y mercancía liviana.",
    vehiculo: "Moto",
    tarifaBase: 12000,
    valorKm: 2000,
    minimo: 15000,
    ayudantesIncluidos: 0,
  },
  acarreo: {
    id: "acarreo",
    icon: "🛋️",
    nombre: "Acarreo",
    desc: "Uno o pocos objetos grandes: nevera, comedor, lavadora, cama.",
    vehiculo: "Carry / Camioneta",
    tarifaBase: 57000,
    valorKm: 5000,
    minimo: 70000,
    ayudantesIncluidos: 0,
  },
  trasteo: {
    id: "trasteo",
    icon: "🏠",
    nombre: "Trasteo",
    desc: "Varios muebles, electrodomésticos y cajas de un apartamento.",
    vehiculo: "Camioneta / Furgón",
    tarifaBase: 120000,
    valorKm: 7000,
    minimo: 150000,
    ayudantesIncluidos: 1,
  },
  mudanza: {
    id: "mudanza",
    icon: "🚚",
    nombre: "Mudanza",
    desc: "Mudanza completa de casa u oficina.",
    vehiculo: "Camión",
    tarifaBase: 250000,
    valorKm: 10000,
    minimo: 300000,
    ayudantesIncluidos: 2,
  },
};

export const EXTRAS = {
  ayudante: 30000, // por ayudante adicional
  embalaje: 25000, // embalaje básico
  piso: 10000, // por piso sin ascensor (origen + destino)
};

export const MAX_AYUDANTES = 3;

// Porcentaje que se queda la plataforma; el resto es ganancia del transportista
export const COMISION_PLATAFORMA = 0.2;

const redondearMil = (valor) => Math.round(valor / 1000) * 1000;

/**
 * Devuelve { servicio, ayudantes, embalaje, pisos, total }.
 * - servicio: valor del transporte según la distancia (ya redondeado).
 * - ayudantes / embalaje / pisos: extras opcionales que elige el cliente.
 * total = servicio + extras (suma exacta de lo que se muestra).
 */
export function calcularPrecio({ servicio, km = 0, ayudantes = 0, embalaje = false, pisos = 0 }) {
  const s = SERVICIOS[servicio];
  if (!s) return { servicio: 0, ayudantes: 0, embalaje: 0, pisos: 0, total: 0 };

  const detalle = {
    servicio: Math.max(s.minimo, redondearMil(s.tarifaBase + km * s.valorKm)),
    ayudantes: ayudantes * EXTRAS.ayudante,
    embalaje: embalaje ? EXTRAS.embalaje : 0,
    pisos: pisos * EXTRAS.piso,
  };
  detalle.total = detalle.servicio + detalle.ayudantes + detalle.embalaje + detalle.pisos;
  return detalle;
}

export const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
