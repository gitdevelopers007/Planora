import { useState } from 'react';
import { planReadiness } from '../engine';
import type { Plan } from '../schemas';
import { shareHash } from '../state/share';
import { BrandMark, Icon } from './Icon';
import { useTheme } from '../lib/theme';
import { Confirm } from './ui';

export function Header({
  plan,
  onReset,
  onOpenMobileMenu,
}: {
  plan: Plan | null;
  onReset: () => void;
  onOpenMobileMenu?: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [share, setShare] = useState<{ status: 'copied' | 'manual'; url: string } | null>(null);
  const readiness = plan ? planReadiness(plan) : null;
  const { theme, toggle } = useTheme();

  async function copyLink(current: Plan) {
    const url = `${window.location.origin}${window.location.pathname}${shareHash(current)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShare({ status: 'copied', url });
    } catch {
      setShare({ status: 'manual', url });
    }
  }

  return (
    <header className="no-print webuild-header sticky top-0 z-30 bg-card/85 backdrop-blur-md border-b border-line/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              className="btn-secondary p-2 lg:hidden"
              onClick={onOpenMobileMenu}
              aria-label="Open sidebar menu"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          )}
          <BrandMark className="h-9 w-9 shadow-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-ink">
                Planora
              </h1>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                AI
              </span>
            </div>
            <p className="hidden text-xs text-ink-soft sm:block">
              Planning made effortless with AI
            </p>
          </div>
        </div>

        {readiness && (
          <div className="order-last w-full sm:order-none sm:w-64" aria-label="Event readiness">
            <p className="flex items-baseline justify-between text-sm font-medium">
              <span>Plan readiness {readiness.percent}%</span>
              <span className="text-xs font-normal text-ink-soft">
                {readiness.tasksDone}/{readiness.tasksTotal} tasks · {readiness.quotesVerified}/
                {readiness.quotesTotal} vendors
              </span>
            </p>
            <progress
              className="mt-1 h-1.5 w-full overflow-hidden rounded-full accent-accent"
              max={100}
              value={readiness.percent}
              aria-label="Event readiness percent"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          {plan && (
            <>
              <button type="button" className="btn-secondary" onClick={() => void copyLink(plan)}>
                <Icon name="link" />
                <span className="sr-only sm:not-sr-only">Share link</span>
              </button>
              <button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Icon name="printer" />
                <span className="sr-only sm:not-sr-only">Print summary</span>
              </button>
              <button type="button" className="btn-secondary" onClick={() => setConfirmReset(true)}>
                <Icon name="reset" />
                <span className="sr-only sm:not-sr-only">Reset</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-live="polite">
        {share?.status === 'copied' && (
          <p className="flex items-center gap-2 pb-3 text-sm font-medium text-ok">
            <Icon name="check" />
            Link copied — share it with your family!
          </p>
        )}
        {share?.status === 'manual' && (
          <div className="pb-3">
            <label htmlFor="share-url" className="label">
              Copy this link
            </label>
            <input
              id="share-url"
              readOnly
              className="input"
              value={share.url}
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        )}
        {confirmReset && (
          <div className="pb-3">
            <Confirm
              prompt="Reset the whole plan? Your budget, timeline and quotations will be cleared from this browser."
              confirmLabel="Yes, reset"
              onCancel={() => setConfirmReset(false)}
              onConfirm={() => {
                setConfirmReset(false);
                onReset();
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
