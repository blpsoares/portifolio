import { useCallback, useEffect, useState } from 'react';

/**
 * Command Palette state + global open controls.
 *
 * The palette is mounted once at the App root via {@link useCommandPalette}.
 * Any component (e.g. the Navbar chip) can request it to open without prop
 * drilling by calling {@link useCommandPaletteControls} — a tiny event bus
 * mirrors the pattern used by `src/agent/bus.ts`.
 */

const OPEN_EVENT = 'cmdk:open';

const target: EventTarget | null = typeof window !== 'undefined' ? new EventTarget() : null;

/** Imperatively request the Command Palette to open from anywhere. */
function requestOpen(): void {
  target?.dispatchEvent(new Event(OPEN_EVENT));
}

/** Returns a stable `open` callback for triggers (Navbar chip, etc.). */
export function useCommandPaletteControls(): { open: () => void } {
  return { open: requestOpen };
}

interface UseCommandPaletteResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Owns the palette open state. Binds the global ⌘K / Ctrl+K shortcut to open
 * and listens for imperative open requests from the bus. Mount the resulting
 * `<CommandPalette>` once at the App root and pass `isOpen` / `close`.
 */
export function useCommandPalette(): UseCommandPaletteResult {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // ⌘K (macOS) or Ctrl+K (Windows/Linux) toggles the palette.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!target) return;
    const onOpen = () => setIsOpen(true);
    target.addEventListener(OPEN_EVENT, onOpen);
    return () => target.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return { isOpen, open, close };
}
