import { Reveal } from './Reveal';
import { Ornament } from './Ornament';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  align?: 'center' | 'left';
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, intro, id, align = 'center', light = false }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <Reveal className={`mb-14 sm:mb-20 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}`}>
      <p className={`eyebrow ${light ? '!text-champagne' : ''}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-5 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl ${light ? 'text-ivory' : 'text-ink'}`}
      >
        {title}
      </h2>
      {centered && <Ornament className="mt-7" light={light} />}
      {intro && <p className={`mt-7 text-base sm:text-lg ${light ? 'text-ivory/85' : 'text-ink-soft'}`}>{intro}</p>}
    </Reveal>
  );
}
