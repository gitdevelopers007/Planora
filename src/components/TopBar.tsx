import { useState } from 'react';
import { BrandMark, Icon } from './Icon';
import { OCCASION_LABELS, planReadiness } from '../engine';
import type { Plan } from '../schemas';
import { shareHash } from '../state/share';
import { Confirm } from './ui';
import type { TabId } from './Sidebar';

interface TopBarProps {
  currentTab: TabId;
  plan: Plan | null;
  onOpenMobileSidebar: () => void;
  onReset: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const TAB_TITLES: Record<TabId, string> = {
  setup: 'Event Overview & Setup',
  budget: 'Smart Dynamic Budget',
  timeline: 'Milestones & Timeline',
  vendors: 'Vendor Directory & Quotes',
};

export function TopBar({
  currentTab,
  plan,
  onOpenMobileSidebar,
  onReset,
  theme,
  onToggleTheme,
}: TopBarProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const readiness = plan ? planReadiness(plan) : null;

  async function handleShare() {
    if (!plan) return;
    const url = `${window.location.origin}${window.location.pathname}${shareHash(plan)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback('Copied!');
      setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback('Failed');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line/70 bg-card/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        {/* Left: Mobile menu toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="btn-secondary p-2 lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark className="h-7 w-7" />
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">Planora</span>
          </div>

          {/* Desktop Breadcrumbs */}
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Planora
            </span>
            <span className="text-ink-soft/40">/</span>
            <h1 className="text-sm font-bold text-ink">
              {TAB_TITLES[currentTab]}
            </h1>
            {plan && (
              <span className="ml-2 rounded-full border border-accent/25 bg-accent-soft/40 px-2.5 py-0.5 text-xs font-semibold text-accent">
                {OCCASION_LABELS[plan.occasion]}
              </span>
            )}
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {readiness && (
            <div className="mr-2 hidden items-center gap-2.5 md:flex" aria-label="Event readiness">
              <div className="text-right">
                <div className="text-xs font-bold leading-none text-ink">
                  {readiness.percent}% Ready
                </div>
                <div className="text-[10px] text-ink-soft">
                  {readiness.tasksDone}/{readiness.tasksTotal} tasks
                </div>
              </div>
              <div className="h-2 w-20 overflow-hidden rounded-full bg-line/60">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${readiness.percent}%` }}
                />
              </div>
            </div>
          )}

          {plan && (
            <>
              <button
                type="button"
                className="btn-secondary hidden sm:inline-flex"
                onClick={handleShare}
                title="Copy shareable link"
              >
                <Icon name="link" className="h-4 w-4" />
                <span className="text-xs">{shareFeedback ?? 'Share'}</span>
              </button>
              <button
                type="button"
                className="btn-secondary hidden sm:inline-flex"
                onClick={() => window.print()}
                title="Print summary"
              >
                <Icon name="printer" className="h-4 w-4" />
                <span className="text-xs">Print</span>
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn-secondary p-2"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-4 w-4" />
          </button>

          {plan && (
            <button
              type="button"
              className="btn-secondary p-2 text-ink-soft hover:text-warn"
              onClick={() => setConfirmReset(true)}
              title="Start fresh"
              aria-label="Reset plan"
            >
              <Icon name="reset" className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {confirmReset && (
        <div className="border-b border-line bg-paper px-4 py-3 sm:px-6">
          <Confirm
            prompt="Start a new celebration plan? This clears the current plan in this browser."
            confirmLabel="Reset Plan"
            onConfirm={() => {
              setConfirmReset(false);
              onReset();
            }}
            onCancel={() => setConfirmReset(false)}
          />
        </div>
      )}
    </>
  );
}
