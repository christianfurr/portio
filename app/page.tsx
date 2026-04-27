import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { StageCrew } from "@/components/StageCrew";
import { PhotographySection } from "@/components/PhotographySection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { AmbientOrbs } from "@/components/AmbientOrbs";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <AmbientOrbs />
      <Navbar />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <StageCrew />
        <PhotographySection />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
