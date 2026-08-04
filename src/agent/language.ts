/**
 * Which language should the assistant answer in?
 *
 * The site locale is a bad proxy on its own: it defaults to English when
 * nothing is stored, so a Brazilian visitor's first message got a system prompt
 * saying "Always respond in English" and the model dutifully obeyed. What the
 * visitor actually typed is far better evidence of what they want to read.
 *
 * The detector only has to separate Portuguese from English, so a stopword and
 * diacritic count is plenty; it stays deliberately dumb and never throws.
 */
import type { Locale } from '../i18n';

/** Portuguese function words that rarely appear in English text. */
const PT_MARKERS =
  /\b(que|nao|não|voce|você|como|qual|quais|quem|onde|porque|por que|obrigado|obrigada|ola|olá|oi|tudo|bem|ta|tá|pra|para|com|dos|das|uma|seu|sua|ele|ela|fez|foi|tem|sobre|mais|muito|isso|esse|essa|entao|então|trabalho|carreira|projetos|experiencia|experiência)\b/gi;

/** English function words that rarely appear in Portuguese text. */
const EN_MARKERS =
  /\b(the|what|which|who|where|why|how|does|did|is|are|was|were|his|her|their|about|with|from|have|has|can|could|would|should|tell|show|me|you|your|hi|hello|thanks|thank|work|career|projects|experience)\b/gi;

/** Characters that essentially only occur in Portuguese here. */
const PT_DIACRITICS = /[ãõçáéíóúâêôàü]/gi;

const count = (text: string, re: RegExp): number => (text.match(re) ?? []).length;

/**
 * Guess the language of a message. Returns null when the evidence is too thin
 * (very short or ambiguous input), so the caller can fall back to the site
 * locale rather than act on a coin flip.
 */
export function detectLanguage(text: string): Locale | null {
  const s = text.trim();
  if (s.length < 4) return null;

  const pt = count(s, PT_MARKERS) + count(s, PT_DIACRITICS) * 2;
  const en = count(s, EN_MARKERS);

  if (pt === 0 && en === 0) return null;
  // Require a clear margin; a tie means we don't actually know.
  if (pt > en) return 'pt';
  if (en > pt) return 'en';
  return null;
}

/**
 * Resolve the answer language: what the visitor wrote, else the site locale.
 */
export function answerLanguage(query: string, siteLocale: Locale): Locale {
  return detectLanguage(query) ?? siteLocale;
}
