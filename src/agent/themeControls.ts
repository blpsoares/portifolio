/**
 * Event bus for setting the site theme from outside the React tree.
 *
 * The theme lives as `isDarkMode` state in `App`, which owns writing the `dark`
 * class and persisting the choice. The agent must not poke the DOM class
 * directly: `App`'s state would go stale and the next manual toggle would fight
 * whatever the agent did. So the agent asks, and `App` remains the only writer.
 *
 * Same shape as `dockControls.ts`.
 */

export type Theme = 'dark' | 'light';

export const SET_THEME_EVENT = 'braia:set-theme';

const target: EventTarget | null = typeof window !== 'undefined' ? new EventTarget() : null;

/** Ask the app to switch to a specific theme. No-op during SSR. */
export function setSiteTheme(theme: Theme): void {
  target?.dispatchEvent(new CustomEvent<Theme>(SET_THEME_EVENT, { detail: theme }));
}

/** Subscribe to theme requests. Returns an unsubscribe function. */
export function onSetSiteTheme(cb: (theme: Theme) => void): () => void {
  if (!target) return () => {};
  const handler = (event: Event) => cb((event as CustomEvent<Theme>).detail);
  target.addEventListener(SET_THEME_EVENT, handler);
  return () => target.removeEventListener(SET_THEME_EVENT, handler);
}
