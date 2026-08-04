/**
 * Opening line for bra.ia's proactive ping.
 *
 * Deliberately plain. An earlier version fed city / referrer / time-of-day to
 * the local model and asked it to write something personal; a 3B cannot weave
 * optional context into one short sentence and produced things like "felizes em
 * te ver, especialmente num momento tão especial do dia, São Paulo". A greeting
 * that lands every time beats a clever one that misfires, so this is a fixed
 * line varying only by time of day and whether the visitor has been here before.
 */
import type { Locale } from '../i18n';

const VISIT_KEY = 'braia.visited';

type Daypart = 'morning' | 'afternoon' | 'evening';

function daypart(): Daypart {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

/** Mark this device as seen; returns whether it had been seen before. */
function trackVisit(): boolean {
  try {
    const seen = localStorage.getItem(VISIT_KEY) === '1';
    localStorage.setItem(VISIT_KEY, '1');
    return seen;
  } catch {
    return false;
  }
}

const HELLO: Record<Locale, Record<Daypart, string>> = {
  pt: { morning: 'Bom dia', afternoon: 'Boa tarde', evening: 'Boa noite' },
  en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
};

/** Build the greeting. Says nothing about how or where the assistant runs. */
export function buildGreeting(locale: Locale): string {
  const hello = HELLO[locale][daypart()];
  const returning = trackVisit();

  if (locale === 'pt') {
    return returning
      ? `${hello}! Que bom te ver por aqui de novo. O que quer saber sobre o Bryan?`
      : `${hello}! Sou a bra.ia e conheço o trabalho do Bryan de ponta a ponta. Pode perguntar o que quiser.`;
  }
  return returning
    ? `${hello}! Good to see you back. What would you like to know about Bryan?`
    : `${hello}! I am bra.ia and I know Bryan's work inside out. Ask me anything.`;
}
