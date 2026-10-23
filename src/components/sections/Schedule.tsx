import { motion, useReducedMotion, useScroll } from 'motion/react';
import { useRef } from 'react';
import { wedding } from '../../config/wedding';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Schedule() {
  const { schedule } = wedding;
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] });

  return (
    <section id="harmonogram" aria-labelledby="harmonogram-title" className="theme-sage paper relative py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading
          id="harmonogram-title"
          eyebrow={schedule.eyebrow}
          title={schedule.title}
          intro={schedule.intro}
        />

        <ol ref={listRef} className="relative mx-auto max-w-3xl">
          {/* Os časovej osi – postupne sa „vykresľuje“ pri posúvaní */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-7 w-px bg-line md:left-1/2" />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-7 w-px origin-top bg-gold md:left-1/2"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          />

          {schedule.items.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={`${item.time}-${item.title}`}
                className="relative grid grid-cols-[3.5rem_1fr] gap-x-6 pb-12 last:pb-0 md:grid-cols-[1fr_3.5rem_1fr] md:gap-x-10"
              >
                <div className="relative z-10 col-start-1 row-span-2 flex justify-center md:col-start-2">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-ivory text-gold-deep shadow-soft">
                    <Icon name={item.icon} size={22} />
                  </span>
                </div>
                <Reveal
                  delay={0.05}
                  className={`col-start-2 row-start-1 pt-2 ${
                    right ? 'md:col-start-3 md:text-left' : 'md:col-start-1 md:text-right'
                  }`}
                >
                  <time className="font-serif text-3xl text-gold-deep sm:text-4xl">{item.time}</time>
                  <h3 className="mt-1 text-2xl text-ink sm:text-[1.75rem]">{item.title}</h3>
                  {item.description && <p className="mt-2 text-ink-soft">{item.description}</p>}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
