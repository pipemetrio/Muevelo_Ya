import { useEffect, useState } from "react";

const DURACION_TRAMO = 6000; // ms que tarda la animación de cada tramo

const interpolar = (a, b, t) => ({
  lat: a.lat + (b.lat - a.lat) * t,
  lng: a.lng + (b.lng - a.lng) * t,
});

// Punto de partida simulado del transportista (un poco alejado del origen)
const puntoPartida = (origen) => ({ lat: origen.lat + 0.018, lng: origen.lng + 0.014 });

/**
 * Devuelve la posición simulada del vehículo según el estado del servicio:
 * - asignado:  esperando en su punto de partida
 * - en_camino: avanza hacia el origen (A)
 * - recogido:  avanza del origen (A) al destino (B)
 * - entregado: en el destino
 */
export default function useVehiculo(solicitud) {
  const estado = solicitud?.estado;
  const [progreso, setProgreso] = useState({ estado, t: 0 });

  useEffect(() => {
    if (estado !== "en_camino" && estado !== "recogido") return;
    const inicio = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - inicio) / DURACION_TRAMO);
      setProgreso({ estado, t });
      if (t === 1) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [estado]);

  if (!solicitud?.conductor) return null;
  const { origen, destino } = solicitud;
  // si el estado acaba de cambiar y el intervalo aún no corre, arrancamos en 0
  const t = progreso.estado === estado ? progreso.t : 0;

  switch (estado) {
    case "asignado":
      return puntoPartida(origen);
    case "en_camino":
      return interpolar(puntoPartida(origen), origen, t);
    case "recogido":
      return interpolar(origen, destino, t);
    case "entregado":
      return destino;
    default:
      return null;
  }
}

export { DURACION_TRAMO };
