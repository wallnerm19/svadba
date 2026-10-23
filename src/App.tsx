import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { wedding } from './config/wedding';
import { Envelope } from './components/Envelope';
import { Footer } from './components/layout/Footer';
import { Navigation } from './components/layout/Navigation';
import { Closing } from './components/sections/Closing';
import { Details } from './components/sections/Details';
import { Gallery } from './components/sections/Gallery';
import { Gifts } from './components/sections/Gifts';
import { Hero } from './components/sections/Hero';
import { Info } from './components/sections/Info';
import { Rsvp } from './components/sections/Rsvp';
import { Schedule } from './components/sections/Schedule';
import { Story } from './components/sections/Story';
import { IntroContext } from './hooks/useIntro';

/** Obálku zobrazíme pri každom otvorení – okrem odkazu priamo na sekciu (napr. #rsvp). */
function shouldShowEnvelope(): boolean {
  const hash = window.location.hash;
  return wedding.envelope.enabled && (!hash || hash === '#' || hash === '#uvod');
}

export default function App() {
  const { sections } = wedding;
  const [showEnvelope, setShowEnvelope] = useState(shouldShowEnvelope);
  const [introReady, setIntroReady] = useState(() => !showEnvelope);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introReady}>
        {/* Kým je obálka zatvorená, stránka pod ňou nie je dostupná klávesnicou ani čítačkám. */}
        <div inert={!introReady}>
          <a href="#obsah" className="skip-link">
            Preskočiť na obsah
          </a>
          <Navigation />
          <main id="obsah">
            <Hero />
            {sections.story && <Story />}
            <Details />
            {sections.schedule && <Schedule />}
            {sections.gallery && <Gallery />}
            {sections.info && <Info />}
            {sections.gifts && <Gifts />}
            {sections.rsvp && <Rsvp />}
            <Closing />
          </main>
          <Footer />
        </div>
        {showEnvelope && <Envelope onReveal={() => setIntroReady(true)} onDone={() => setShowEnvelope(false)} />}
      </IntroContext.Provider>
    </MotionConfig>
  );
}
