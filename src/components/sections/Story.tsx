import { wedding } from '../../config/wedding';
import { Ornament } from '../ui/Ornament';
import { Picture } from '../ui/Picture';
import { Reveal } from '../ui/Reveal';

export function Story() {
  const { story } = wedding;
  return (
    <section id="o-nas" aria-labelledby="o-nas-title" className="theme-sage paper relative py-24 sm:py-36">
      <div className="container-page">
        <article className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <Picture image={story.image} className="aspect-[4/5] w-full rounded-t-[999px] shadow-soft" />
            <span
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 hidden h-32 w-32 rounded-full border border-gold/40 sm:block"
            />
          </div>
          <Reveal className="text-center lg:col-span-6 lg:col-start-7 lg:text-left">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 id="o-nas-title" className="mt-5 text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">
              {story.title}
            </h2>
            <Ornament className="mt-7 lg:justify-start" />
            <p className="mt-7 text-ink-soft sm:text-lg">{story.text}</p>
          </Reveal>
        </article>
        {story.childhood && (
          <figure className="mx-auto mt-20 max-w-2xl sm:mt-28">
            <div className="grid grid-cols-2 items-start gap-3 sm:gap-10">
              {story.childhood.images.map((image, i) => (
                <div
                  key={image.src}
                  className={`bg-ivory p-2 pb-0 shadow-soft ring-1 ring-line/60 transition-transform duration-500 ease-out hover:rotate-0 sm:p-3 sm:pb-0 ${
                    i % 2 === 0 ? '-rotate-3' : 'mt-6 rotate-2 sm:mt-10'
                  }`}
                >
                  <Picture image={image} className="aspect-[4/5] w-full" imgClassName="sepia-[.15]" />
                  <p className="py-2.5 text-center font-serif text-xl text-ink-soft italic sm:py-4 sm:text-2xl">
                    {image.label}
                  </p>
                </div>
              ))}
            </div>
            <Reveal>
              <figcaption className="mt-10 text-center font-serif text-3xl text-ink italic sm:mt-14 sm:text-5xl">
                {story.childhood.caption}
              </figcaption>
            </Reveal>
          </figure>
        )}
      </div>
    </section>
  );
}
