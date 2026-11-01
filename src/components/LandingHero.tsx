import { Icon, type IconName } from './Icon';

interface FeatureCard {
  icon: IconName;
  title: string;
  description: string;
  tag: string;
}

const FEATURE_CARDS: readonly FeatureCard[] = [
  {
    icon: 'sparkle',
    title: 'GenAI Planning & Vision',
    description:
      'Natural-language parsing converts your raw event ideas into structured budgets, timelines, and tailored theme ideas in seconds.',
    tag: 'Gemini Powered',
  },
  {
    icon: 'wallet',
    title: 'Smart Dynamic Budget',
    description:
      'Deterministic INR allocation engine adjusts venue, catering, and decor with contingency safety cushions and zero arithmetic errors.',
    tag: 'Real-Time INR',
  },
  {
    icon: 'route',
    title: 'Timeline & Milestones',
    description:
      'Chronological schedule countdown synced to your celebration date, with day-of-event run sheets and iCalendar export.',
    tag: 'Deadlines & ICS',
  },
  {
    icon: 'store',
    title: 'Vendor Organization',
    description:
      'Category-wise vendor tracking, quote verification, advance payment milestones, and automatic negotiation follow-ups.',
    tag: 'Checklists & Quotes',
  },
] as const;

export function LandingHero({
  onPlanEvent,
  onExploreFeatures,
}: {
  onPlanEvent: () => void;
  onExploreFeatures: () => void;
}) {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-b from-card via-card/90 to-card/50 p-6 sm:p-10 shadow-sm">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft/50 px-3 py-1 text-xs font-semibold text-accent">
            <Icon name="sparkle" className="h-3.5 w-3.5" />
            <span>Planning made effortless with AI</span>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl sm:leading-tight">
            Your vision. Our planning.{' '}
            <span className="gradient-heading block sm:inline">
              One unforgettable event.
            </span>
          </h2>

          <p className="text-base text-ink-soft sm:text-lg leading-relaxed">
            Plan weddings, birthdays, and community celebrations with AI-powered ideas, smart
            budgets, organized timelines, and trusted vendor checklists.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onPlanEvent}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold shadow-md shadow-accent/20"
            >
              <span>Plan My Event</span>
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreFeatures}
              className="btn-secondary px-5 py-2.5 text-sm font-semibold"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      <div id="features-overview" className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Platform Capabilities
          </span>
          <p className="font-display text-xl font-bold text-ink">
            Everything you need to orchestrate a celebration
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_CARDS.map((feat) => (
            <div
              key={feat.title}
              className="card group flex flex-col justify-between border-line/70 p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-on-accent transition-colors">
                    <Icon name={feat.icon} className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-field px-2 py-0.5 text-[10px] font-semibold text-ink-soft border border-line/60">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm font-bold text-ink">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
