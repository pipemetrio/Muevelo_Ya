import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/MY_logo.png";
import letras from "../../../assets/images/Letras.png";

function RegisterForm() {
  const navigate = useNavigate();

  return (
    <div className="register-page">

      {/* Panel izquierdo — negro */}
      <div className="register-left">
        <div className="register-left-content">

          <div className="register-logo">
            <img src={logo} alt="Logo" className="register-logo-img" />
            <img src={letras} alt="Muévelo Ya" className="register-logo-text" />
          </div>

          <h2>Únete a la comunidad<br /><span>Muévelo Ya</span></h2>
          <p>Crea tu cuenta gratis y empieza a mover lo que necesitas con conductores confiables.</p>

          <div className="register-stats">
            <div className="register-stat">
              <strong>+5,000</strong>
              <span>Usuarios</span>
            </div>
            <div className="register-stat">
              <strong>+12,000</strong>
              <span>Trasteos</span>
            </div>
            <div className="register-stat">
              <strong>4.8 ★</strong>
              <span>Calificación</span>
            </div>
          </div>

        </div>
        <div className="register-dots-tl"></div>
        <div className="register-dots-br"></div>
      </div>

      {/* Panel derecho — amarillo */}
      <div className="register-right">
        <div className="register-box">

          <h1>Crear cuenta</h1>
          <p className="register-subtitle">Completa tus datos para registrarte</p>

          <div className="register-form">

            {/* Primer nombre + Segundo nombre (opcional) */}
            <div className="register-row">
              <div className="form-group">
                <label>Primer nombre</label>
                <input type="text" placeholder="Juan" />
              </div>
              <div className="form-group">
                <label>
                  Segundo nombre
                  <span className="label-optional"> (opcional)</span>
                </label>
                <input type="text" placeholder="Carlos" />
              </div>
            </div>

            {/* Primer apellido + Segundo apellido (opcional) */}
            <div className="register-row">
              <div className="form-group">
                <label>Primer apellido</label>
                <input type="text" placeholder="Pérez" />
              </div>
              <div className="form-group">
                <label>
                  Segundo apellido
                  <span className="label-optional"> (opcional)</span>
                </label>
                <input type="text" placeholder="García" />
              </div>
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" placeholder="tucorreo@email.com" />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" placeholder="+57 300 000 0000" />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button className="register-btn" onClick={() => navigate("/login")}>
              Crear cuenta
            </button>

            <p className="register-login">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

export default RegisterForm;