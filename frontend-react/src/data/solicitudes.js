// ======================================
// SOLICITUDES — almacenamiento simulado (localStorage)
// Cuando exista backend, este archivo se reemplaza por llamadas a la API.
// La vista Cliente y la vista Transportista leen y escriben aquí, y se
// sincronizan entre pestañas con el evento "storage".
// ======================================

import { useEffect, useState } from "react";
import { calcularPrecio } from "./tarifas";
import { distanciaVial } from "./medellin";

const KEY = "muevelo_solicitudes_v2";
const EVENTO = "muevelo-solicitudes-cambio";

// Estados del servicio, en orden
export const ESTADOS = {
  buscando: { label: "Buscando transportista", paso: 0 },
  programado: { label: "Programado", paso: 0 },
  asignado: { label: "Transportista asignado", paso: 1 },
  en_camino: { label: "En camino a recoger", paso: 2 },
  recogido: { label: "Carga recogida", paso: 3 },
  entregado: { label: "Entregado", paso: 4 },
  cancelado: { label: "Cancelado", paso: -1 },
};

export const SIGUIENTE_ESTADO = {
  asignado: "en_camino",
  en_camino: "recogido",
  recogido: "entregado",
};

// Conductor que se asigna cuando nadie acepta desde la vista Transportista
export const CONDUCTOR_SIMULADO = {
  nombre: "Jhon Fredy Restrepo",
  telefono: "+57 312 456 7890",
  placa: "WMK-482",
  calificacion: 4.9,
};

// Conductor que "es" el usuario cuando entra en la vista Transportista
export const CONDUCTOR_USUARIO = {
  nombre: "Tú (Transportista)",
  telefono: "+57 300 000 0000",
  placa: "MYA-001",
  calificacion: 5.0,
};

const hoyMas = (dias, hora) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
};

// Completa distancia y precio de las solicitudes de ejemplo
const conPrecio = (s) => {
  const km = distanciaVial(s.origen, s.destino);
  return { ...s, km, total: calcularPrecio({ ...s, km }).total };
};

// Solicitudes de ejemplo para que el transportista tenga algo que ver
const SEMILLA = () => [
  {
    id: "MY-1000231",
    creadaPor: "demo",
    cliente: "Laura Gómez",
    telefono: "+57 301 222 3344",
    servicio: "acarreo",
    origen: { lat: 6.29335, lng: -75.559, direccion: "Calle 99 #49-30, Santa Cruz" },
    destino: { lat: 6.25155, lng: -75.5534, direccion: "Carrera 36 #56-12, La Ladera" },
    modalidad: "inmediato",
    fecha: new Date().toISOString(),
    descripcion: "Comedor de 4 puestos con sillas.",
    ayudantes: 0,
    embalaje: false,
    pisos: 0,
    estado: "buscando",
    conductor: null,
    creada: new Date().toISOString(),
  },
  {
    id: "MY-1000232",
    creadaPor: "demo",
    cliente: "Andrés Mejía",
    telefono: "+57 315 888 1020",
    servicio: "trasteo",
    origen: { lat: 6.2697, lng: -75.5655, direccion: "Carrera 50 #92-15, Aranjuez" },
    destino: { lat: 6.1719, lng: -75.6114, direccion: "Calle 51 #50-20, Itagüí (Apto 402)" },
    modalidad: "programado",
    fecha: hoyMas(1, 9),
    descripcion: "Nevera, lavadora y 6 cajas.",
    ayudantes: 1,
    embalaje: true,
    pisos: 2,
    estado: "programado",
    conductor: null,
    creada: new Date().toISOString(),
  },
  {
    id: "MY-1000233",
    creadaPor: "demo",
    cliente: "Comercial Laureles SAS",
    telefono: "+57 604 444 5566",
    servicio: "mudanza",
    origen: { lat: 6.2447, lng: -75.596, direccion: "Circular 1 #70-10, Laureles" },
    destino: { lat: 6.3373, lng: -75.5579, direccion: "Diagonal 55 #37-41, Niquía, Bello" },
    modalidad: "programado",
    fecha: hoyMas(3, 7),
    descripcion: "Oficina completa: escritorios, sillas y archivadores.",
    ayudantes: 1,
    embalaje: true,
    pisos: 0,
    estado: "programado",
    conductor: null,
    creada: new Date().toISOString(),
  },
].map(conPrecio);

function leer() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage no disponible o dato corrupto: se usa la semilla
  }
  const semilla = SEMILLA();
  guardar(semilla, false);
  return semilla;
}

function guardar(lista, notificar = true) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
  } catch {
    // sin persistencia: la simulación sigue funcionando en memoria
  }
  if (notificar) window.dispatchEvent(new Event(EVENTO));
}

export function obtenerSolicitudes() {
  return leer();
}

export function crearSolicitud(datos) {
  const nueva = {
    ...datos,
    id: "MY-" + Date.now().toString().slice(-7),
    creadaPor: "cliente",
    estado: datos.modalidad === "programado" ? "programado" : "buscando",
    conductor: null,
    creada: new Date().toISOString(),
  };
  guardar([nueva, ...leer()]);
  return nueva;
}

export function actualizarSolicitud(id, cambios) {
  guardar(leer().map((s) => (s.id === id ? { ...s, ...cambios } : s)));
}

export function reiniciarSimulacion() {
  guardar(SEMILLA());
}

// Hook: lista de solicitudes siempre actualizada (misma pestaña y otras pestañas)
export function useSolicitudes() {
  const [lista, setLista] = useState(leer);

  useEffect(() => {
    const refrescar = () => setLista(leer());
    const onStorage = (e) => {
      if (e.key === KEY) refrescar();
    };
    window.addEventListener(EVENTO, refrescar);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENTO, refrescar);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return lista;
}

export const formatoFecha = (iso) =>
  new Date(iso).toLocaleString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
