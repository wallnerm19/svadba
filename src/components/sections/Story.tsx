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
      </div>
    </section>
  );
}
