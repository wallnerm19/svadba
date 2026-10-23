import { Clock, MapPin, Navigation } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { mapsUrl } from '../../lib/links';
import { longDate, weekday } from '../../lib/wedding';
import type { Venue } from '../../types/wedding';
import { AddToCalendar } from '../AddToCalendar';
import { ButtonLink } from '../ui/Button';
import { Ornament } from '../ui/Ornament';
import { Picture } from '../ui/Picture';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

function VenueCard({ venue, delay }: { venue: Venue; delay: number }) {
  return (
    <Reveal as="article" delay={delay} className="group flex flex-col overflow-hidden bg-ivory shadow-soft">
      {venue.image && (
        <Picture
          image={venue.image}
          className="aspect-[16/10]"
          imgClassName="transition-transform duration-[1.6s] ease-elegant group-hover:scale-[1.04]"
        />
      )}
      <div className="flex flex-1 flex-col items-center px-7 pt-10 pb-10 text-center sm:px-10">
        <p className="eyebrow">{venue.label}</p>
        <h3 className="mt-4 text-3xl leading-tight text-ink sm:text-4xl">{venue.name}</h3>
        <Ornament className="mt-6" />
        <dl className="mt-6 space-y-3 text-ink-soft">
          <div className="flex items-center justify-center gap-2.5">
            <dt>
              <Clock size={16} strokeWidth={1.5} className="text-gold" aria-label="Čas" />
            </dt>
            <dd className="font-serif text-2xl text-ink">{venue.time}</dd>
          </div>
          <div className="flex items-start justify-center gap-2.5">
            <dt className="pt-1">
              <MapPin size={16} strokeWidth={1.5} className="text-gold" aria-label="Adresa" />
            </dt>
            <dd>
              <address className="not-italic">{venue.address}</address>
            </dd>
          </div>
        </dl>
        {venue.description && <p className="mt-5 max-w-sm text-sm text-ink-soft">{venue.description}</p>}
        <div className="mt-auto pt-8">
          <ButtonLink
            href={mapsUrl(venue)}
            external
            variant="outline"
            aria-label={`Navigovať: ${venue.name} (Google Maps)`}
          >
            <Navigation size={15} strokeWidth={1.5} aria-hidden="true" />
            Navigovať
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}

export function Details() {
  const { details } = wedding;
  return (
    <section id="svadba" aria-labelledby="svadba-title" className="relative bg-cream py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="svadba-title" eyebrow={details.eyebrow} title={details.title} intro={details.intro} />

        <Reveal className="mx-auto -mt-6 mb-16 flex max-w-xl flex-col items-center text-center sm:mb-20">
          <p className="font-serif text-3xl text-ink capitalize sm:text-4xl">{weekday}</p>
          <p className="mt-1 font-serif text-5xl text-gold-deep italic sm:text-6xl">{longDate}</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <VenueCard venue={details.ceremony} delay={0} />
          <VenueCard venue={details.reception} delay={0.12} />
        </div>

        <Reveal className="mx-auto mt-20 max-w-2xl border border-line bg-ivory/60 px-6 py-12 text-center sm:px-12">
          <h3 className="text-3xl text-ink sm:text-4xl">{details.calendar.title}</h3>
          <p className="mt-3 text-ink-soft">{details.calendar.description}</p>
          <div className="mt-8">
            <AddToCalendar />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
