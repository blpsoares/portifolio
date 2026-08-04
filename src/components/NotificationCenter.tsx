import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CircleAlert, Download, Info, Trash2 } from 'lucide-react';
import {
  clearNotices,
  markAllRead,
  onNotices,
  type Notice,
  type NoticeKind,
} from '../agent/notifications';
import { useI18n } from '../i18n';

/**
 * Bell + dropdown reporting what bra.ia's local models are doing.
 *
 * The local model's lifecycle (which model was picked, how big, downloading,
 * ready, failed) is otherwise invisible — a transient card at best. This gives
 * it a permanent, inspectable home.
 */

const ICONS: Record<NoticeKind, React.ComponentType<{ size?: number; className?: string }>> = {
  info: Info,
  progress: Download,
  success: Check,
  error: CircleAlert,
};

const TONE: Record<NoticeKind, string> = {
  info: 'text-slate-500 dark:text-slate-400',
  progress: 'text-brand-500',
  success: 'text-emerald-500',
  error: 'text-amber-500',
};

/** "agora", "há 3 min" — relative and short, since everything here is recent. */
function ago(at: number, locale: string): string {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (s < 10) return locale === 'pt' ? 'agora' : 'now';
  if (s < 60) return locale === 'pt' ? `há ${s}s` : `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return locale === 'pt' ? `há ${m} min` : `${m}m ago`;
  const h = Math.round(m / 60);
  return locale === 'pt' ? `há ${h}h` : `${h}h ago`;
}

const NotificationCenter: React.FC = () => {
  const { locale } = useI18n();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => onNotices(setNotices), []);

  // Re-render periodically so the relative timestamps stay honest.
  const [, tick] = useState(0);
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => tick((n) => n + 1), 15000);
    return () => window.clearInterval(id);
  }, [open]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unread = notices.filter((n) => !n.read).length;
  const label = locale === 'pt' ? 'Notificações' : 'Notifications';

  const toggle = () => {
    setOpen((prev) => {
      if (!prev) markAllRead();
      return !prev;
    });
  };

  // Nothing has happened yet — don't show a bell that does nothing.
  if (notices.length === 0) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-expanded={open}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-[3px] grid place-items-center rounded-full bg-brand-500 text-[9px] font-bold text-white tabular-nums">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="absolute right-0 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl glass border border-slate-200/80 dark:border-slate-700/60 shadow-xl shadow-slate-900/15 dark:shadow-black/40 overflow-hidden z-50"
          >
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-200/70 dark:border-slate-800/70">
              <p className="text-[12px] font-semibold text-slate-900 dark:text-white">{label}</p>
              <button
                type="button"
                onClick={clearNotices}
                aria-label={locale === 'pt' ? 'Limpar' : 'Clear'}
                className="ml-auto p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <ul className="max-h-[19rem] overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {notices.map((n) => {
                const Icon = ICONS[n.kind];
                return (
                  <li key={n.id} className="flex items-start gap-2.5 px-3.5 py-2.5">
                    <Icon size={13} className={`mt-0.5 shrink-0 ${TONE[n.kind]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium leading-snug text-slate-800 dark:text-slate-100">
                        {n.title}
                      </p>
                      {n.detail && (
                        <p className="mt-0.5 text-[10.5px] leading-snug text-slate-500 dark:text-slate-400 break-words">
                          {n.detail}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[9.5px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {ago(n.at, locale)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
