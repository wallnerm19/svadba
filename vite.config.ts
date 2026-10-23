import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { wedding } from './src/config/wedding.ts';

/**
 * Základná cesta stránky na GitHub Pages: https://USERNAME.github.io/svadba/
 * GitHub Actions ju nastaví automaticky (premenná BASE_PATH) podľa názvu repozitára,
 * lokálne sa použije "/svadba/".
 */
const base = withTrailingSlash(process.env.BASE_PATH || '/svadba/');

/** Plná verejná adresa (pre Open Graph). Z konfigurácie alebo z GitHub Actions (SITE_URL). */
const siteUrl = withTrailingSlash(wedding.seo.siteUrl || process.env.SITE_URL || '');

function withTrailingSlash(value: string) {
  return value && !value.endsWith('/') ? `${value}/` : value;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Doplní SEO a Open Graph údaje z src/config/wedding.ts do index.html. */
function weddingHtml(): Plugin {
  return {
    name: 'wedding-html',
    transformIndexHtml(html) {
      const ogImage = siteUrl ? siteUrl + wedding.seo.ogImage : base + wedding.seo.ogImage;
      const values: Record<string, string> = {
        '%WEDDING_TITLE%': wedding.seo.title,
        '%WEDDING_DESCRIPTION%': wedding.seo.description,
        '%WEDDING_OG_IMAGE%': ogImage,
        '%WEDDING_URL%': siteUrl || base,
      };
      return Object.entries(values).reduce((out, [key, value]) => out.replaceAll(key, escapeHtml(value)), html);
    },
  };
}

/** GitHub Pages: 404.html = index.html, takže ani neznáma adresa neskončí chybou. */
function spaFallback(): Plugin {
  let outDir = 'dist';
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = resolve(outDir, 'index.html');
      if (existsSync(index)) copyFileSync(index, resolve(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), weddingHtml(), spaFallback()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
