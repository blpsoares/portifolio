import { useState } from 'react';
import { useI18n, type Locale } from '../i18n';
import en from '../i18n/en';
import pt from '../i18n/pt';

const dictionaries = { en, pt } as const;

/**
 * Shared CV download logic. Lazy-loads the jsPDF generator on demand and
 * builds the PDF in the selected locale. Reused by the Navbar, Hero and
 * Footer buttons — and by the AI agent, which can request a specific
 * language ("cv em ptbr") regardless of the current page language.
 */
export function useCvDownload() {
  const { t } = useI18n();
  const [generating, setGenerating] = useState(false);

  const downloadCv = async (localeOverride?: Locale) => {
    if (generating) return;
    try {
      setGenerating(true);
      const dict = localeOverride ? dictionaries[localeOverride] : t;
      const { generateCvPdf } = await import('../utils/generateCv');
      generateCvPdf(dict);
    } catch (err) {
      console.error('Failed to generate CV', err);
    } finally {
      setGenerating(false);
    }
  };

  return { generating, downloadCv };
}
