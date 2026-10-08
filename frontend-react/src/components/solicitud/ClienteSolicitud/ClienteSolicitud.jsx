import { useState } from "react";
import MapaRuta from "../MapaRuta/MapaRuta";
import BuscadorDireccion from "../BuscadorDireccion/BuscadorDireccion";
import { dentroDelValle, distanciaVial, direccionDePunto } from "../../../data/medellin";
import { SERVICIOS, EXTRAS, MAX_AYUDANTES, calcularPrecio, formatoCOP } from "../../../data/tarifas";
import { crearSolicitud, formatoFecha } from "../../../data/solicitudes";
import "../Solicitud.css";

const PASOS = ["Servicio", "Ruta", "Fecha", "Detalles", "Confirmar"];

// "YYYY-MM-DDTHH:mm" en hora local (formato de <input type="datetime-local">)
const aInputLocal = (fecha) => {
  const d = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 16);
};

const horasDesdeAhora = (h) => new Date(Date.now() + h * 3600000);

const PUNTO_VACIO = { direccion: "", barrio: "", detalle: "", lat: null, lng: null };

// { lat, lng } si el punto ya está ubicado en el mapa
const coords = (p) => (p.lat != null ? { lat: p.lat, lng: p.lng } : null);

// Texto completo que verá el transportista
const direccionCompleta = (p) =>
  `${p.direccion.trim()}, ${p.barrio.trim()}${p.detalle.trim() ? ` (${p.detalle.trim()})` : ""}`;

const FORM_INICIAL = (servicio) => ({
  servicio: SERVICIOS[servicio] ? servicio : "",
  origen: PUNTO_VACIO,
  destino: PUNTO_VACIO,
  modalidad: "inmediato",
  fechaProgramada: "",
  descripcion: "",
  ayudantes: 0,
  embalaje: false,
  pisos: 0,
  cliente: "",
  telefono: "",
});

function ClienteSolicitud({ servicioInicial, onCreada }) {
  const [paso, setPaso] = useState(SERVICIOS[servicioInicial] ? 1 : 0);
  const [form, setForm] = useState(() => FORM_INICIAL(servicioInicial));
  const [puntoActivo, setPuntoActivo] = useState("origen");
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const set = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: "" }));
  };

  const servicio = SERVICIOS[form.servicio];
  const origen = coords(form.origen);
  const destino = coords(form.destino);
  const km = origen && destino ? distanciaVial(origen, destino) : 0;
  const precio = calcularPrecio({ ...form, km });

  // ---------- Mapa ----------
  const cambiarPunto = (tipo, campos) => {
    setForm((f) => ({ ...f, [tipo]: { ...f[tipo], ...campos } }));
    setErrores((e) => ({ ...e, [tipo]: "" }));
  };

  // Clic en el mapa: ubica el punto activo; si no tiene dirección escrita, la sugiere
  const clicEnMapa = async (punto) => {
    if (!dentroDelValle(punto)) {
      setAviso("Por ahora solo operamos en Medellín y el Valle de Aburrá.");
      return;
    }
    setAviso("");
    const tipo = puntoActivo;
    const teniaDireccion = form[tipo].direccion.trim();
    cambiarPunto(tipo, punto);
    if (tipo === "origen" && !destino) setPuntoActivo("destino");
    if (teniaDireccion) return;

    const sugerida = await direccionDePunto(punto);
    setForm((f) =>
      f[tipo].lat === punto.lat && f[tipo].lng === punto.lng && !f[tipo].direccion
        ? { ...f, [tipo]: { ...f[tipo], ...sugerida } }
        : f,
    );
  };

  // Pin arrastrado: solo se corrige la ubicación, la dirección escrita se conserva
  const moverPin = (tipo, punto) => {
    if (!dentroDelValle(punto)) {
      setAviso("Por ahora solo operamos en Medellín y el Valle de Aburrá.");
      return;
    }
    setAviso("");
    cambiarPunto(tipo, punto);
  };

  // ---------- Validación por paso ----------
  const validarPaso = (p) => {
    const e = {};
    if (p === 0 && !form.servicio) e.servicio = "Selecciona el tipo de servicio.";
    if (p === 1) {
      for (const tipo of ["origen", "destino"]) {
        const punto = form[tipo];
        if (!punto.direccion.trim()) e[tipo] = "Escribe la dirección.";
        else if (!punto.barrio.trim()) e[tipo] = "Escribe el barrio o municipio.";
        else if (punto.lat == null) e[tipo] = "Ubica la dirección en el mapa (botón Ubicar) o marca el punto con un clic.";
      }
      if (!e.origen && !e.destino && km < 0.3)
        e.destino = "El destino debe estar a más de 300 m del origen.";
    }
    if (p === 2 && form.modalidad === "programado") {
      const f = new Date(form.fechaProgramada);
      if (!form.fechaProgramada) e.fechaProgramada = "Selecciona fecha y hora.";
      else if (f < horasDesdeAhora(1))
        e.fechaProgramada = "Programa el servicio con al menos 1 hora de anticipación.";
      else if (f > horasDesdeAhora(24 * 30))
        e.fechaProgramada = "Solo puedes programar hasta 30 días adelante.";
    }
    if (p === 3) {
      if (form.descripcion.trim().length < 5) e.descripcion = "Describe brevemente qué vamos a transportar.";
      if (!form.cliente.trim()) e.cliente = "Ingresa tu nombre.";
      if (!/^\d{7,15}$/.test(form.telefono.replace(/[\s\-+]/g, "")))
        e.telefono = "Ingresa un teléfono válido (7 a 15 dígitos).";
    }
    return e;
  };

  const siguiente = () => {
    const e = validarPaso(paso);
    if (Object.keys(e).length) {
      setErrores(e);
      return;
    }
    setErrores({});
    setPaso((p) => p + 1);
  };

  const confirmar = async () => {
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200));
    const nueva = crearSolicitud({
      cliente: form.cliente.trim(),
      telefono: form.telefono.trim(),
      servicio: form.servicio,
      origen: { ...origen, direccion: direccionCompleta(form.origen) },
      destino: { ...destino, direccion: direccionCompleta(form.destino) },
      km,
      modalidad: form.modalidad,
      fecha:
        form.modalidad === "programado"
          ? new Date(form.fechaProgramada).toISOString()
          : new Date().toISOString(),
      descripcion: form.descripcion.trim(),
      ayudantes: form.ayudantes,
      embalaje: form.embalaje,
      pisos: form.pisos,
      total: precio.total,
    });
    setEnviando(false);
    onCreada(nueva.id);
  };

  return (
    <div className="sol-card">
      {/* Indicador de pasos */}
      <ol className="sol-pasos">
        {PASOS.map((nombre, i) => (
          <li
            key={nombre}
            className={`sol-paso ${i === paso ? "sol-paso--activo" : ""} ${i < paso ? "sol-paso--hecho" : ""}`}
          >
            <span className="sol-paso-num">{i < paso ? "✓" : i + 1}</span>
            <span className="sol-paso-nombre">{nombre}</span>
          </li>
        ))}
      </ol>

      {/* PASO 1 — Servicio */}
      {paso === 0 && (
        <div className="sol-seccion">
          <h3 className="sol-titulo">¿Qué necesitas mover?</h3>
          <div className="sol-servicios">
            {Object.values(SERVICIOS).map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sol-servicio ${form.servicio === s.id ? "sol-servicio--activo" : ""}`}
                onClick={() => set("servicio", s.id)}
              >
                <span className="sol-servicio-icon">{s.icon}</span>
                <strong>{s.nombre}</strong>
                <span className="sol-servicio-desc">{s.desc}</span>
                <span className="sol-servicio-meta">
                  {s.vehiculo} · {s.ayudantesIncluidos ? `${s.ayudantesIncluidos} ayudante(s) incluido(s)` : "Sin ayudante"}
                </span>
                <span className="sol-servicio-precio">
                  Desde {formatoCOP(s.minimo)}
                  <small> · según distancia</small>
                </span>
              </button>
            ))}
          </div>
          {errores.servicio && <p className="sol-error">⚠ {errores.servicio}</p>}
        </div>
      )}

      {/* PASO 2 — Ruta: dirección escrita + confirmación en el mapa */}
      {paso === 1 && (
        <div className="sol-seccion">
          <h3 className="sol-titulo">¿Dónde recogemos y a dónde lo llevamos?</h3>
          <p className="sol-ayuda">
            Escribe cada dirección con su barrio y presiona <strong>Ubicar en el mapa</strong>. Revisa que el pin quede en
            el sitio correcto; si no, arrástralo o haz clic en el mapa.
          </p>

          <div className="sol-puntos">
            {[
              { tipo: "origen", letra: "A", titulo: "Recogida" },
              { tipo: "destino", letra: "B", titulo: "Entrega" },
            ].map(({ tipo, letra, titulo }) => (
              <BuscadorDireccion
                key={tipo}
                tipo={tipo}
                letra={letra}
                titulo={titulo}
                valor={form[tipo]}
                activo={puntoActivo === tipo}
                onActivar={() => setPuntoActivo(tipo)}
                onCambio={(campos) => cambiarPunto(tipo, campos)}
                error={errores[tipo]}
              />
            ))}
          </div>

          {aviso && <p className="sol-error">⚠ {aviso}</p>}

          <MapaRuta origen={origen} destino={destino} onSelect={clicEnMapa} onMove={moverPin} />
          <p className="sol-ayuda">
            Un clic en el mapa ubica <strong>{puntoActivo === "origen" ? "A (recogida)" : "B (entrega)"}</strong>. Los
            pines se pueden arrastrar.
          </p>

          {km > 0 && (
            <p className="sol-distancia">
              Recorrido estimado: <strong>≈ {km} km</strong> por vía
            </p>
          )}
        </div>
      )}

      {/* PASO 3 — Inmediato o programado */}
      {paso === 2 && (
        <div className="sol-seccion">
          <h3 className="sol-titulo">¿Cuándo lo necesitas?</h3>
          <div className="sol-modalidades">
            <button
              type="button"
              className={`sol-modalidad ${form.modalidad === "inmediato" ? "sol-modalidad--activa" : ""}`}
              onClick={() => set("modalidad", "inmediato")}
            >
              <span className="sol-modalidad-icon">⚡</span>
              <strong>Ahora mismo</strong>
              <span>Buscamos un transportista disponible cerca de ti.</span>
            </button>
            <button
              type="button"
              className={`sol-modalidad ${form.modalidad === "programado" ? "sol-modalidad--activa" : ""}`}
              onClick={() => set("modalidad", "programado")}
            >
              <span className="sol-modalidad-icon">📅</span>
              <strong>Programar</strong>
              <span>Elige el día y la hora (hasta 30 días).</span>
            </button>
          </div>

          {form.modalidad === "programado" && (
            <div className="sol-group">
              <label htmlFor="fechaProgramada">Fecha y hora del servicio</label>
              <input
                id="fechaProgramada"
                type="datetime-local"
                min={aInputLocal(horasDesdeAhora(1))}
                max={aInputLocal(horasDesdeAhora(24 * 30))}
                value={form.fechaProgramada}
                onChange={(e) => set("fechaProgramada", e.target.value)}
                className={errores.fechaProgramada ? "sol-input-error" : ""}
              />
              {errores.fechaProgramada && <span className="sol-error-msg">{errores.fechaProgramada}</span>}
            </div>
          )}
        </div>
      )}

      {/* PASO 4 — Detalles y extras */}
      {paso === 3 && (
        <div className="sol-seccion">
          <h3 className="sol-titulo">Detalles del {servicio.nombre.toLowerCase()}</h3>

          <div className="sol-group">
            <label htmlFor="descripcion">¿Qué vamos a transportar?</label>
            <textarea
              id="descripcion"
              rows={3}
              maxLength={300}
              placeholder="Ej: una nevera, una cama doble y 5 cajas medianas."
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              className={errores.descripcion ? "sol-input-error" : ""}
            />
            {errores.descripcion && <span className="sol-error-msg">{errores.descripcion}</span>}
          </div>

          <div className="sol-extras">
            <div className="sol-extra">
              <div>
                <strong>Ayudantes adicionales</strong>
                <span>
                  {servicio.ayudantesIncluidos} incluido(s) · +{formatoCOP(EXTRAS.ayudante)} c/u
                </span>
              </div>
              <div className="sol-contador">
                <button type="button" onClick={() => set("ayudantes", Math.max(0, form.ayudantes - 1))}>−</button>
                <span>{form.ayudantes}</span>
                <button type="button" onClick={() => set("ayudantes", Math.min(MAX_AYUDANTES, form.ayudantes + 1))}>+</button>
              </div>
            </div>

            <div className="sol-extra">
              <div>
                <strong>Pisos por escaleras</strong>
                <span>Suma origen + destino sin ascensor · +{formatoCOP(EXTRAS.piso)} c/u</span>
              </div>
              <div className="sol-contador">
                <button type="button" onClick={() => set("pisos", Math.max(0, form.pisos - 1))}>−</button>
                <span>{form.pisos}</span>
                <button type="button" onClick={() => set("pisos", Math.min(20, form.pisos + 1))}>+</button>
              </div>
            </div>

            <label className="sol-extra sol-extra--check">
              <div>
                <strong>Embalaje básico</strong>
                <span>Plástico y cartón para proteger tus cosas · +{formatoCOP(EXTRAS.embalaje)}</span>
              </div>
              <input type="checkbox" checked={form.embalaje} onChange={(e) => set("embalaje", e.target.checked)} />
            </label>
          </div>

          <div className="sol-row">
            <div className="sol-group">
              <label htmlFor="cliente">Nombre de quien entrega</label>
              <input
                id="cliente"
                type="text"
                placeholder="Tu nombre"
                value={form.cliente}
                onChange={(e) => set("cliente", e.target.value)}
                className={errores.cliente ? "sol-input-error" : ""}
              />
              {errores.cliente && <span className="sol-error-msg">{errores.cliente}</span>}
            </div>
            <div className="sol-group">
              <label htmlFor="telefono">Teléfono de contacto</label>
              <input
                id="telefono"
                type="tel"
                placeholder="300 000 0000"
                value={form.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                className={errores.telefono ? "sol-input-error" : ""}
              />
              {errores.telefono && <span className="sol-error-msg">{errores.telefono}</span>}
            </div>
          </div>
        </div>
      )}

      {/* PASO 5 — Resumen */}
      {paso === 4 && (
        <div className="sol-seccion">
          <h3 className="sol-titulo">Revisa y confirma</h3>
          <div className="sol-resumen">
            <div className="sol-resumen-datos">
              <p><span>Servicio</span>{servicio.icon} {servicio.nombre} · {servicio.vehiculo}</p>
              <p><span>Recogida (A)</span>{direccionCompleta(form.origen)}</p>
              <p><span>Entrega (B)</span>{direccionCompleta(form.destino)}</p>
              <p><span>Recorrido</span>≈ {km} km por vía</p>
              <p>
                <span>Cuándo</span>
                {form.modalidad === "inmediato" ? "⚡ Lo antes posible" : `📅 ${formatoFecha(form.fechaProgramada)}`}
              </p>
              <p><span>Carga</span>{form.descripcion}</p>
              <p><span>Contacto</span>{form.cliente} · {form.telefono}</p>
            </div>
            <MapaRuta origen={origen} destino={destino} alto={240} />
          </div>
        </div>
      )}

      {/* Precio estimado (visible desde que hay servicio) */}
      {servicio && paso > 0 && (
        <div className="sol-precio">
          <div className="sol-precio-detalle">
            {km > 0 ? (
              <span>{servicio.nombre} · ≈ {km} km por vía: {formatoCOP(precio.servicio)}</span>
            ) : (
              <span>Ubica la recogida y la entrega para calcular el valor según la distancia.</span>
            )}
            {precio.ayudantes > 0 && <span>Ayudantes adicionales: {formatoCOP(precio.ayudantes)}</span>}
            {precio.pisos > 0 && <span>Escaleras: {formatoCOP(precio.pisos)}</span>}
            {precio.embalaje > 0 && <span>Embalaje: {formatoCOP(precio.embalaje)}</span>}
          </div>
          <div className="sol-precio-total">
            <span>{km > 0 ? "Total estimado" : "Desde"}</span>
            <strong>{formatoCOP(precio.total)}</strong>
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="sol-acciones">
        {paso > 0 && (
          <button type="button" className="sol-btn sol-btn--sec" onClick={() => setPaso((p) => p - 1)} disabled={enviando}>
            ← Atrás
          </button>
        )}
        {paso < PASOS.length - 1 ? (
          <button type="button" className="sol-btn" onClick={siguiente}>
            Continuar →
          </button>
        ) : (
          <button type="button" className="sol-btn" onClick={confirmar} disabled={enviando}>
            {enviando ? (<><span className="sol-spinner" /> Enviando...</>) : form.modalidad === "inmediato" ? "Solicitar ahora" : "Programar servicio"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ClienteSolicitud;
