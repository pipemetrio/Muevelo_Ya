# Cambio de estructura y reglas

## App.jsx

App.jsx únicamente inicia la aplicación.

Solo cargara el sistema de rutas, No agreguen componentes aquí.

## AppRoutes.jsx

Aquí se registran todas las rutas de la aplicación.

Si se crea una nueva página, este archivo debe actualizarse.

## Convenciones

Las carpetas en src/ deben estar siempre en minúsculas.  
Ejemplos:

- assets
- components
- pages
- routes

Los componentes deben estar siempre en PascalCase.  
Ejemplo correcto:

- LoginForm.jsx
- Navbar.jsx

Ejemplo incorrecto:

- loginForm.jsx
- navbar.jsx

## ¿Cómo agregar una nueva página?

1. Crear los componentes necesarios en "components/".

   Ejemplo:

   ```
   components/layout/Navbar/Navbar.jsx
   ```

   ```
   components/layout/Footer/Footer.jsx
   ```

   Cada componente mantiene su propio CSS.

   Ejemplo:

   ```
   components/layout/Navbar/Navbar.css
   ```

   ```
   components/layout/Footer/Footer.css
   ```

2. Crear un archivo dentro de "pages/".

   Ejemplo:

   ```
   pages/Pagina.jsx
   ```

3. Importar el componente en el archivo creado.

   Ejemplo:

   ```jsx
   import Navbar from "../components/layout/Navbar/Navbar";
   import Footer from "../components/layout/Footer/Footer";

   export default function Pagina() {
     return (
       <>
         <Navbar />
         <main>
           <h1>Pagina</h1>
         </main>
         <Footer />
       </>
     );
   }
   ```

4. Agregar la ruta en "routes/AppRoutes.jsx".

   Ejemplo:

   ```jsx
   import Pagina from "../pages/Pagina";

   export default function AppRoutes() {
     return (
       <Routes>
         <Route path="/Ruta" element={<Pagina />} />;
       </Routes>
     );
   }
   ```

Eso es todo, la página agregada ahora estara en la URL que hayas puesto en el parametro "path".

## ¿Donde agregar un componente?

Si el componente pertenece a una funcionalidad existente, agregarlo dentro de esa carpeta. Si no, crear otra carpeta relacionada con ese componente.

No crear carpetas nuevas si el componente pertenece claramente a una funcionalidad ya existente.

<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->
