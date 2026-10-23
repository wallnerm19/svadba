import { useState } from 'react';
import { Expand } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { asset } from '../../lib/links';
import { Lightbox } from '../Lightbox';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Gallery() {
  const { gallery } = wedding;
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="fotogaleria" aria-labelledby="fotogaleria-title" className="bg-cream py-24 sm:py-36">
      <div className="container-page">
        <SectionHeading id="fotogaleria-title" eyebrow={gallery.eyebrow} title={gallery.title} intro={gallery.intro} />

        <ul className="columns-2 gap-3 sm:gap-5 lg:columns-3">
          {gallery.images.map((image, i) => (
            <Reveal as="li" key={image.src} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid sm:mb-5">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden bg-champagne focus-visible:outline-offset-4"
                aria-label={`Zväčšiť fotografiu: ${image.alt}`}
              >
                <img
                  src={asset(image.src)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition-transform duration-[1.4s] ease-elegant group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-end justify-between bg-linear-to-t from-ink/55 via-transparent to-transparent p-4 text-left text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="font-serif text-lg italic">{image.caption}</span>
                  <Expand size={18} strokeWidth={1.25} />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Lightbox images={gallery.images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </section>
  );
}
