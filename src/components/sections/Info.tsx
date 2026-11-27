import { Mail, Phone } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { telHref } from '../../lib/links';
import { Accordion } from '../Accordion';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

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
    <section id="informacie" aria-labelledby="informacie-title" className="theme-sage bg-cream py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="informacie-title" eyebrow={info.eyebrow} title={info.title} intro={info.intro} />

        {/* Praktické informácie – obdĺžnikové karty pod sebou */}
        <ul className="space-y-6 sm:space-y-8">
          {info.cards.map((card) => (
            <Reveal
              as="li"
              key={card.title}
              className="flex flex-col items-center gap-6 border border-line bg-ivory px-7 py-12 text-center sm:flex-row sm:items-start sm:px-12 sm:text-left"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-light text-sage-dark">
                <Icon name={card.icon} size={24} />
              </span>
              <div>
                <h3 className="text-3xl text-ink sm:text-4xl">{card.title}</h3>
                <div className="mt-3 space-y-3 text-ink-soft sm:text-lg">
                  {card.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

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
