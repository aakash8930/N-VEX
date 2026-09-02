import { Overlays } from '@/components/ui/Overlays';
import { TopNav } from '@/components/site/TopNav';
import { SmoothScroll } from '@/components/site/SmoothScroll';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Hero } from '@/components/hero/Hero';
import { Statement } from '@/components/sections/Statement';
import { Technology } from '@/components/sections/Technology';
import { SystemVisualization } from '@/components/sections/SystemVisualization';
import { Process } from '@/components/sections/Process';
import { Applications } from '@/components/sections/Applications';
import { TechnicalData } from '@/components/sections/TechnicalData';
import { FinalCta } from '@/components/sections/FinalCta';

export default function Page() {
  return (
    <>
      {/* fixed atmosphere + HUD frame */}
      <Overlays />
      {/* fixed navigation */}
      <TopNav />

      <SmoothScroll>
        <main id="main">
          <Hero />
          <Statement />
          <Technology />
          <SystemVisualization />
          <Process />
          <Applications />
          <TechnicalData />
          <FinalCta />
        </main>
        <SiteFooter />
      </SmoothScroll>
    </>
  );
}
