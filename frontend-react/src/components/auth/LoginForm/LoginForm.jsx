import "./LoginForm.css";
import logo from "../../../assets/images/MY_logo.png";
import letras from "../../../assets/images/Letras.png";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  return (
    <div className="login-page">

      {/* Panel izquierdo — decorativo */}
      <div className="login-left">
        <div className="login-left-content">

          <div className="login-logo">
            <img src={logo} alt="Logo" className="login-logo-img" />
            <img src={letras} alt="Muévelo Ya" className="login-logo-text" />
          </div>

          <h2>Mueve lo que necesitas,<br /><span>cuando lo necesitas.</span></h2>
          <p>Conectamos personas con conductores confiables de manera rápida y segura.</p>
          <div className="login-stats">
            <div className="login-stat">
              <strong>+5,000</strong>
              <span>Usuarios</span>
            </div>
            <div className="login-stat">
              <strong>+12,000</strong>
              <span>Trasteos</span>
            </div>
            <div className="login-stat">
              <strong>4.8 ★</strong>
              <span>Calificación</span>
            </div>
          </div>
        </div>
        <div className="login-dots-tl"></div>
        <div className="login-dots-br"></div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-right">
        <div className="login-box">

          <h1>Bienvenido de nuevo</h1>
          <p className="login-subtitle">Ingresa tus datos para continuar</p>

          <div className="login-form">

            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" placeholder="tucorreo@email.com" />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••" />
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="login-btn" onClick={() => navigate("/perfil")}>
              Iniciar Sesión
            </button>

            <p className="login-register">
              ¿No tienes cuenta? <a href="/register">Regístrate gratis</a>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginForm;