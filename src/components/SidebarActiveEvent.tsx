import { diffDays, OCCASION_LABELS, planReadiness, toLakh } from '../engine';
import type { Plan } from '../schemas';

export function SidebarActiveEvent({ plan, today }: { plan: Plan; today: string }) {
  const readiness = planReadiness(plan);
  const days = diffDays(today, plan.eventDate);

  return (
    <div className="rounded-2xl border border-accent/25 bg-accent-soft/30 p-3.5 shadow-sm transition-all hover:border-accent/40">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            Active Celebration
          </span>
          <p className="font-display text-sm font-bold text-ink">
            {OCCASION_LABELS[plan.occasion]}
          </p>
        </div>
        <span
          className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${
            days >= 0 && days <= 14 ? 'bg-warn-soft text-warn' : 'bg-accent text-on-accent shadow-xs'
          }`}
        >
          {days === 0 ? 'Today!' : days > 0 ? `${days}d left` : `${Math.abs(days)}d ago`}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-ink-soft">
        <span>
          Budget: <strong className="text-ink">{toLakh(plan.totalBudget)}</strong>
        </span>
        <span>{plan.guests} guests</span>
      </div>

      <div className="mt-2.5">
        <div className="flex justify-between text-[11px] font-medium text-ink-soft">
          <span>Readiness</span>
          <span className="font-semibold text-accent">{readiness.percent}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${readiness.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
