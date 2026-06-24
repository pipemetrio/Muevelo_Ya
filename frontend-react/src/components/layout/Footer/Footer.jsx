import "./Footer.css";
import logo from "../../../assets/images/MY_logo.png";
import letras from "../../../assets/images/Letras.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Columna 1 — Logo y descripción */}
        <div className="footer-col footer-col--brand">
          <div className="footer-logo">
            <img src={logo} alt="Logo MueveloYa" className="footer-logo-img" />
            <img src={letras} alt="MueveloYa" className="footer-logo-text" />
          </div>
          <p className="footer-desc">
            Conectamos personas que necesitan transportar objetos con
            conductores confiables de manera rápida y segura.
          </p>
        </div>

        {/* Columna 2 — Navegación */}
        <div className="footer-col">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li>
              <a href="#inicio">Inicio</a>
            </li>
            <li>
              <a href="#servicios">Servicios</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
          </ul>
        </div>

        {/* Columna 3 — Contacto */}
        <div className="footer-col">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-links">
            <li>
              <span>📧</span> contacto@mueveloya.com
            </li>
            <li>
              <span>📞</span> +57 300 000 0000
            </li>
            <li>
              <span>📍</span> Medellín, Colombia
            </li>
          </ul>
        </div>

        {/* Columna 4 — Redes sociales */}
        <div className="footer-col">
          <h4 className="footer-heading">Síguenos</h4>
          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="Instagram">
              📸
            </a>
            <a href="#" className="social-btn" aria-label="Facebook">
              👍
            </a>
            <a href="#" className="social-btn" aria-label="WhatsApp">
              💬
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 <span className="footer-brand">Muévelo Ya</span>. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
