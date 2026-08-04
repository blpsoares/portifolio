/**
 * Orchestrates the local model's lifecycle from the UI's point of view.
 *
 * The whole point is that the visitor barely notices. Three paths:
 *
 *  1. Returning visitor with cached weights → load silently, no prompt, no bar.
 *  2. First visit, device qualifies → after they've settled in, offer the
 *     download once. If accepted, a progress bar keeps them company.
 *  3. Anything else (no WebGPU, mobile, data saver, declined) → nothing ever
 *     appears and the deterministic rule engine answers instead.
 *
 * When the model becomes ready it emits a one-shot greeting so the closed chat
 * can ping with something that feels personal.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import {
  declineConsent,
  grantConsent,
  hasConsent,
  hasDeclined,
  isLocalSupported,
  loadedBefore,
  onLocalProgress,
  prepareLocalTier,
  resetLocalEngine,
  startLocalEngine,
  type LocalProgress,
} from './localEngine';
import { buildGreeting } from './greeting';

/** How long to let the visitor browse before offering the download. */
const OFFER_DELAY_MS = 12000;

export interface LocalBrain {
  state: LocalProgress;
  /** Show the "want me to run locally?" card. */
  offering: boolean;
  /** Greeting to ping with, set once the model is ready. Null until then. */
  greeting: string | null;
  accept: () => void;
  decline: () => void;
  /** Clear the greeting after it's been shown. */
  dismissGreeting: () => void;
  /** Throw away a failed boot and try again. */
  retry: () => void;
}

export function useLocalBrain(): LocalBrain {
  const { locale } = useI18n();
  const [state, setState] = useState<LocalProgress>({
    status: 'idle',
    progress: 0,
    text: '',
    fromCache: false,
    tier: null,
    etaSeconds: null,
  });
  const [offering, setOffering] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);

  // The greeting must fire exactly once per page load.
  const greetedRef = useRef(false);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useEffect(() => onLocalProgress(setState), []);

  const boot = useCallback(() => {
    setOffering(false);
    startLocalEngine().catch((err) => {
      // The rule engine still answers, so this isn't fatal — but swallowing it
      // entirely is what made a stalled load look like "nothing happened".
      console.warn('[braia:local] boot failed', err);
    });
  }, []);

  const accept = useCallback(() => {
    grantConsent();
    boot();
  }, [boot]);

  const decline = useCallback(() => {
    declineConsent();
    setOffering(false);
  }, []);

  // Decide what to do on mount.
  useEffect(() => {
    if (!isLocalSupported() || hasDeclined()) return;

    // Already downloaded once (or already consented): just go, quietly.
    if (loadedBefore() || hasConsent()) {
      const idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => boot(), { timeout: 4000 })
        : window.setTimeout(boot, 2000);
      return () => {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
        else window.clearTimeout(idle as number);
      };
    }

    // First time on a qualifying device — resolve WHICH model this machine
    // deserves first, so the card can quote a real size and a real ETA, then
    // ask once they've stuck around a bit.
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void prepareLocalTier()
        .then(() => {
          if (!cancelled) setOffering(true);
        })
        .catch((err) => {
          console.warn('[braia:local] device profiling failed', err);
        });
    }, OFFER_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [boot]);

  // Model became usable → build the greeting from whatever context we have.
  useEffect(() => {
    if (state.status !== 'ready' || greetedRef.current) return;
    greetedRef.current = true;
    setGreeting(buildGreeting(localeRef.current));
  }, [state.status]);

  const dismissGreeting = useCallback(() => setGreeting(null), []);

  const retry = useCallback(() => {
    resetLocalEngine();
    boot();
  }, [boot]);

  return { state, offering, greeting, accept, decline, dismissGreeting, retry };
}
