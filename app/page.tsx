import { BroadsheetNav } from "@/components/broadsheet/BroadsheetNav";
import { Masthead } from "@/components/broadsheet/Masthead";
import { WorkReel } from "@/components/broadsheet/WorkReel";
import { AboutSpread } from "@/components/broadsheet/AboutSpread";
import { CreditsLedger } from "@/components/broadsheet/CreditsLedger";
import { StillsSection } from "@/components/broadsheet/StillsSection";
import { ContactColophon } from "@/components/broadsheet/ContactColophon";
import { SmoothScroll } from "@/components/kinetic/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="editorial paper-grain relative min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-background focus:outline-none"
        >
          Skip to main content
        </a>
        <BroadsheetNav />
        <main id="main">
          <Masthead />
          <WorkReel />
          <AboutSpread />
          <CreditsLedger />
          <StillsSection />
        </main>
        <ContactColophon />
      </div>
    </SmoothScroll>
  );
}
