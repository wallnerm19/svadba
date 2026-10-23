import { wedding } from '../../config/wedding';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Gifts() {
  const { gifts } = wedding;
  return (
    <section id="dary" aria-labelledby="dary-title" className="bg-champagne/45 py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="dary-title" eyebrow={gifts.eyebrow} title={gifts.title} intro={gifts.intro} />

        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-ink italic sm:text-3xl">{gifts.message}</p>
        </Reveal>

        <ul className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-3">
          {gifts.options.map((option, i) => (
            <Reveal
              as="li"
              key={option.title}
              delay={i * 0.1}
              className="bg-ivory/80 px-7 py-10 text-center shadow-soft"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold-deep">
                <Icon name={option.icon} size={22} />
              </span>
              <h3 className="mt-6 text-2xl text-ink">{option.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{option.description}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="mt-14 text-center font-serif text-2xl text-gold-deep italic">{gifts.signature}</p>
        </Reveal>
      </div>
    </section>
  );
}
