import { motion, useReducedMotion } from 'motion/react';
import type { ImageAsset } from '../../types/wedding';
import { asset } from '../../lib/links';

interface PictureProps {
  image: ImageAsset;
  className?: string;
  imgClassName?: string;
  /** Odhalenie obrázka „oponou“ pri posúvaní. */
  reveal?: boolean;
  priority?: boolean;
}

/** Obrázok s lenivým načítaním, správnym pomerom strán a voliteľnou animáciou odhalenia. */
export function Picture({ image, className = '', imgClassName = '', reveal = true, priority = false }: PictureProps) {
  const reduce = useReducedMotion();
  const animate = reveal && !reduce;

  return (
    <motion.div
      className={`relative overflow-hidden bg-champagne ${className}`}
      initial={animate ? { clipPath: 'inset(12% 0% 12% 0%)' } : false}
      whileInView={animate ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={asset(image.src)}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ objectPosition: image.focus }}
        initial={animate ? { scale: 1.12 } : false}
        whileInView={animate ? { scale: 1 } : undefined}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
