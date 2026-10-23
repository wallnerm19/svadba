import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { wedding } from '../../config/wedding';
import { asset } from '../../lib/links';
import { coupleNames, shortDate } from '../../lib/wedding';
import { Ornament } from '../ui/Ornament';
import { Reveal } from '../ui/Reveal';

export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '10%']);
  const { closing } = wedding;

  return (
    <section
      ref={ref}
      aria-labelledby="koniec-title"
      className="relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-ink text-ivory"
    >
      <motion.div className="absolute inset-x-0 -top-[12%] -z-10 h-[124%]" style={{ y }}>
        <img
          src={asset(closing.image.src)}
          alt={closing.image.alt}
          width={closing.image.width}
          height={closing.image.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: closing.image.focus }}
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />

      <Reveal className="container-page max-w-3xl py-28 text-center">
        <p className="eyebrow !text-champagne">{closing.eyebrow}</p>
        <h2 id="koniec-title" className="mt-6 text-6xl sm:text-8xl">
          {closing.title}
        </h2>
        <p className="mx-auto mt-8 max-w-xl font-serif text-2xl leading-snug text-ivory/90 italic sm:text-3xl">
          „{closing.message}“
        </p>
        <Ornament className="mt-10" light />
        <p className="mt-8 font-serif text-4xl sm:text-5xl">{coupleNames}</p>
        <p className="mt-3 text-[0.75rem] tracking-[0.35em] text-ivory/80">{shortDate}</p>
      </Reveal>
    </section>
  );
}
