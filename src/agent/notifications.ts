/**
 * Notification log for bra.ia's local models.
 *
 * The whole local-model lifecycle used to be invisible: a download would start,
 * stall, finish or fail and the only trace was a card that appeared for a
 * moment and vanished. This keeps a running, inspectable record — which model
 * was picked and why, when the download started, how long it took, when it
 * became ready — surfaced through the bell in the navbar.
 *
 * Deliberately in-memory: it's a log of what happened during THIS visit, not
 * state to persist.
 */

export type NoticeKind = 'info' | 'progress' | 'success' | 'error';

export interface Notice {
  id: number;
  kind: NoticeKind;
  title: string;
  detail?: string;
  /** ms since epoch — stamped on creation. */
  at: number;
  read: boolean;
  /** Stable key so a repeating event (download progress) updates in place. */
  tag?: string;
}

type Listener = (notices: Notice[]) => void;

const listeners = new Set<Listener>();
let notices: Notice[] = [];
let nextId = 1;

const MAX = 30;

function publish(): void {
  listeners.forEach((l) => l(notices));
}

export function onNotices(cb: Listener): () => void {
  listeners.add(cb);
  cb(notices);
  return () => listeners.delete(cb);
}

export const getNotices = (): Notice[] => notices;
export const unreadCount = (): number => notices.filter((n) => !n.read).length;

/**
 * Add a notice, or update the existing one carrying the same `tag`.
 *
 * Tagging is what keeps a download from spamming thirty lines: the progress
 * entry rewrites itself in place and only terminal events get their own row.
 */
export function notify(input: {
  kind: NoticeKind;
  title: string;
  detail?: string;
  tag?: string;
}): void {
  const { kind, title, detail, tag } = input;

  if (tag) {
    const existing = notices.find((n) => n.tag === tag);
    if (existing) {
      existing.kind = kind;
      existing.title = title;
      existing.detail = detail;
      existing.at = Date.now();
      existing.read = false;
      notices = [...notices];
      publish();
      return;
    }
  }

  notices = [
    { id: nextId++, kind, title, detail, at: Date.now(), read: false, tag },
    ...notices,
  ].slice(0, MAX);
  publish();
}

/** Drop the tag from a notice so later events start a fresh row. */
export function untag(tag: string): void {
  const existing = notices.find((n) => n.tag === tag);
  if (!existing) return;
  existing.tag = undefined;
  notices = [...notices];
}

export function markAllRead(): void {
  if (!notices.some((n) => !n.read)) return;
  notices = notices.map((n) => (n.read ? n : { ...n, read: true }));
  publish();
}

export function clearNotices(): void {
  notices = [];
  publish();
}
