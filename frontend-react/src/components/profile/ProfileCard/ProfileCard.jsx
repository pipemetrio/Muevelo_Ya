import "./ProfileCard.css";
import { useNavigate } from "react-router-dom";

const user = {
  primerNombre: "Carlos",
  segundoNombre: "Andrés",
  primerApellido: "Ramírez",
  segundoApellido: "Torres",
  correo: "carlos.ramirez@email.com",
  telefono: "+57 314 852 9063",
  rol: "Cliente",
  fechaRegistro: "Marzo 2024",
  trasteos: 8,
  calificacion: 4.9,
  estado: "Activo",
};

const initials = `${user.primerNombre[0]}${user.primerApellido[0]}`;
const fullName = [
  user.primerNombre,
  user.segundoNombre,
  user.primerApellido,
  user.segundoApellido,
].filter(Boolean).join(" ");

export default function ProfileCard() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">

      {/* Encabezado superior */}
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-header-info">
          <h1 className="profile-name">{fullName}</h1>
          <div className="profile-badges">
            <span className="badge badge-rol">{user.rol}</span>
            <span className="badge badge-estado">{user.estado}</span>
          </div>
          <p className="profile-since">
            Miembro desde {user.fechaRegistro}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-value">{user.trasteos}</span>
          <span className="stat-label">Trasteos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user.calificacion} ★</span>
          <span className="stat-label">Calificación</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">0</span>
          <span className="stat-label">En curso</span>
        </div>
      </div>

      {/* Información personal */}
      <div className="profile-section">
        <h2 className="section-title">Información personal</h2>
        <div className="profile-grid">

          <div className="profile-field">
            <span className="field-label">Primer nombre</span>
            <span className="field-value">{user.primerNombre}</span>
          </div>

          <div className="profile-field">
            <span className="field-label">Segundo nombre</span>
            <span className="field-value">
              {user.segundoNombre || <span className="field-empty">—</span>}
            </span>
          </div>

          <div className="profile-field">
            <span className="field-label">Primer apellido</span>
            <span className="field-value">{user.primerApellido}</span>
          </div>

          <div className="profile-field">
            <span className="field-label">Segundo apellido</span>
            <span className="field-value">
              {user.segundoApellido || <span className="field-empty">—</span>}
            </span>
          </div>

          <div className="profile-field full-width">
            <span className="field-label">Correo electrónico</span>
            <span className="field-value">{user.correo}</span>
          </div>

          <div className="profile-field full-width">
            <span className="field-label">Teléfono</span>
            <span className="field-value">{user.telefono}</span>
          </div>

        </div>
      </div>

      {/* Botón editar */}
      <div className="profile-actions">
        <button className="btn-home" onClick={() => navigate("/home")}>← Ir al inicio</button>
        <button className="btn-edit">Editar perfil</button>
        <button className="btn-password">Cambiar contraseña</button>
      </div>

    </div>
  );
}