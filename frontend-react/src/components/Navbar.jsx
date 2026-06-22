import "./styles.css"
import logo from "../assets/images/MY_logo.png";
import letras from "../assets/images/Letras.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <a href="/">
          <img src={logo} alt="Logo MueveloYa" className="logo" />
        </a>

        <div className="brand-name">
          <img src={letras} alt="MueveloYa" />
        </div>
      </div>

      <a href="/login" className="login-link">
        Iniciar Sesión
      </a>
    </nav>
  );
}

export default Navbar;