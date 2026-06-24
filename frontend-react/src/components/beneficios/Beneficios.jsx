import "./Beneficios.css"

function Beneficios() {
  return (
    <section className="benefits">
      <h2>¿Por qué elegir <span className="benefits-highlight">Muévelo Ya?</span></h2>

      <div className="benefits-grid">

        <div className="benefit-card">
          <div className="benefit-icon">🛡️</div>
          <h3>Protección de bienes</h3>
          <p>
            Protegemos tus pertenencias durante el traslado para que
            tengas tranquilidad en cada movimiento.
          </p>
        </div>

        <div className="benefit-card benefit-card--featured">
          <div className="benefit-icon">⏱️</div>
          <h3>Seguimiento en tiempo real</h3>
          <p>
            Mantente informado sobre el estado de tu servicio y el
            progreso del transporte.
          </p>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon">👥</div>
          <h3>Conductores verificados</h3>
          <p>
            Trabajamos con conductores registrados y verificados para
            brindarte mayor confianza y seguridad.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Beneficios;