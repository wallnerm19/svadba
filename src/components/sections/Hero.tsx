import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { wedding } from '../../config/wedding';
import { asset } from '../../lib/links';
import { firstName, isSectionVisible, longDate, secondName, weekday } from '../../lib/wedding';
import { Countdown } from '../Countdown';
import { ButtonLink } from '../ui/Button';

const ease = [0.22, 1, 0.36, 1] as const;
const nextSection = isSectionVisible('nas-pribeh') ? 'nas-pribeh' : 'svadba';

function AnimatedName({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block" aria-hidden="true">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: reduce ? 0 : '0.35em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const { separator } = wedding.couple;
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease },
  });

  return (
    <section
      id="uvod"
      ref={ref}
      aria-label="Úvod – svadobné oznámenie"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-ink text-ivory"
    >
      <motion.div className="absolute inset-0 -z-10 h-[118%] -top-[9%]" style={{ y: imageY }}>
        <motion.img
          src={asset(wedding.hero.image.src)}
          alt={wedding.hero.image.alt}
          width={wedding.hero.image.width}
          height={wedding.hero.image.height}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: wedding.hero.image.focus }}
          initial={{ scale: reduce ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease }}
        />
      </motion.div>
      {/* Jemné stmavenie kvôli čitateľnosti textu */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(28_24_20/0.25),rgb(28_24_20/0.6))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-ink/60 to-transparent"
      />

      <motion.div
        className="container-page flex flex-col items-center pt-28 pb-32 text-center sm:pt-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p className="eyebrow !text-champagne" {...fade(0.2)}>
          {wedding.hero.eyebrow}
        </motion.p>

        <h1 className="mt-6 font-serif text-display font-light tracking-[-0.02em]">
          <span className="sr-only">{`${firstName} ${separator} ${secondName}`}</span>
          <span className="flex flex-col items-center lg:flex-row lg:gap-[0.25em]">
            <AnimatedName text={firstName} delay={0.35} />
            <motion.span
              aria-hidden="true"
              className="my-1 font-serif text-[0.7em] text-champagne italic lg:my-0 lg:text-[0.7em]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.75, ease }}
            >
              {separator}
            </motion.span>
            <AnimatedName text={secondName} delay={0.9} />
          </span>
        </h1>

        <motion.div className="mt-8 flex flex-col items-center gap-2" {...fade(1.3)}>
          <p className="text-[0.78rem] uppercase tracking-[0.3em] text-ivory/90">
            {weekday} · {longDate}
          </p>
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-ivory/75">{wedding.location}</p>
        </motion.div>

        <motion.blockquote className="mt-8 max-w-xl font-serif text-xl text-ivory/90 italic sm:text-2xl" {...fade(1.5)}>
          „{wedding.hero.quote}“
        </motion.blockquote>

        <motion.div className="mt-12 w-full" {...fade(1.7)}>
          <Countdown />
        </motion.div>

        {wedding.sections.rsvp && (
          <motion.div className="mt-12" {...fade(1.9)}>
            <ButtonLink href="#rsvp" variant="light">
              {wedding.rsvp.buttonLabel}
            </ButtonLink>
          </motion.div>
        )}
      </motion.div>

      <motion.a
        href={`#${nextSection}`}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/75 transition-colors hover:text-ivory"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <span>Posuňte nižšie</span>
        <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-ivory/25">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-ivory motion-safe:animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
        </span>
      </motion.a>
    </section>
  );
}
