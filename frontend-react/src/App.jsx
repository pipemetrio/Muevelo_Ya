import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import Beneficios from "./components/beneficios/Beneficios";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <section id="inicio">
        <Hero />
      </section>
      <section id="beneficios">
        <Beneficios />
      </section>
      <section id="servicios">
        <servicios />
      </section>
      <section id="contacto">
        <Footer />
      </section>
    </>
  );
}

export default App;