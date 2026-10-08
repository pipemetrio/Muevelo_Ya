import { useEffect, useState } from "react";
import MapaRuta from "../MapaRuta/MapaRuta";
import useVehiculo, { DURACION_TRAMO } from "../useVehiculo";
import { SERVICIOS, formatoCOP } from "../../../data/tarifas";
import {
  ESTADOS,
  SIGUIENTE_ESTADO,
  CONDUCTOR_SIMULADO,
  useSolicitudes,
  obtenerSolicitudes,
  actualizarSolicitud,
  formatoFecha,
} from "../../../data/solicitudes";
import "../Solicitud.css";

const ESPERA_ASIGNACION = 8000; // ms antes de que el conductor simulado acepte
const LINEA_TIEMPO = ["asignado", "en_camino", "recogido", "entregado"];

// Lee el estado actual desde el almacenamiento (puede haber cambiado en otra pestaña)
const actual = (id) => obtenerSolicitudes().find((s) => s.id === id);

function SeguimientoServicio({ id, onNueva }) {
  const solicitud = useSolicitudes().find((s) => s.id === id);
  const vehiculo = useVehiculo(solicitud);
  const [calificacion, setCalificacion] = useState(0);

  const estado = solicitud?.estado;
  const sinConductor = solicitud && !solicitud.conductor;
  const auto = solicitud?.conductor?.auto;

  // 1) Si nadie la acepta desde la vista Transportista, la acepta un conductor simulado
  useEffect(() => {
    if (!sinConductor || (estado !== "buscando" && estado !== "programado")) return;
    const t = setTimeout(() => {
      const s = actual(id);
      if (!s || s.conductor || s.estado === "cancelado") return; // ya la aceptó alguien o se canceló
      actualizarSolicitud(id, {
        conductor: { ...CONDUCTOR_SIMULADO, auto: true },
        estado: s.estado === "buscando" ? "asignado" : "programado",
      });
    }, ESPERA_ASIGNACION);
    return () => clearTimeout(t);
  }, [id, estado, sinConductor]);

  // 2) El conductor simulado avanza solo por los estados
  useEffect(() => {
    if (!auto || !SIGUIENTE_ESTADO[estado]) return;
    const t = setTimeout(() => {
      const s = actual(id);
      if (s?.estado === estado) actualizarSolicitud(id, { estado: SIGUIENTE_ESTADO[estado] });
    }, DURACION_TRAMO + 1500);
    return () => clearTimeout(t);
  }, [id, estado, auto]);

  if (!solicitud) {
    return (
      <div className="sol-card sol-centro">
        <p>No encontramos esta solicitud (puede que se haya reiniciado la simulación).</p>
        <button className="sol-btn" onClick={onNueva}>Nueva solicitud</button>
      </div>
    );
  }

  const servicio = SERVICIOS[solicitud.servicio];
  const { conductor } = solicitud;
  const pasoActual = ESTADOS[estado].paso;
  const cancelable = ["buscando", "programado", "asignado"].includes(estado);

  return (
    <div className="sol-card">
      <div className="seg-header">
        <div>
          <span className="seg-id">Solicitud {solicitud.id}</span>
          <h3 className="sol-titulo">
            {servicio.icon} {servicio.nombre} · {ESTADOS[estado].label}
          </h3>
          <p className="sol-ayuda">
            {solicitud.modalidad === "inmediato"
              ? "⚡ Servicio inmediato"
              : `📅 Programado para ${formatoFecha(solicitud.fecha)}`}
            {" · "}
            ≈ {solicitud.km} km por vía · {formatoCOP(solicitud.total)}
          </p>
        </div>
      </div>

      {/* Buscando / esperando confirmación */}
      {sinConductor && estado !== "cancelado" && (
        <div className="seg-buscando">
          <span className="sol-spinner sol-spinner--grande" />
          <div>
            <strong>
              {estado === "buscando"
                ? "Buscando un transportista cerca de ti..."
                : "Esperando que un transportista confirme tu servicio programado..."}
            </strong>
            <p>
              Tip para la demo: abre la vista <em>Transportista</em> en otra pestaña y acepta esta solicitud tú mismo.
              Si no, un conductor simulado la aceptará en unos segundos.
            </p>
          </div>
        </div>
      )}

      {/* Datos del conductor */}
      {conductor && estado !== "cancelado" && (
        <div className="seg-conductor">
          <div className="seg-avatar">{conductor.nombre[0]}</div>
          <div className="seg-conductor-info">
            <strong>{conductor.nombre}</strong>
            <span>
              {servicio.vehiculo} · Placa {conductor.placa} · {conductor.calificacion.toFixed(1)} ★
            </span>
          </div>
          <a className="sol-btn sol-btn--sec sol-btn--chico" href={`tel:${conductor.telefono.replace(/\s/g, "")}`}>
            📞 Llamar
          </a>
        </div>
      )}

      {/* Programado y confirmado: permite saltar al día del servicio */}
      {estado === "programado" && conductor && (
        <div className="seg-aviso">
          ✅ Tu servicio está confirmado para el <strong>{formatoFecha(solicitud.fecha)}</strong>.
          {auto ? (
            <button className="sol-btn sol-btn--chico" onClick={() => actualizarSolicitud(id, { estado: "asignado" })}>
              Simular llegada del día ⏩
            </button>
          ) : (
            <span> El transportista iniciará el servicio desde su panel.</span>
          )}
        </div>
      )}

      {/* Línea de tiempo */}
      {estado !== "cancelado" && (
        <ol className="seg-timeline">
          {LINEA_TIEMPO.map((e) => {
            const p = ESTADOS[e].paso;
            return (
              <li
                key={e}
                className={`seg-hito ${p < pasoActual || estado === "entregado" ? "seg-hito--hecho" : ""} ${p === pasoActual && estado !== "entregado" ? "seg-hito--actual" : ""}`}
              >
                <span className="seg-hito-punto" />
                {ESTADOS[e].label}
              </li>
            );
          })}
        </ol>
      )}

      {estado === "cancelado" && <div className="seg-aviso seg-aviso--error">Este servicio fue cancelado.</div>}

      <MapaRuta origen={solicitud.origen} destino={solicitud.destino} vehiculo={vehiculo} alto={320} />

      <div className="seg-direcciones">
        <p><span className="sol-punto-letra sol-punto-letra--origen">A</span>{solicitud.origen.direccion}</p>
        <p><span className="sol-punto-letra sol-punto-letra--destino">B</span>{solicitud.destino.direccion}</p>
      </div>

      {/* Entregado: calificación */}
      {estado === "entregado" && (
        <div className="seg-final">
          <h3 className="sol-titulo">¡Servicio completado! 🎉</h3>
          <p>¿Cómo calificas a {conductor.nombre}?</p>
          <div className="seg-estrellas">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={n <= calificacion ? "seg-estrella--activa" : ""}
                onClick={() => setCalificacion(n)}
                aria-label={`${n} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
          {calificacion > 0 && <p className="sol-ayuda">¡Gracias por calificar!</p>}
        </div>
      )}

      <div className="sol-acciones">
        {cancelable && (
          <button className="sol-btn sol-btn--peligro" onClick={() => actualizarSolicitud(id, { estado: "cancelado" })}>
            Cancelar servicio
          </button>
        )}
        <button className="sol-btn" onClick={onNueva}>
          {estado === "entregado" || estado === "cancelado" ? "Solicitar otro servicio" : "Nueva solicitud"}
        </button>
      </div>
    </div>
  );
}

export default SeguimientoServicio;
