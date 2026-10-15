<div align="center">

<img src="frontend-react/public/MY_logo.png" alt="Logo de Muévelo Ya" width="110">

**Muévelo Ya: Plataforma Web para la Solicitud de Servicios de Acarreo en Medellín**

Andrés Felipe Vargas Metrio, Sebastián Ramírez Castrillón, Sergio Andrés López Sepúlveda,
Joel Andrés Mendoza Buriticá y Juan Sebastián Ramírez Velez

Servicio Nacional de Aprendizaje (SENA)

ADSO — Ficha 3169892

Proyecto de grado

Octubre de 2026

</div>

---

## Resumen

Muévelo Ya es una plataforma web que busca conectar a personas que necesitan transportar objetos dentro de Medellín y el Valle de Aburrá con transportistas confiables. El servicio de acarreo puede solicitarse de forma inmediata o programarse para una fecha y hora específicas. Este documento describe el estado actual del proyecto: el sitio informativo, las interfaces de autenticación y perfil, el módulo de peticiones, quejas, reclamos, sugerencias y dudas (PQRSD) y una simulación completa del proceso de solicitud de un servicio, tanto desde la perspectiva del cliente como desde la del transportista. El frontend se desarrolló con React y Vite. La simulación usa mapas de OpenStreetMap para ubicar los puntos de recogida y entrega, y calcula un valor estimado del servicio a partir de la distancia. Por ahora el proyecto no tiene backend, y los datos se guardan de forma local en el navegador.

*Palabras clave:* acarreo, trasteo, transporte urbano, Medellín, aplicación web, React

## Introducción

En Medellín, contratar un acarreo, un trasteo o una mudanza suele hacerse por recomendación o por contacto directo con conductores independientes. Por eso es difícil comparar precios, confirmar la confiabilidad del transportista y saber en qué estado va el servicio. Muévelo Ya propone una plataforma que centraliza la solicitud, la asignación y el seguimiento del servicio, con tarifas estimadas de forma transparente y conductores verificados.

### Objetivo General

Desarrollar una plataforma web que permita solicitar, asignar y hacer seguimiento a servicios de acarreo en Medellín y el Valle de Aburrá, ya sea de forma inmediata o programada.

### Objetivos Específicos

1. Diseñar una interfaz web con la identidad visual de la marca que presente los servicios y beneficios de la plataforma.
2. Construir las interfaces de registro, inicio de sesión y perfil de usuario.
3. Implementar un canal de atención al usuario (PQRSD).
4. Simular el ciclo completo de un servicio de acarreo: solicitud, asignación al transportista, recogida, entrega y calificación.
5. Estimar el valor del servicio según su tipo, la distancia recorrida y los adicionales que elija el cliente.

## Estado Actual del Proyecto

La Tabla 1 resume los módulos desarrollados hasta la fecha.

**Tabla 1**

*Módulos del frontend y estado de desarrollo*

| Módulo | Ruta | Descripción | Estado |
|---|---|---|---|
| Página de inicio | `/home` | Hero, beneficios, servicios, PQRSD y pie de página. El enlace `/` redirige aquí. | Funcional |
| Inicio de sesión | `/login` | Formulario de acceso. | Solo interfaz (sin validación real) |
| Registro | `/register` | Formulario de creación de cuenta. | Solo interfaz (sin validación real) |
| Perfil de usuario | `/perfil` y `/profile` | Datos personales y estadísticas del usuario. | Solo interfaz (datos de ejemplo) |
| PQRSD | Sección de `/home` | Formulario con validaciones y número de radicado simulado. | Funcional (simulado) |
| Solicitud de servicio | `/solicitar` | Simulación del servicio para el cliente y el transportista. | Funcional (simulado) |

*Nota.* "Simulado" significa que el módulo funciona en el navegador, pero todavía no envía datos a un servidor.

### Simulación de Solicitud de Servicio

Este módulo representa el funcionamiento principal de la plataforma. Se llega a él desde el botón principal de la página de inicio, desde los botones de cada servicio y desde el enlace *Solicitar servicio* de la barra de navegación. Tiene dos vistas, que se eligen con el selector *Soy cliente* / *Soy transportista*.

#### Vista del Cliente

El cliente completa un formulario de cinco pasos:

1. **Servicio.** Elige entre envío, acarreo, trasteo o mudanza.
2. **Ruta.** Escribe la dirección y el barrio de recogida y de entrega, y las ubica en el mapa. Puede corregir el punto exacto arrastrando el marcador o haciendo clic en el mapa. Solo se aceptan puntos dentro del Valle de Aburrá.
3. **Fecha.** Elige un servicio inmediato o programado. Los programados deben pedirse con al menos una hora de anticipación y como máximo 30 días antes.
4. **Detalles.** Describe la carga, agrega adicionales (ayudantes, pisos por escaleras y embalaje) y deja sus datos de contacto.
5. **Confirmación.** Revisa el resumen y el valor estimado.

Después de confirmar, el cliente sigue el servicio en una línea de tiempo y en un mapa donde se mueve el vehículo. Al final puede calificar al transportista.

#### Vista del Transportista

El transportista ve las solicitudes disponibles, sus servicios en curso o agendados, su historial y sus ganancias (80 % del valor del servicio). Puede aceptar o liberar una solicitud y avanzar sus estados. Las dos vistas comparten la información, así que si se abren en pestañas distintas del mismo navegador se puede ver la interacción entre cliente y transportista en tiempo real. Si ningún transportista acepta la solicitud en ocho segundos, un conductor simulado la toma automáticamente.

La Tabla 2 muestra los estados por los que pasa un servicio.

**Tabla 2**

*Estados de un servicio de acarreo*

| Estado | Significado |
|---|---|
| Buscando transportista | Solicitud inmediata sin transportista asignado. |
| Programado | Solicitud con fecha futura, confirmada o pendiente de confirmación. |
| Transportista asignado | Un transportista aceptó el servicio. |
| En camino a recoger | El transportista se dirige al punto de recogida. |
| Carga recogida | La carga va hacia el punto de entrega. |
| Entregado | El servicio terminó. |
| Cancelado | El cliente canceló el servicio antes de la recogida. |

#### Estimación del Valor del Servicio

El cliente ve un único valor del servicio, que aumenta con la distancia, más los adicionales que haya elegido. La distancia por vía se estima multiplicando la distancia en línea recta entre los dos puntos por un factor de 1.4, que compensa las pendientes y el trazado vial de la ciudad. Las tarifas se calibraron con valores de referencia del mercado local que aportó el equipo: un trasteo urbano cuesta normalmente entre $150.000 y $200.000, el acarreo de una nevera parte de unos $70.000 y el acarreo de un comedor entre los barrios Santa Cruz y La Ladera cuesta cerca de $90.000. La Tabla 3 presenta los valores resultantes.

**Tabla 3**

*Valor estimado del servicio según el tipo y el recorrido (pesos colombianos)*

| Servicio | Vehículo | Valor mínimo | Santa Cruz – La Ladera (≈ 6.6 km) | Belén – Envigado (≈ 9.7 km) | El Poblado – Bello (≈ 20 km) |
|---|---|---|---|---|---|
| Envío | Moto | $15.000 | $25.000 | $31.000 | $52.000 |
| Acarreo | Carry o camioneta | $70.000 | $90.000 | $106.000 | $157.000 |
| Trasteo | Camioneta o furgón | $150.000 | $166.000 | $188.000 | $260.000 |
| Mudanza | Camión | $300.000 | $316.000 | $347.000 | $450.000 |

*Nota.* Los valores no incluyen adicionales: ayudante adicional ($30.000 cada uno), piso por escaleras ($10.000 cada uno) y embalaje ($25.000). Los parámetros de cálculo están en `frontend-react/src/data/tarifas.js`.

#### Búsqueda de Direcciones

Las direcciones se ubican con el servicio Nominatim de OpenStreetMap (OpenStreetMap Foundation, s.f.). OpenStreetMap no tiene la numeración de placas de Medellín, así que el sistema busca la vía principal dentro del barrio indicado (por ejemplo, la Calle 45 en Laureles) y le pide al usuario que confirme o corrija el punto exacto en el mapa. La dirección completa que escribe el cliente, con complementos como apartamento o torre, es la que ve el transportista. Por la política de uso de Nominatim, la búsqueda se hace solo cuando el usuario presiona *Ubicar en el mapa* y no mientras escribe.

## Arquitectura y Tecnologías

Por ahora el proyecto es una aplicación de una sola página (*single-page application*) sin backend. La Tabla 4 lista las tecnologías utilizadas.

**Tabla 4**

*Tecnologías empleadas en el frontend*

| Tecnología | Versión | Uso |
|---|---|---|
| React (Meta Open Source, s.f.) | 19.2 | Construcción de la interfaz por componentes. |
| React Router (Remix Software, s.f.) | 7 | Navegación entre páginas. |
| Vite (Vite Team, s.f.) | 8 | Servidor de desarrollo y empaquetado. |
| Leaflet (Agafonkin, 2023) | 1.9.4 | Mapas interactivos. |
| React Leaflet (Le Cam, 2024) | 5.0.0 | Integración de Leaflet con React. |
| OpenStreetMap y Nominatim (OpenStreetMap contributors, s.f.) | — | Cartografía y búsqueda de direcciones. |
| ESLint | 10 | Análisis estático del código. |

### Estructura del Proyecto

```
Muevelo_Ya/
├── README.md                        Documento actual
├── Indicaciones importantes.md      Notas iniciales del equipo
└── frontend-react/
    ├── README.md                    Convenciones del frontend
    ├── public/                      Ícono de la página
    └── src/
        ├── assets/images/           Logo, letras e imagen del hero
        ├── components/
        │   ├── auth/                LoginForm y RegisterForm
        │   ├── home/                Hero, Benefits, Services y PQRSD
        │   ├── layout/              Navbar y Footer
        │   ├── profile/             ProfileCard
        │   └── solicitud/           Formulario del cliente, buscador de direcciones,
        │                            mapa, seguimiento y panel del transportista
        ├── data/                    Tarifas, datos de Medellín y almacenamiento simulado
        ├── pages/                   Home, Login, Register, Profile y Solicitar
        ├── routes/AppRoutes.jsx     Registro de rutas
        ├── App.jsx                  Punto de arranque (solo carga las rutas)
        └── main.jsx
```

### Instalación y Ejecución

Se necesita Node.js 20 o superior y conexión a internet para cargar los mapas.

```bash
cd frontend-react
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # versión de producción en frontend-react/dist
npm run lint       # análisis estático
```

Para probar la simulación completa, abra `http://localhost:5173/solicitar` y, desde el enlace *Abrir vista transportista en otra pestaña*, abra la vista del transportista. El botón *Reiniciar simulación* del panel del transportista restablece los datos de ejemplo.

### Convenciones de Desarrollo

Las reglas completas están en [`frontend-react/README.md`](frontend-react/README.md). En resumen:

- `App.jsx` solo inicia la aplicación. Las rutas se registran en `routes/AppRoutes.jsx`.
- Las carpetas dentro de `src/` van en minúsculas y los componentes en PascalCase.
- Cada componente tiene su propia hoja de estilos en su misma carpeta.
- Cada página nueva se crea en `pages/`, se registra en `AppRoutes.jsx` y se enlaza en la barra de navegación (`Navbar.jsx`).

### Identidad Visual

El color amarillo del logo es `#FACD00`. La interfaz usa como color de acento el amarillo `#FFC107` sobre fondos oscuros (`#111111` y `#1A1A1A`).

## Limitaciones y Trabajo Futuro

1. **Backend y base de datos.** Las solicitudes se guardan en el almacenamiento local del navegador (`localStorage`). El archivo `src/data/solicitudes.js` reúne este acceso para que pueda reemplazarse por llamadas a una API.
2. **Autenticación.** El inicio de sesión y el registro todavía no validan credenciales ni crean cuentas reales.
3. **Cálculo de rutas.** La distancia por vía es una estimación. Se recomienda integrar un servicio de enrutamiento que entregue la distancia y el trayecto reales.
4. **Geocodificación.** La ubicación de direcciones con nomenclatura colombiana es aproximada y depende de que el usuario confirme el punto en el mapa.
5. **Pagos y verificación de conductores.** Están pendientes por definir e implementar.
6. **Calidad de código.** El análisis estático reporta un error menor en `PQRSD.jsx` (un carácter escapado innecesariamente en una expresión regular).

## Historial de Desarrollo

La Tabla 5 resume los hitos principales registrados en el control de versiones del repositorio.

**Tabla 5**

*Hitos de desarrollo del proyecto*

| Fecha | Hito |
|---|---|
| 20 de junio de 2026 | Creación del repositorio y de la barra de navegación con la identidad de marca. |
| 22 de junio de 2026 | Migración de la barra de navegación a React y pantalla inicial completa. |
| 23 de junio de 2026 | Rediseño del hero, la barra de navegación, los beneficios y el pie de página. Reorganización de la estructura del proyecto. |
| 24 de junio de 2026 | Interfaces de inicio de sesión, registro y perfil. Documentación de convenciones y módulo PQRSD. |
| Octubre de 2026 | Simulación de solicitud de servicio con mapa, búsqueda de direcciones, servicios inmediatos y programados, panel del transportista y estimación de valor según la distancia. |

## Equipo de Trabajo

- Andrés Felipe Vargas Metrio
- Sebastián Ramírez Castrillón
- Sergio Andrés López Sepúlveda
- [Nombre completo] (usuario de GitHub: JOELBUR10)
- [Nombre completo] (usuario de GitHub: JuansseVelez)

## Referencias

Agafonkin, V. (2023). *Leaflet* (Versión 1.9.4) [Software]. https://leafletjs.com

American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7.ª ed.). https://doi.org/10.1037/0000165-000

Le Cam, P. (2024). *React Leaflet* (Versión 5.0.0) [Software]. https://react-leaflet.js.org

Meta Open Source. (s.f.). *React* (Versión 19.2) [Software]. https://react.dev

OpenStreetMap contributors. (s.f.). *OpenStreetMap* [Base de datos geográfica]. OpenStreetMap Foundation. https://www.openstreetmap.org

OpenStreetMap Foundation. (s.f.). *Nominatim usage policy*. Recuperado el 8 de octubre de 2026, de https://operations.osmfoundation.org/policies/nominatim/

Remix Software. (s.f.). *React Router* (Versión 7) [Software]. https://reactrouter.com

Vite Team. (s.f.). *Vite* (Versión 8) [Software]. https://vite.dev
