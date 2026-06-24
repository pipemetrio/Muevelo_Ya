import { Link } from "react-router-dom";

import "./Navbar.css";
import logo from "../../../assets/images/MY_logo.png";
import letras from "../../../assets/images/Letras.png";

function Navbar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/home">
          <img src={logo} alt="Logo MueveloYa" className="logo" />
        </Link>
        <div className="brand-name">
          <img src={letras} alt="MueveloYa" />
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <button
            className="nav-link"
            onClick={() => scrollTo("inicio")}>
            Inicio
          </button>
        </li>
        <li>
          <button className="nav-link" onClick={() => scrollTo("beneficios")}>
            Beneficios
          </button>
        </li>
        <li>
          <button className="nav-link" onClick={() => scrollTo("servicios")}>
            Servicios
          </button>
        </li>
        <li>
          <button className="nav-link" onClick={() => scrollTo("contacto")}>
            Contacto
          </button>
        </li>
      </ul>

      <Link to="/login" className="login-link">
        <span className="login-icon">👤</span>
        Iniciar Sesión
      </Link>
    </nav>
  );
}

export default Navbar;
