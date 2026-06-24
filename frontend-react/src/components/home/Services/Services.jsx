import "./Services.css";

const servicios = [
  {
    icon: "🏠",
    tag: "Más solicitado",
    title: "Trasteos",
    desc: "Mudamos tus muebles y pertenencias de un lugar a otro con cuidado, puntualidad y conductores verificados.",
    items: ["Carga y descarga incluida", "Embalaje básico", "Seguro de trayecto"],
  },
  {
    icon: "📦",
    tag: "Rápido y seguro",
    title: "Envíos",
    desc: "Envía paquetes o mercancía a cualquier punto de la ciudad el mismo día que lo solicitas.",
    items: ["Atención ágil", "Seguimiento en tiempo real", "Confirmación de recibido y entregado"],
  },
  {
    icon: "🚚",
    tag: "Hogares y empresas",
    title: "Mudanzas",
    desc: "Servicio completo para mudanzas residenciales y corporativas. Nos encargamos de todo el proceso.",
    items: ["Desmonte y montaje", "Transporte de gran volumen", "Coordinación total"],
  }
];

function Servicios() {
  return (
    <section className="servicios">

      <div className="servicios-header">
        <span className="servicios-eyebrow">¿Nuestra misión?</span>
        <p>Brindar soluciones de transporte para cada necesidad, con conductores confiables y atención 24/7.</p>

        <h2>Nuestros <span className="servicios-highlight">Servicios</span></h2>
      </div>

      <div className="servicios-grid">
        {servicios.map((s, i) => (
          <div className="servicio-card" key={i}>
            <div className="servicio-top">
              <span className="servicio-icon">{s.icon}</span>
              <span className="servicio-tag">{s.tag}</span>
            </div>
            <h3>{s.title}</h3>
            <p className="servicio-desc">{s.desc}</p>
            <ul className="servicio-items">
              {s.items.map((item, j) => (
                <li key={j}><span className="servicio-check">✦</span>{item}</li>
              ))}
            </ul>
            <button className="servicio-btn">Solicitar {s.title}</button>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Servicios;