import { wedding } from '../../config/wedding';
import { Picture } from '../ui/Picture';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Story() {
  const { story } = wedding;
  return (
    <section id="nas-pribeh" aria-labelledby="nas-pribeh-title" className="paper relative py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="nas-pribeh-title" eyebrow={story.eyebrow} title={story.title} intro={story.intro} />

        <div className="space-y-24 sm:space-y-36">
          {story.chapters.map((chapter, i) => {
            const flipped = i % 2 === 1;
            return (
              <article key={chapter.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={`relative lg:col-span-6 ${flipped ? 'lg:order-2 lg:col-start-7' : ''}`}>
                  <Picture image={chapter.image} className="aspect-[4/5] w-full rounded-t-[999px] shadow-soft" />
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-6 hidden h-32 w-32 rounded-full border border-gold/40 sm:block ${
                      flipped ? '-left-6' : '-right-6'
                    }`}
                  />
                </div>
                <Reveal className={`lg:col-span-5 ${flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                  <span
                    aria-hidden="true"
                    className="block font-serif text-7xl leading-none text-champagne sm:text-8xl"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="eyebrow mt-4">{chapter.eyebrow}</p>
                  <h3 className="mt-4 text-4xl leading-tight text-ink sm:text-5xl">{chapter.title}</h3>
                  <div className="mt-6 space-y-4 text-ink-soft sm:text-lg">
                    {chapter.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>

        {wedding.sections.storyTimeline && story.timeline.length > 0 && (
          <div className="mt-28 sm:mt-40">
            <Reveal>
              <h3 className="text-center text-3xl text-ink sm:text-4xl">{story.timelineTitle}</h3>
            </Reveal>
            <ol className="relative mx-auto mt-12 max-w-md lg:mt-16 lg:grid lg:max-w-none lg:grid-cols-6 lg:gap-6">
              {/* spojovacia linka */}
              <span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[7px] w-px bg-linear-to-b from-gold/0 via-gold/60 to-gold/0 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-linear-to-r"
              />
              {story.timeline.map((m, i) => (
                <Reveal
                  as="li"
                  key={m.title}
                  delay={i * 0.08}
                  className="relative pb-10 pl-10 last:pb-0 lg:pb-0 lg:pl-0 lg:text-center"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-[15px] w-[15px] rounded-full border border-gold bg-ivory lg:relative lg:mx-auto lg:block"
                  >
                    <span className="absolute inset-[4px] rounded-full bg-gold" />
                  </span>
                  <p className="eyebrow lg:mt-6">{m.date}</p>
                  <p className="mt-2 font-serif text-2xl text-ink">{m.title}</p>
                  {m.description && <p className="mt-1 text-sm text-ink-soft">{m.description}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
