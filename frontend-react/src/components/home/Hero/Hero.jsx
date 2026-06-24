import "./Hero.css";
import foto from "../../../assets/images/Hero.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-dots-top"></div>

        <div className="hero-content">
          <h1>
            Mueve lo que necesites,{" "}
            <span className="hero-highlight">cuando lo necesites.</span>
          </h1>

          <p>
            Conectamos personas que necesitan transportar objetos con
            conductores confiables de manera rápida y segura.
          </p>

          <button className="hero-button">Solicitar Mudanza</button>

          <div className="hero-features">
            <div className="feature">
              <span>♦</span>
              <p>Seguro y confiable</p>
            </div>
            <div className="feature">
              <span>♦</span>
              <p>Entregas rápidas</p>
            </div>
            <div className="feature">
              <span>♦</span>
              <p>Cobertura en tu ciudad</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-wrapper">
          <div className="hero-image-frame">
            <img src={foto} alt="Imagen Hero" />
          </div>
        </div>

        <div className="hero-dots-bottom"></div>
      </div>
    </section>
  );
}

export default Hero;
