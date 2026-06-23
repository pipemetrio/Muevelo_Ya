import "./Hero.css"
import foto from "../../assets/images/Hero.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Mueve lo que necesites, cuando lo necesites.</h1>

        <p>
          Conectamos personas que necesitan transportar objetos
          con conductores confiables de manera rápida y segura.
        </p>

        <div className="hero-button">
          <button className="primary-btn">
            Solicitar Trasteo
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src={foto} alt="Imagen hero"/>
      </div>
    </section>
  );
}

export default Hero;