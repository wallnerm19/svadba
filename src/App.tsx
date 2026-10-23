import { MotionConfig } from 'motion/react';
import { wedding } from './config/wedding';
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

export default function App() {
  const { sections } = wedding;
  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
