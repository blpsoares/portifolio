import { jsPDF } from 'jspdf';
import type { Translations } from '../i18n';

type RGB = [number, number, number];

const TEAL: RGB = [13, 148, 136]; // brand-600
const TEAL_DARK: RGB = [15, 118, 110]; // brand-700
const NAME: RGB = [15, 23, 42]; // slate-900
const BODY: RGB = [51, 65, 85]; // slate-700
const MUTED: RGB = [100, 116, 139]; // slate-500
const RULE: RGB = [226, 232, 240]; // slate-200

// jsPDF's standard fonts use WinAnsi encoding, which lacks a few glyphs we use
// in the site copy. Map them to safe ASCII equivalents for the PDF.
const clean = (s: string): string =>
  s
    .replace(/→/g, '->')
    .replace(/↔/g, '<->')
    .replace(/⇒/g, '=>')
    .replace(/≈/g, '~')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");

export function generateCvPdf(t: Translations): void {
  buildCvDoc(t).save(`${t.cv.fileName}.pdf`);
}

export function buildCvDoc(t: Translations): jsPDF {
  const cv = t.cv;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 44; // margin
  const W = pageW - M * 2; // content width
  let y = M;

  const color = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const ensure = (h: number) => {
    if (y + h > pageH - M) {
      doc.addPage();
      y = M;
    }
  };

  // Wrapped paragraph
  const para = (
    text: string,
    opts: {
      size?: number;
      style?: 'normal' | 'bold' | 'italic';
      col?: RGB;
      lh?: number;
      indent?: number;
      gap?: number;
    } = {},
  ) => {
    const { size = 9.5, style = 'normal', col = BODY, lh = 1.35, indent = 0, gap = 0 } = opts;
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    color(col);
    const lines = doc.splitTextToSize(clean(text), W - indent) as string[];
    const lineH = size * lh;
    for (const line of lines) {
      ensure(lineH);
      doc.text(line, M + indent, y);
      y += lineH;
    }
    y += gap;
  };

  // Bulleted list item with a teal dot and hanging indent
  const bullet = (text: string) => {
    const size = 9;
    const indent = 12;
    const lineH = size * 1.32;
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(clean(text), W - indent) as string[];
    lines.forEach((line, idx) => {
      ensure(lineH);
      doc.setFont('helvetica', 'normal');
      if (idx === 0) {
        color(TEAL);
        doc.text('•', M, y);
      }
      color(BODY);
      doc.text(line, M + indent, y);
      y += lineH;
    });
  };

  // Section heading with an underline rule
  const section = (label: string) => {
    y += 14;
    ensure(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    color(TEAL_DARK);
    doc.text(clean(label).toUpperCase(), M, y);
    y += 5;
    doc.setDrawColor(TEAL_DARK[0], TEAL_DARK[1], TEAL_DARK[2]);
    doc.setLineWidth(0.8);
    doc.line(M, y, M + W, y);
    y += 13;
  };

  // ---------- Header ----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  color(NAME);
  doc.text(clean(cv.name), M, y);
  y += 21;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  color(TEAL_DARK);
  doc.text(clean(cv.title), M, y);
  y += 16;

  doc.setFontSize(8.5);
  color(MUTED);
  doc.text(clean(`${cv.phone}   •   ${cv.email}   •   ${cv.location}`), M, y);
  y += 11;
  doc.text(clean(`${cv.website}   •   ${cv.linkedin}   •   ${cv.github}`), M, y);
  y += 9;

  doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
  doc.setLineWidth(0.8);
  doc.line(M, y, M + W, y);
  y += 12;

  // ---------- Summary ----------
  para(cv.summary, { size: 9.5, col: BODY, lh: 1.42 });

  // ---------- Experience ----------
  section(cv.sections.experience);
  t.career.items.forEach((job, i) => {
    ensure(46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    color(NAME);
    doc.text(clean(job.role), M, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    color(MUTED);
    doc.text(clean(job.period), M + W, y, { align: 'right' });
    y += 13;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    color(TEAL_DARK);
    doc.text(clean(`${job.company}   ·   ${job.location}   ·   ${job.type}`), M, y);
    y += 13;

    job.bullets.forEach((b) => bullet(b));

    const tech = cv.tech[i];
    if (tech) {
      y += 2;
      para(`${cv.techLabel}: ${tech}`, { size: 8.3, style: 'italic', col: MUTED, lh: 1.3 });
    }
    y += 8;
  });

  // ---------- Open Source & Personal Projects ----------
  section(cv.sections.projects);
  cv.projects.forEach((p) => {
    ensure(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    color(NAME);
    const nameLines = doc.splitTextToSize(clean(p.name), W) as string[];
    nameLines.forEach((l) => {
      ensure(12);
      doc.text(l, M, y);
      y += 12;
    });
    para(p.description, { size: 8.8, col: BODY, lh: 1.32 });
    para(p.stack, { size: 8.2, style: 'italic', col: TEAL_DARK, gap: 7 });
  });

  // ---------- Technical Skills ----------
  section(cv.sections.skills);
  cv.skills.forEach((s) => {
    ensure(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    color(TEAL_DARK);
    doc.text(clean(s.category), M, y);
    y += 11;
    para(s.items, { size: 8.8, col: BODY, lh: 1.3, gap: 5 });
  });

  // ---------- Education ----------
  section(cv.sections.education);
  t.education.items.forEach((e) => {
    ensure(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    color(NAME);
    doc.text(clean(`${e.degree} — ${e.field}`), M, y);
    if (e.period) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      color(MUTED);
      doc.text(clean(e.period), M + W, y, { align: 'right' });
    }
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    color(TEAL_DARK);
    doc.text(clean(e.institution), M, y);
    y += 15;
  });

  // ---------- Languages ----------
  section(cv.sections.languages);
  para(cv.languages, { size: 9, col: BODY });

  return doc;
}
