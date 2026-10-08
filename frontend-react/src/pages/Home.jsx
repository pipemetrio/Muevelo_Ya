import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/home/Hero/Hero";
import Benefits from "../components/home/Benefits/Benefits";
import Services from "../components/home/Services/Services";
import PQRSD from "../components/home/PQRSD/PQRSD";
import Footer from "../components/layout/Footer/Footer";

export default function Home() {
  const { state } = useLocation();

  // scroll a una sección cuando se llega desde otra página (Navbar)
  useEffect(() => {
    if (state?.scrollTo) {
      document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state]);

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
        <Services />
      </section>
      <section id="contacto">
        <PQRSD />
      </section>
      <Footer />
    </>
  );
}
