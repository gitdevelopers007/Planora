import { type KeyboardEvent, type MutableRefObject } from 'react';
import { BrandMark, Icon, type IconName } from './Icon';
import { planReadiness, toLakh } from '../engine';
import type { Plan } from '../schemas';
import { SidebarActiveEvent } from './SidebarActiveEvent';
import { SidebarFooter } from './SidebarFooter';

export type TabId = 'setup' | 'budget' | 'timeline' | 'vendors';

export interface TabItem {
  id: TabId;
  label: string;
  sublabel: string;
  icon: IconName;
}

export const NAV_ITEMS: readonly TabItem[] = [
  { id: 'setup', label: 'Plan setup', sublabel: 'Details & AI vision', icon: 'pencil' },
  { id: 'budget', label: 'Budget', sublabel: 'Allocations & buffers', icon: 'wallet' },
  { id: 'timeline', label: 'Timeline', sublabel: 'Milestones & schedule', icon: 'route' },
  { id: 'vendors', label: 'Vendors', sublabel: 'Quotes & verification', icon: 'store' },
] as const;

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  tabRefs?: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  plan: Plan | null;
  today: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onReset: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAssistant?: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  onKeyDown,
  tabRefs,
  plan,
  today,
  isOpenMobile,
  onCloseMobile,
  onReset,
  theme,
  onToggleTheme,
  onOpenAssistant,
}: SidebarProps) {
  const readiness = plan ? planReadiness(plan) : null;

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Application Sidebar"
      >
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 shadow-sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                  Planora
                </span>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium leading-none text-ink-soft">
                Planning made effortless with AI
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-quiet p-1.5 lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-3.5 py-4">
          {plan && <SidebarActiveEvent plan={plan} today={today} />}

          <div className="space-y-1">
            <p className="px-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft/80">
              Workspace
            </p>
            <div role="tablist" aria-label="Plan sections" className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentTab === item.id;
                let badge: string | null = null;
                if (plan) {
                  if (item.id === 'budget') badge = toLakh(plan.totalBudget);
                  if (item.id === 'timeline' && readiness) {
                    badge = `${readiness.tasksDone}/${readiness.tasksTotal}`;
                  }
                  if (item.id === 'vendors' && readiness) {
                    badge = `${readiness.quotesVerified}/${readiness.quotesTotal}`;
                  }
                }

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      if (tabRefs) tabRefs.current[item.id] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`tab-${item.id}`}
                    aria-label={item.label}
                    aria-selected={isActive}
                    aria-controls={`panel-${item.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    onKeyDown={onKeyDown}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-accent text-on-accent shadow-md shadow-accent/20'
                        : 'text-ink-soft hover:bg-accent-soft/70 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          isActive ? 'bg-white/20 text-white' : 'bg-card text-accent group-hover:bg-accent/15'
                        }`}
                      >
                        <Icon name={item.icon} className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="leading-tight">{item.label}</div>
                        <div
                          className={`text-[11px] font-normal leading-none ${
                            isActive ? 'text-white/80' : 'text-ink-soft/70'
                          }`}
                        >
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                    {badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive ? 'bg-white/25 text-white' : 'bg-accent-soft text-accent'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <p className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft/80">
              AI Companion
            </p>
            <div className="rounded-xl border border-line bg-card/60 p-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon name="sparkle" className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Planora AI Coach</p>
                  <p className="text-[11px] text-ink-soft">GenAI Event Intelligence</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
                Detects timeline delays, vendor quote gaps, and adjusts budget distributions.
              </p>
              {onOpenAssistant && plan && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAssistant();
                    onCloseMobile();
                  }}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent/15 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-on-accent"
                >
                  <Icon name="sparkle" className="h-3.5 w-3.5" />
                  Explore AI Planner
                </button>
              )}
            </div>
          </div>
        </div>

        <SidebarFooter
          plan={plan}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onReset={onReset}
        />
      </aside>
    </>
  );
}
