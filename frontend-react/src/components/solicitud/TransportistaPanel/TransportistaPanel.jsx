import { useState } from "react";
import MapaRuta from "../MapaRuta/MapaRuta";
import useVehiculo from "../useVehiculo";
import { SERVICIOS, COMISION_PLATAFORMA, formatoCOP } from "../../../data/tarifas";
import {
  ESTADOS,
  CONDUCTOR_USUARIO,
  useSolicitudes,
  obtenerSolicitudes,
  actualizarSolicitud,
  reiniciarSimulacion,
  formatoFecha,
} from "../../../data/solicitudes";
import "../Solicitud.css";

const ACCION = {
  programado: { texto: "Iniciar servicio 🚀", siguiente: "en_camino" },
  asignado: { texto: "Voy en camino 🚚", siguiente: "en_camino" },
  en_camino: { texto: "Carga recogida 📦", siguiente: "recogido" },
  recogido: { texto: "Confirmar entrega ✅", siguiente: "entregado" },
};

const esMia = (s) => s.conductor && !s.conductor.auto && s.conductor.placa === CONDUCTOR_USUARIO.placa;
const ganancia = (s) => Math.round(s.total * (1 - COMISION_PLATAFORMA));

function TransportistaPanel() {
  const solicitudes = useSolicitudes();
  const [tab, setTab] = useState("disponibles");
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const disponibles = solicitudes.filter(
    (s) => !s.conductor && (s.estado === "buscando" || s.estado === "programado"),
  );
  const mias = solicitudes.filter((s) => esMia(s) && s.estado !== "entregado" && s.estado !== "cancelado");
  const historial = solicitudes.filter((s) => esMia(s) && (s.estado === "entregado" || s.estado === "cancelado"));
  const ganancias = historial.filter((s) => s.estado === "entregado").reduce((t, s) => t + ganancia(s), 0);

  const listas = { disponibles, mias, historial };
  const lista = listas[tab];
  const seleccionada = lista.find((s) => s.id === seleccionadaId) || lista[0] || null;
  const vehiculo = useVehiculo(seleccionada && esMia(seleccionada) ? seleccionada : null);

  const aceptar = (s) => {
    const actual = obtenerSolicitudes().find((x) => x.id === s.id);
    if (!actual || actual.conductor || actual.estado === "cancelado") {
      setMensaje("Esta solicitud ya no está disponible (la tomó otro transportista o fue cancelada).");
      return;
    }
    actualizarSolicitud(s.id, {
      conductor: { ...CONDUCTOR_USUARIO },
      estado: s.estado === "buscando" ? "asignado" : "programado",
    });
    setMensaje(`Aceptaste la solicitud ${s.id}. La encuentras en "Mis servicios".`);
    setSeleccionadaId(s.id);
    setTab("mias");
  };

  const avanzar = (s) => {
    const siguiente = ACCION[s.estado]?.siguiente;
    if (!siguiente) return;
    actualizarSolicitud(s.id, { estado: siguiente });
    if (siguiente === "entregado") {
      setMensaje(`¡Servicio ${s.id} entregado! Ganaste ${formatoCOP(ganancia(s))}.`);
    }
  };

  const cambiarTab = (t) => {
    setTab(t);
    setSeleccionadaId(null);
  };

  return (
    <div className="tra-panel">
      {/* Estadísticas */}
      <div className="tra-stats">
        <div className="tra-stat"><strong>{disponibles.length}</strong><span>Disponibles</span></div>
        <div className="tra-stat"><strong>{mias.length}</strong><span>En curso / agendados</span></div>
        <div className="tra-stat"><strong>{historial.filter((s) => s.estado === "entregado").length}</strong><span>Completados</span></div>
        <div className="tra-stat tra-stat--destacado"><strong>{formatoCOP(ganancias)}</strong><span>Ganancias</span></div>
      </div>

      {mensaje && (
        <div className="seg-aviso" onClick={() => setMensaje("")}>
          {mensaje} <span className="tra-cerrar">✕</span>
        </div>
      )}

      <div className="tra-tabs">
        {[
          ["disponibles", `Disponibles (${disponibles.length})`],
          ["mias", `Mis servicios (${mias.length})`],
          ["historial", "Historial"],
        ].map(([id, label]) => (
          <button key={id} className={`tra-tab ${tab === id ? "tra-tab--activa" : ""}`} onClick={() => cambiarTab(id)}>
            {label}
          </button>
        ))}
        <button
          className="tra-reiniciar"
          onClick={() => {
            reiniciarSimulacion();
            setSeleccionadaId(null);
            setMensaje("Simulación reiniciada con las solicitudes de ejemplo.");
          }}
        >
          ↺ Reiniciar simulación
        </button>
      </div>

      <div className="tra-contenido">
        {/* Lista */}
        <div className="tra-lista">
          {lista.length === 0 && (
            <p className="tra-vacio">
              {tab === "disponibles"
                ? "No hay solicitudes disponibles. Crea una desde la vista Cliente."
                : tab === "mias"
                  ? "No tienes servicios activos. Acepta uno en Disponibles."
                  : "Aún no has completado servicios."}
            </p>
          )}
          {lista.map((s) => {
            const serv = SERVICIOS[s.servicio];
            return (
              <button
                key={s.id}
                className={`tra-item ${seleccionada?.id === s.id ? "tra-item--activo" : ""}`}
                onClick={() => setSeleccionadaId(s.id)}
              >
                <div className="tra-item-top">
                  <span>{serv.icon} {serv.nombre}</span>
                  <span className={`tra-badge ${s.modalidad === "inmediato" ? "tra-badge--ya" : ""}`}>
                    {s.modalidad === "inmediato" ? "⚡ Inmediato" : `📅 ${formatoFecha(s.fecha)}`}
                  </span>
                </div>
                <p className="tra-ruta">
                  <span>A</span> {s.origen.direccion}
                </p>
                <p className="tra-ruta">
                  <span>B</span> {s.destino.direccion}
                </p>
                <div className="tra-item-bottom">
                  <span>≈ {s.km} km</span>
                  {tab !== "disponibles" && <span className="tra-estado">{ESTADOS[s.estado].label}</span>}
                  <strong>{formatoCOP(ganancia(s))}</strong>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalle */}
        <div className="tra-detalle">
          {seleccionada ? (
            <>
              <MapaRuta origen={seleccionada.origen} destino={seleccionada.destino} vehiculo={vehiculo} alto={300} />
              <div className="tra-detalle-info">
                <h3 className="sol-titulo">
                  {SERVICIOS[seleccionada.servicio].icon} {SERVICIOS[seleccionada.servicio].nombre} · {seleccionada.id}
                </h3>
                <p><span>Cliente</span>{seleccionada.cliente} · {seleccionada.telefono}</p>
                <p><span>Recorrido</span>≈ {seleccionada.km} km por vía</p>
                <p><span>Cuándo</span>{seleccionada.modalidad === "inmediato" ? "Lo antes posible" : formatoFecha(seleccionada.fecha)}</p>
                <p><span>Carga</span>{seleccionada.descripcion}</p>
                <p>
                  <span>Extras</span>
                  {[
                    seleccionada.ayudantes > 0 && `${seleccionada.ayudantes} ayudante(s) adicional(es)`,
                    seleccionada.pisos > 0 && `${seleccionada.pisos} piso(s) por escaleras`,
                    seleccionada.embalaje && "Embalaje",
                  ].filter(Boolean).join(" · ") || "Ninguno"}
                </p>
                <p><span>Vehículo</span>{SERVICIOS[seleccionada.servicio].vehiculo}</p>
                <p>
                  <span>Pago</span>
                  Total {formatoCOP(seleccionada.total)} · Tu ganancia <strong>{formatoCOP(ganancia(seleccionada))}</strong>
                </p>
                <p><span>Estado</span>{ESTADOS[seleccionada.estado].label}</p>
              </div>

              <div className="sol-acciones">
                {tab === "disponibles" && !seleccionada.conductor && (
                  <button className="sol-btn" onClick={() => aceptar(seleccionada)}>Aceptar solicitud</button>
                )}
                {esMia(seleccionada) && ACCION[seleccionada.estado] && (
                  <button className="sol-btn" onClick={() => avanzar(seleccionada)}>
                    {ACCION[seleccionada.estado].texto}
                  </button>
                )}
                {esMia(seleccionada) && (seleccionada.estado === "programado" || seleccionada.estado === "asignado") && (
                  <button
                    className="sol-btn sol-btn--sec"
                    onClick={() => {
                      actualizarSolicitud(seleccionada.id, {
                        conductor: null,
                        estado: seleccionada.modalidad === "inmediato" ? "buscando" : "programado",
                      });
                      setMensaje(`Liberaste la solicitud ${seleccionada.id}.`);
                    }}
                  >
                    Liberar
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="tra-vacio">Selecciona una solicitud para ver el detalle.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransportistaPanel;
