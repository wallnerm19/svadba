import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { mapsUrl, telHref } from '../../lib/links';
import { Accordion } from '../Accordion';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const linkClass =
  'inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-deep underline-offset-4 transition-colors hover:text-ink hover:underline';

function SubHeading({ children }: { children: string }) {
  return (
    <div className="mb-10 flex items-center gap-5">
      <h3 className="shrink-0 text-3xl text-ink sm:text-4xl">{children}</h3>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Info() {
  const { info } = wedding;

  return (
    <section id="informacie" aria-labelledby="informacie-title" className="paper py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="informacie-title" eyebrow={info.eyebrow} title={info.title} intro={info.intro} />

        {/* Ubytovanie */}
        <div>
          <Reveal>
            <SubHeading>{info.accommodation.title}</SubHeading>
            <p className="-mt-4 mb-10 max-w-2xl text-ink-soft">{info.accommodation.intro}</p>
          </Reveal>
          <ul className="grid gap-6 md:grid-cols-3">
            {info.accommodation.places.map((place, i) => (
              <Reveal
                as="li"
                key={place.name}
                delay={i * 0.08}
                className="flex flex-col border border-line bg-ivory p-7 sm:p-8"
              >
                <Icon name="home" size={22} className="text-gold" />
                <h4 className="mt-5 text-2xl text-ink">{place.name}</h4>
                {place.distance && <p className="eyebrow mt-2 !tracking-[0.18em]">{place.distance}</p>}
                {place.description && <p className="mt-4 text-sm text-ink-soft">{place.description}</p>}
                <address className="mt-4 text-sm text-ink-soft not-italic">{place.address}</address>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-6">
                  {place.bookingUrl && (
                    <a href={place.bookingUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Rezervovať <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">(otvorí sa v novom okne)</span>
                    </a>
                  )}
                  <a
                    href={mapsUrl({ name: place.name, address: place.address })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <MapPin size={14} aria-hidden="true" /> Mapa
                  </a>
                  {place.phone && (
                    <a href={telHref(place.phone)} className={linkClass}>
                      <Phone size={14} aria-hidden="true" /> {place.phone}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
          {info.accommodation.note && (
            <Reveal>
              <p className="mt-6 text-center text-sm text-ink-soft italic">{info.accommodation.note}</p>
            </Reveal>
          )}
        </div>

        {/* Praktické karty */}
        <ul className="mt-24 grid gap-px overflow-hidden border border-line bg-line sm:mt-32 sm:grid-cols-2">
          {info.cards.map((card, i) => (
            <Reveal as="li" key={card.title} delay={(i % 2) * 0.08} className="bg-ivory p-8 sm:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-light text-sage-dark">
                <Icon name={card.icon} size={22} />
              </span>
              <h3 className="mt-6 text-3xl text-ink">{card.title}</h3>
              <div className="mt-4 space-y-3 text-ink-soft">
                {card.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Dress code */}
        <Reveal className="mt-24 grid items-center gap-10 bg-sage-dark px-7 py-14 text-ivory sm:mt-32 sm:px-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow !text-champagne">Oblečenie</p>
            <h3 className="mt-4 text-4xl sm:text-5xl">{info.dressCode.title}</h3>
            <p className="mt-6 text-ivory/85 sm:text-lg">{info.dressCode.description}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-5 sm:gap-7 lg:justify-end" aria-label="Farebná inšpirácia">
            {info.dressCode.palette.map((color) => (
              <li key={color.hex} className="flex flex-col items-center gap-3">
                <span
                  className="h-16 w-16 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.25)] ring-1 ring-ivory/30 ring-offset-4 ring-offset-sage-dark sm:h-20 sm:w-20"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/80">{color.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* FAQ + kontakty */}
        <div className="mt-24 grid gap-16 sm:mt-32 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <SubHeading>{info.faqTitle}</SubHeading>
            <Accordion items={info.faq} />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <SubHeading>{info.contactsTitle}</SubHeading>
            <ul className="space-y-5">
              {info.contacts.map((c) => (
                <li key={c.name} className="border border-line bg-ivory p-6">
                  <p className="eyebrow">{c.role}</p>
                  <p className="mt-2 font-serif text-2xl text-ink">{c.name}</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm">
                    {c.phone && (
                      <a
                        href={telHref(c.phone)}
                        className="inline-flex items-center gap-2 text-ink-soft hover:text-ink"
                      >
                        <Phone size={15} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
                        {c.phone}
                      </a>
                    )}
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="inline-flex items-center gap-2 break-all text-ink-soft hover:text-ink"
                      >
                        <Mail size={15} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
                        {c.email}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
