import { ArrowUpRight, CalendarClock } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { formatPlainDate } from '../../lib/date';
import { isPlaceholderUrl } from '../../lib/links';
import { ButtonLink } from '../ui/Button';
import { Ornament } from '../ui/Ornament';
import { Reveal } from '../ui/Reveal';

/** Potvrdenie účasti cez externý Google formulár (odpovede sa ukladajú v Google Forms / Sheets). */
export function Rsvp() {
  const { rsvp } = wedding;
  const deadline = formatPlainDate(rsvp.deadline);
  const placeholder = isPlaceholderUrl(rsvp.formUrl);
  const embedUrl = rsvp.formUrl.includes('?') ? `${rsvp.formUrl}&embedded=true` : `${rsvp.formUrl}?embedded=true`;

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-title"
      className="relative overflow-hidden bg-sage-dark py-24 text-ivory sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full border border-ivory/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-32 h-[34rem] w-[34rem] rounded-full border border-ivory/10"
      />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl border border-ivory/20 bg-ivory/[0.04] px-6 py-14 text-center backdrop-blur-[2px] sm:px-14 sm:py-20">
          <p className="eyebrow !text-champagne">{rsvp.eyebrow}</p>
          <h2 id="rsvp-title" className="mt-5 text-5xl sm:text-7xl">
            {rsvp.title}
          </h2>
          <Ornament className="mt-7" light />
          <p className="mx-auto mt-7 max-w-xl text-ivory/85 sm:text-lg">{rsvp.intro}</p>

          <p className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-champagne/40 px-5 py-2.5 text-sm text-champagne">
            <CalendarClock size={17} strokeWidth={1.5} aria-hidden="true" />
            Prosíme o potvrdenie do <strong className="font-semibold text-ivory">{deadline}</strong>
          </p>

          <ol className="mx-auto mt-10 max-w-md space-y-3 text-left text-sm text-ivory/85 sm:text-base">
            {rsvp.instructions.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-serif text-xl leading-6 text-champagne">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-center gap-4">
            <ButtonLink
              href={rsvp.formUrl}
              external
              variant="light"
              className="w-full !bg-ivory !text-ink hover:!bg-champagne sm:w-auto sm:px-12"
            >
              {rsvp.buttonLabel}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">(Google formulár, otvorí sa v novom okne)</span>
            </ButtonLink>
            {rsvp.note && <p className="text-xs text-ivory/85">{rsvp.note}</p>}
            {placeholder && import.meta.env.DEV && (
              <p role="note" className="max-w-md rounded bg-ink/40 px-4 py-2 text-xs text-champagne">
                Vývojárska poznámka: v súbore src/config/wedding.ts ešte nie je nastavený odkaz na Google formulár
                (rsvp.formUrl). Táto poznámka sa na zverejnenej stránke nezobrazí.
              </p>
            )}
          </div>

          {rsvp.embed && !placeholder && (
            <div className="mt-14 overflow-hidden rounded-sm bg-ivory">
              <iframe
                src={embedUrl}
                title="Formulár na potvrdenie účasti"
                loading="lazy"
                className="block h-[1100px] w-full border-0 sm:h-[1000px]"
              >
                Načítava sa…
              </iframe>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
