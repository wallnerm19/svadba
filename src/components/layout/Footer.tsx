import { Heart } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { isSectionVisible, coupleNames, longDate } from '../../lib/wedding';

export function Footer() {
  const items = wedding.navigation.filter((item) => isSectionVisible(item.id));
  return (
    <footer className="bg-[#26221d] py-14 text-ivory/70">
      <div className="container-page flex flex-col items-center gap-8 text-center">
        <p className="font-serif text-3xl text-ivory">{coupleNames}</p>
        <nav aria-label="Navigácia v pätičke">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.7rem] uppercase tracking-[0.2em]">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="transition-colors hover:text-champagne">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden="true" className="h-px w-16 bg-gold/50" />
        <p className="flex items-center gap-2 text-xs">
          {longDate} · {wedding.location}
        </p>
        <p className="flex items-center gap-2 text-xs text-ivory/60">
          <Heart size={12} className="text-gold" fill="currentColor" aria-hidden="true" />
          {wedding.footer.note}
        </p>
      </div>
    </footer>
  );
}
