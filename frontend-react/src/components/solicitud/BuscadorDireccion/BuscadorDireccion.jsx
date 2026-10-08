import { useState } from "react";
import { buscarDireccion, dentroDelValle } from "../../../data/medellin";
import "../Solicitud.css";

/**
 * Campos de dirección de un punto (A o B) con botón para ubicarlo en el mapa.
 * valor: { direccion, barrio, detalle, lat, lng }
 * onCambio(campos): actualiza parcialmente el punto.
 */
function BuscadorDireccion({ tipo, letra, titulo, valor, activo, onActivar, onCambio, error }) {
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok" | "aviso" | "error", texto }

  const ubicado = valor.lat != null;

  // Si cambia el texto, el pin anterior ya no corresponde: hay que volver a ubicar
  const escribir = (campo, texto) => {
    onCambio({ [campo]: texto, ...(campo !== "detalle" && { lat: null, lng: null }) });
    setResultados([]);
    setMensaje(null);
  };

  const elegir = (r, aproximado = false) => {
    onCambio({ lat: r.lat, lng: r.lng });
    setResultados([]);
    setMensaje(
      aproximado
        ? { tipo: "aviso", texto: "No encontramos la vía exacta; ubicamos el barrio. Arrastra el pin hasta la puerta en el mapa." }
        : { tipo: "ok", texto: "Ubicado. Si el pin no quedó en el sitio exacto, arrástralo en el mapa." },
    );
  };

  const ubicar = async () => {
    onActivar();
    if (!valor.direccion.trim() || !valor.barrio.trim()) {
      setMensaje({ tipo: "error", texto: "Escribe la dirección y el barrio o municipio para ubicarla." });
      return;
    }
    setBuscando(true);
    setMensaje(null);
    try {
      const { resultados: encontrados, aproximado } = await buscarDireccion(valor.direccion, valor.barrio);
      const validos = encontrados.filter(dentroDelValle);
      if (validos.length === 0) {
        setMensaje({ tipo: "error", texto: "No encontramos esa dirección en el Valle de Aburrá. Revisa el barrio o haz clic en el mapa." });
      } else if (validos.length === 1 || aproximado) {
        elegir(validos[0], aproximado);
      } else {
        setResultados(validos);
        setMensaje({ tipo: "aviso", texto: "Encontramos varias coincidencias, elige la correcta:" });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "El buscador no está disponible ahora. Marca el punto haciendo clic en el mapa." });
    }
    setBuscando(false);
  };

  const alPresionarEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ubicar();
    }
  };

  return (
    <div className={`sol-punto ${activo ? "sol-punto--activo" : ""}`} onClick={onActivar}>
      <div className="sol-punto-cabecera">
        <span className={`sol-punto-letra sol-punto-letra--${tipo}`}>{letra}</span>
        <strong>{titulo}</strong>
        {ubicado && <span className="sol-punto-ok">✓ En el mapa</span>}
      </div>

      <div className="sol-punto-campos">
        <input
          type="text"
          placeholder="Dirección. Ej: Calle 45 #70-20"
          value={valor.direccion}
          onChange={(e) => escribir("direccion", e.target.value)}
          onKeyDown={alPresionarEnter}
          aria-label={`Dirección de ${titulo.toLowerCase()}`}
        />
        <input
          type="text"
          placeholder="Barrio o municipio. Ej: Laureles, Bello"
          value={valor.barrio}
          onChange={(e) => escribir("barrio", e.target.value)}
          onKeyDown={alPresionarEnter}
          aria-label={`Barrio de ${titulo.toLowerCase()}`}
        />
        <input
          type="text"
          placeholder="Apto, torre o referencia (opcional)"
          value={valor.detalle}
          onChange={(e) => escribir("detalle", e.target.value)}
          aria-label={`Detalle de ${titulo.toLowerCase()}`}
        />
        <button type="button" className="sol-btn sol-btn--sec sol-btn--chico" onClick={ubicar} disabled={buscando}>
          {buscando ? "Buscando..." : "📍 Ubicar en el mapa"}
        </button>
      </div>

      {mensaje && <p className={`sol-punto-msg sol-punto-msg--${mensaje.tipo}`}>{mensaje.texto}</p>}

      {resultados.length > 0 && (
        <ul className="sol-resultados">
          {resultados.map((r) => (
            <li key={`${r.lat},${r.lng}`}>
              <button type="button" onClick={() => elegir(r)}>
                📍 {r.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <span className="sol-error-msg">{error}</span>}
    </div>
  );
}

export default BuscadorDireccion;
