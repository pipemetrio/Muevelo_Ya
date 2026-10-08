import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import ClienteSolicitud from "../components/solicitud/ClienteSolicitud/ClienteSolicitud";
import SeguimientoServicio from "../components/solicitud/SeguimientoServicio/SeguimientoServicio";
import TransportistaPanel from "../components/solicitud/TransportistaPanel/TransportistaPanel";
import { SERVICIOS } from "../data/tarifas";
import { ESTADOS, useSolicitudes } from "../data/solicitudes";
import "../components/solicitud/Solicitud.css";

export default function Solicitar() {
  const [params, setParams] = useSearchParams();
  const rol = params.get("rol") === "transportista" ? "transportista" : "cliente";
  const [solicitudActiva, setSolicitudActiva] = useState(null);
  // cambia la key para reiniciar el formulario al pedir "nueva solicitud"
  const [formKey, setFormKey] = useState(0);

  const misSolicitudes = useSolicitudes().filter((s) => s.creadaPor === "cliente");

  const cambiarRol = (nuevo) => {
    const p = new URLSearchParams(params);
    p.set("rol", nuevo);
    setParams(p, { replace: true });
  };

  const nuevaSolicitud = () => {
    setSolicitudActiva(null);
    setFormKey((k) => k + 1);
  };

  return (
    <>
      <Navbar />
      <main className="solicitar">
        <div className="solicitar-header">
          <span className="solicitar-eyebrow">Simulación de servicio</span>
          <h1>
            Solicita tu <span className="solicitar-highlight">acarreo</span> en Medellín
          </h1>
          <p>
            Prueba cómo funciona Muévelo Ya desde los dos lados: como cliente que pide un servicio y como transportista
            que lo acepta y lo realiza.
          </p>

          <div className="solicitar-roles" role="tablist">
            <button
              role="tab"
              aria-selected={rol === "cliente"}
              className={`solicitar-rol ${rol === "cliente" ? "solicitar-rol--activo" : ""}`}
              onClick={() => cambiarRol("cliente")}
            >
              👤 Soy cliente
            </button>
            <button
              role="tab"
              aria-selected={rol === "transportista"}
              className={`solicitar-rol ${rol === "transportista" ? "solicitar-rol--activo" : ""}`}
              onClick={() => cambiarRol("transportista")}
            >
              🚚 Soy transportista
            </button>
          </div>
          <a className="solicitar-pestana" href={`/solicitar?rol=${rol === "cliente" ? "transportista" : "cliente"}`} target="_blank" rel="noreferrer">
            Abrir vista {rol === "cliente" ? "transportista" : "cliente"} en otra pestaña ↗
          </a>
        </div>

        <div className="solicitar-contenido">
          {rol === "cliente" ? (
            <>
              {solicitudActiva ? (
                <SeguimientoServicio id={solicitudActiva} onNueva={nuevaSolicitud} />
              ) : (
                <ClienteSolicitud
                  key={formKey}
                  servicioInicial={params.get("servicio")}
                  onCreada={setSolicitudActiva}
                />
              )}

              {misSolicitudes.length > 0 && (
                <div className="mis-solicitudes">
                  <h3>Mis solicitudes</h3>
                  {misSolicitudes.map((s) => (
                    <button
                      key={s.id}
                      className={`mis-solicitud ${s.id === solicitudActiva ? "mis-solicitud--activa" : ""}`}
                      onClick={() => setSolicitudActiva(s.id)}
                    >
                      <span>{SERVICIOS[s.servicio].icon} {s.id}</span>
                      <span className="mis-solicitud-destino">{s.destino.direccion}</span>
                      <span className="tra-estado">{ESTADOS[s.estado].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <TransportistaPanel />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
