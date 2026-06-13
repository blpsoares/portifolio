/**
 * Tiny event bus to open the AI chat dock from elsewhere (e.g. the Command
 * Palette) WITHOUT prop drilling. Kept in a standalone module so the protected
 * `src/agent/bus.ts` stays untouched.
 *
 * `AgentDock` adds a single additive listener for `OPEN_DOCK_EVENT` to flip its
 * own `open` state. See the loud comment in `AgentDock.tsx`.
 */

export const OPEN_DOCK_EVENT = 'braia:open-dock';

const target: EventTarget | null = typeof window !== 'undefined' ? new EventTarget() : null;

/** Request the AI chat dock to open. No-op during SSR. */
export function openAgentDock(): void {
  target?.dispatchEvent(new Event(OPEN_DOCK_EVENT));
}

/** Subscribe to dock-open requests. Returns an unsubscribe function. */
export function onOpenAgentDock(cb: () => void): () => void {
  if (!target) return () => {};
  target.addEventListener(OPEN_DOCK_EVENT, cb);
  return () => target.removeEventListener(OPEN_DOCK_EVENT, cb);
}
