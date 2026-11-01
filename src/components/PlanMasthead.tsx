import { diffDays, OCCASION_LABELS, toLakh } from '../engine';
import type { Plan } from '../schemas';
import { formatDate } from '../lib/format';
import { Icon } from './Icon';

function countdown(days: number): string {
  if (days > 1) return `${days} days to go`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today';
  return 'This date has passed';
}

const OCCASION_EMOJI: Record<string, string> = {
  wedding: '💍',
  birthday: '🎂',
  corporate: '🏢',
  community: '🌿',
  other: '🎉',
};

/** The event at a glance, shown above every tab so the plan always feels like one thing. */
export function PlanMasthead({ plan, today }: { plan: Plan; today: string }) {
  const days = diffDays(today, plan.eventDate);
  const emoji = OCCASION_EMOJI[plan.occasion] ?? '✦';
  const isUrgent = days >= 0 && days <= 30;
  return (
    <section aria-label="Plan summary" className="mb-5">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2
            id="plan-title"
            tabIndex={-1}
            className="gradient-heading text-3xl leading-tight sm:text-4xl"
          >
            {emoji} {OCCASION_LABELS[plan.occasion]}
            <span className="block text-ink-soft sm:inline sm:text-2xl">
              <span className="hidden sm:inline"> · </span>
              {formatDate(plan.eventDate)}
            </span>
          </h2>
          {plan.vibe && (
            <p className="mt-1.5 font-display text-base italic text-ink-soft">{plan.vibe}</p>
          )}
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            <li className="flex items-center gap-1.5">
              <Icon name="users" />
              {plan.guests} guests
            </li>
            <li className="flex items-center gap-1.5">
              <Icon name="wallet" />
              {toLakh(plan.totalBudget)} budget
            </li>
            <li
              className={`flex items-center gap-1.5 font-medium ${isUrgent && days > 0 ? 'text-warn' : days === 0 ? 'text-ok' : ''}`}
            >
              <Icon name="calendar" />
              {countdown(days)}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
