import { useState } from 'react';
import { Icon } from './Icon';
import type { Plan } from '../schemas';
import { shareHash } from '../state/share';
import { Confirm } from './ui';

export function SidebarFooter({
  plan,
  theme,
  onToggleTheme,
  onReset,
}: {
  plan: Plan | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  async function handleShare() {
    if (!plan) return;
    const url = `${window.location.origin}${window.location.pathname}${shareHash(plan)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback('Link copied!');
      setTimeout(() => setShareFeedback(null), 3000);
    } catch {
      setShareFeedback('Copy failed');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  }

  return (
    <div className="border-t border-line/60 bg-field/40 p-3 space-y-2">
      {shareFeedback && (
        <div className="rounded-lg bg-ok-soft p-1.5 text-center text-xs font-semibold text-ok animate-fadeIn">
          ✓ {shareFeedback}
        </div>
      )}

      {confirmReset && (
        <div className="mb-2">
          <Confirm
            prompt="Reset the whole plan? Your budget, timeline and quotations will be cleared from this browser."
            confirmLabel="Yes, reset"
            onConfirm={() => {
              setConfirmReset(false);
              onReset();
            }}
            onCancel={() => setConfirmReset(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {plan && (
          <>
            <button
              type="button"
              className="btn-secondary justify-center py-2 text-xs"
              onClick={handleShare}
              aria-label="Export workspace link"
            >
              <Icon name="link" className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="btn-secondary justify-center py-2 text-xs"
              onClick={() => window.print()}
              aria-label="Print workspace summary"
            >
              <Icon name="printer" className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </>
        )}

        <button
          type="button"
          className="btn-secondary col-span-1 justify-center py-2 text-xs"
          onClick={onToggleTheme}
          aria-label="Toggle theme appearance"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-3.5 w-3.5" />
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {plan ? (
          <button
            type="button"
            className="btn-secondary col-span-1 justify-center py-2 text-xs text-warn hover:bg-warn-soft/40"
            onClick={() => setConfirmReset(true)}
            title="Reset current plan"
            aria-label="Clear workspace data"
          >
            <Icon name="reset" className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        ) : (
          <div className="flex items-center justify-center text-[10px] text-ink-soft">
            v2.0 · GenAI
          </div>
        )}
      </div>
      <p className="pt-1 text-center text-[10px] font-medium text-ink-soft/70">
        Planora · Effortless AI Planning
      </p>
    </div>
  );
}
