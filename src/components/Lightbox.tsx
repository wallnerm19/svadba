import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '../types/wedding';
import { asset } from '../lib/links';

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 400;

/** Celoobrazovkové prezeranie fotografií: šípky, potiahnutie prstom, klávesnica, Esc. */
export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null;
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(0);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onIndexChange((index + step + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  // Obsluha klávesnice beží len pri otvorení/zatvorení, aktuálne funkcie si preto držíme v referencii.
  const goRef = useRef(go);
  goRef.current = go;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Klávesnica, zamknutie posúvania, obnovenie fokusu po zatvorení.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      else if (e.key === 'ArrowRight') goRef.current(1);
      else if (e.key === 'ArrowLeft') goRef.current(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button')].filter(
          (el) => el.offsetParent !== null,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  // Prednačítanie susedných fotografií.
  useEffect(() => {
    if (index === null) return;
    [1, -1].forEach((step) => {
      const img = new Image();
      img.src = asset(images[(index + step + images.length) % images.length].src);
    });
  }, [index, images]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
  };

  const image = index !== null ? images[index] : null;
  const offset = reduce ? 0 : 80;

  return (
    <AnimatePresence>
      {image && index !== null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografia ${index + 1} z ${images.length}`}
          className="fixed inset-0 z-[60] flex flex-col bg-[#1d1915]/97 text-ivory backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
            <p className="text-[0.7rem] tracking-[0.3em] text-ivory/70 tabular-nums" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
              aria-label="Zavrieť galériu"
            >
              <X size={26} strokeWidth={1.25} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.figure
                key={index}
                custom={direction}
                className="flex h-full w-full touch-pan-y flex-col items-center justify-center"
                initial={{ opacity: 0, x: direction * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -offset }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                <img
                  src={asset(image.src)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  draggable={false}
                  className="max-h-[calc(100svh-11rem)] w-auto max-w-full object-contain shadow-2xl select-none"
                />
                {image.caption && (
                  <figcaption className="mt-4 px-4 text-center font-serif text-xl text-ivory/85 italic">
                    {image.caption}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute top-1/2 left-2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:bg-ivory hover:text-ink sm:inline-flex sm:left-6"
                  aria-label="Predchádzajúca fotografia"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute top-1/2 right-2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:bg-ivory hover:text-ink sm:inline-flex sm:right-6"
                  aria-label="Nasledujúca fotografia"
                >
                  <ChevronRight size={24} strokeWidth={1.25} />
                </button>
              </>
            )}
          </div>

          {/* Na mobile ovládacie prvky dole, na dosah palca */}
          <div className="flex items-center justify-center gap-6 px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory/85"
              aria-label="Predchádzajúca fotografia"
            >
              <ChevronLeft size={22} strokeWidth={1.25} />
            </button>
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60">Potiahnite</span>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory/85"
              aria-label="Nasledujúca fotografia"
            >
              <ChevronRight size={22} strokeWidth={1.25} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
