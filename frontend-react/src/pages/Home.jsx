import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/home/Hero/Hero";
import Benefits from "../components/home/Benefits/Benefits";
import Footer from "../components/layout/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <section id="inicio">
        <Hero />
      </section>
      <section id="beneficios">
        <Benefits />
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
