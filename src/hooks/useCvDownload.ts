import { useState } from 'react';
import { useI18n } from '../i18n';

/**
 * Shared CV download logic. Lazy-loads the jsPDF generator on demand and
 * builds the PDF in the currently selected locale. Reused by the Navbar,
 * Hero and Footer download buttons.
 */
export function useCvDownload() {
  const { t } = useI18n();
  const [generating, setGenerating] = useState(false);

  const downloadCv = async () => {
    if (generating) return;
    try {
      setGenerating(true);
      const { generateCvPdf } = await import('../utils/generateCv');
      generateCvPdf(t);
    } catch (err) {
      console.error('Failed to generate CV', err);
    } finally {
      setGenerating(false);
    }
  };

  return { generating, downloadCv };
}
