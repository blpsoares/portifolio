import { useEffect, useState } from 'react';

export interface ActiveSection {
  id: string;
  label: string;
}

/**
 * Tracks which `[data-section]` element is currently most visible in the
 * viewport, so the global AI dock can offer context-aware suggestions
 * ("you're viewing Projects → explain this project").
 */
export function useActiveSection(): ActiveSection | null {
  const [active, setActive] = useState<ActiveSection | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-section]'),
    );
    if (sections.length === 0) return;

    // Track intersection ratios and pick the most-visible section.
    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: HTMLElement | null = null;
        let bestRatio = 0;
        for (const el of sections) {
          const r = ratios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = el;
          }
        }
        if (best && bestRatio > 0.15) {
          const id = best.dataset.section ?? '';
          const label = best.dataset.sectionLabel ?? id;
          setActive((prev) => (prev?.id === id ? prev : { id, label }));
        }
      },
      { threshold: [0.15, 0.35, 0.6, 0.85] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
