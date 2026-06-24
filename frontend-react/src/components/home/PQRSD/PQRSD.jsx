import { useState } from "react";
import "./PQRSD.css";

const categorias = [
    { id: "peticion", label: "Petición", icon: "📌", desc: "Solicita atención o información sobre un derecho o servicio." },
    { id: "queja", label: "Queja", icon: "⚠️", desc: "Reporta una falla o inconformidad con nuestro servicio." },
    { id: "reclamo", label: "Reclamo", icon: "📣", desc: "Exige solución a una situación que te afectó directamente." },
    { id: "solicitud", label: "Solicitud", icon: "📋", desc: "Pide un trámite, certificado o gestión específica." },
    { id: "duda", label: "Duda", icon: "❓", desc: "Consulta sobre nuestros servicios, tarifas o procesos." },
];

function PQRSD() {
    const [categoriaActiva, setCategoriaActiva] = useState(null);
    const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [radicado, setRadicado] = useState("");

    const validar = () => {
        const e = {};
        if (!categoriaActiva) e.categoria = "Seleccioná el tipo de solicitud antes de continuar.";
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
        if (!form.email.trim()) {
            e.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "Ingresá un correo electrónico válido.";
        }
        if (form.telefono && !/^\d{7,15}$/.test(form.telefono.replace(/[\s\-]/g, ""))) {
            e.telefono = "Ingresá un número de teléfono válido (7 a 15 dígitos).";
        }
        if (!form.mensaje.trim()) {
            e.mensaje = "El mensaje es obligatorio.";
        } else if (form.mensaje.trim().length < 20) {
            e.mensaje = "Por favor describí tu solicitud con al menos 20 caracteres.";
        }
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
    };

    const seleccionarCategoria = (id) => {
        setCategoriaActiva(id);
        if (errores.categoria) setErrores((prev) => ({ ...prev, categoria: "" }));
    };

    const handleSubmit = async () => {
        const nuevosErrores = validar();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        setEnviando(true);
        await new Promise((r) => setTimeout(r, 2000));
        const numero = "MY-" + Date.now().toString().slice(-7);
        setRadicado(numero);
        setEnviando(false);
        setEnviado(true);
    };

    const handleReset = () => {
        setEnviado(false);
        setCategoriaActiva(null);
        setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
        setErrores({});
        setRadicado("");
    };

    const categoriaLabel =
        categorias.find((c) => c.id === categoriaActiva)?.label?.toLowerCase() || "solicitud";

    if (enviado) {
        return (
            <section className="pqrsd" id="pqrsd">
                <div className="pqrsd-success">
                    <div className="success-check">✓</div>
                    <h2 className="success-title">¡Solicitud enviada con éxito!</h2>
                    <p className="success-desc">Tu {categoriaLabel} fue registrada correctamente en nuestro sistema.</p>
                    <div className="radicado-box">
                        <span className="radicado-label">Número de radicado</span>
                        <strong className="radicado-numero">{radicado}</strong>
                        <span className="radicado-hint">Guardá este número para hacerle seguimiento a tu solicitud.</span>
                    </div>
                    <p className="success-tiempo">
                        Nos comunicaremos contigo en un plazo de <strong>5 días hábiles</strong> al correo <strong>{form.email}</strong>.
                    </p>
                    <button className="pqrsd-btn" onClick={handleReset}>Enviar otra solicitud</button>
                </div>
            </section>
        );
    }

    return (
        <section className="pqrsd" id="pqrsd">
            <div className="pqrsd-header">
                <p className="pqrsd-eyebrow">Atención al usuario</p>
                <h2 className="pqrsd-titulo">PQRSD</h2>
                <p className="pqrsd-subtitulo">Peticiones · Quejas · Reclamos · Solicitudes · Dudas</p>
                <p className="pqrsd-descripcion">
                    Tu voz es parte de nuestro servicio. Contanos cómo podemos mejorar tu experiencia con Muévelo Ya.
                </p>
            </div>

            <div className="pqrsd-categorias">
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        className={`cat-btn ${categoriaActiva === cat.id ? "cat-btn--activa" : ""}`}
                        onClick={() => seleccionarCategoria(cat.id)}
                        type="button"
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-label">{cat.label}</span>
                        <span className="cat-desc">{cat.desc}</span>
                    </button>
                ))}
            </div>
            {errores.categoria && <p className="error-global">⚠ {errores.categoria}</p>}

            <div className="pqrsd-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo <span className="req">*</span></label>
                        <input
                            id="nombre" name="nombre" type="text"
                            placeholder="Tu nombre completo"
                            value={form.nombre} onChange={handleChange}
                            className={errores.nombre ? "input-error" : ""}
                            autoComplete="name"
                        />
                        {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico <span className="req">*</span></label>
                        <input
                            id="email" name="email" type="email"
                            placeholder="tucorreo@ejemplo.com"
                            value={form.email} onChange={handleChange}
                            className={errores.email ? "input-error" : ""}
                            autoComplete="email"
                        />
                        {errores.email && <span className="error-msg">{errores.email}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono de contacto <span className="opcional">(opcional)</span></label>
                    <input
                        id="telefono" name="telefono" type="tel"
                        placeholder="Ej: 3001234567"
                        value={form.telefono} onChange={handleChange}
                        className={errores.telefono ? "input-error" : ""}
                        autoComplete="tel"
                    />
                    {errores.telefono && <span className="error-msg">{errores.telefono}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="mensaje">
                        Describe tu {categoriaLabel} <span className="req">*</span>
                        <span className={`char-count ${form.mensaje.length > 450 ? "char-count--limite" : ""}`}>
                            {form.mensaje.length}/500
                        </span>
                    </label>
                    <textarea
                        id="mensaje" name="mensaje" rows={5} maxLength={500}
                        placeholder="Contanos detalladamente qué ocurrió, cuándo fue y cómo podemos ayudarte..."
                        value={form.mensaje} onChange={handleChange}
                        className={errores.mensaje ? "input-error" : ""}
                    />
                    {errores.mensaje && <span className="error-msg">{errores.mensaje}</span>}
                </div>

                <div className="form-footer">
                    <p className="form-aviso">
                        <span>🔒</span> Tu información es tratada de forma confidencial según nuestra política de privacidad.
                    </p>
                    <button
                        className={`pqrsd-btn ${enviando ? "pqrsd-btn--loading" : ""}`}
                        onClick={handleSubmit} disabled={enviando} type="button"
                    >
                        {enviando ? (<><span className="spinner" /> Enviando...</>) : ("Enviar solicitud →")}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default PQRSD;