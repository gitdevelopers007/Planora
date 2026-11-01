import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { AssistantPanel } from './components/AssistantPanel';
import { BudgetTab } from './components/BudgetTab';
import { Header } from './components/Header';
import { Icon } from './components/Icon';
import { PlanMasthead } from './components/PlanMasthead';
import { PlanSetup } from './components/PlanSetup';
import { ProgressPanel } from './components/ProgressPanel';
import { PrintSummary } from './components/PrintSummary';
import { Sidebar, NAV_ITEMS, type TabId } from './components/Sidebar';
import { TimelineTab } from './components/TimelineTab';
import { Toast } from './components/Toast';
import { EmptyState } from './components/ui';
import { todayISO } from './lib/today';
import { useTheme } from './lib/theme';
import type { Plan } from './schemas';
import { loadInitial, safeStorage, usePlanStore, type InitialLoad } from './state/planStore';

const VendorsTab = lazy(() => import('./components/VendorsTab'));
const IdeasPanel = lazy(() => import('./components/IdeasPanel'));

function readInitial(): InitialLoad {
  return loadInitial(window.location.hash, safeStorage());
}

export default function App({ initial, today: todayProp }: { initial?: InitialLoad; today?: string }) {
  const [boot] = useState<InitialLoad>(() => initial ?? readInitial());
  const [today] = useState(() => todayProp ?? todayISO());
  const { state, dispatch } = usePlanStore(boot);
  const [tab, setTab] = useState<TabId>(boot.plan ? 'budget' : 'setup');
  const [notice, setNotice] = useState(boot.notice);
  const [progressOpen, setProgressOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const [grabbed, setGrabbed] = useState<Plan | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dismissToast = useCallback(() => dispatch({ type: 'dismissToast' }), [dispatch]);
  const plan = state.plan;

  useEffect(() => {
    if (!grabbed) return;
    const release = () => setGrabbed(null);
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    return () => {
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
    };
  }, [grabbed]);

  const focusTitleNext = useRef(false);
  useEffect(() => {
    if (!focusTitleNext.current || !plan) return;
    focusTitleNext.current = false;
    document.getElementById('plan-title')?.focus();
  }, [plan]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const index = NAV_ITEMS.findIndex((t) => t.id === tab);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % NAV_ITEMS.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = NAV_ITEMS.length - 1;
    else return;
    event.preventDefault();
    const target = NAV_ITEMS[next];
    if (target) {
      setTab(target.id);
      refs.current[target.id]?.focus();
    }
  }

  const handleReset = useCallback(() => {
    dispatch({ type: 'reset' });
    setTab('setup');
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
  }, [dispatch]);

  const scrollToAssistant = useCallback(() => {
    document.getElementById('assistant-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const needPlan = (
    <EmptyState
      title="Create your plan first and this section comes alive."
      action="Go to Plan setup"
      onAction={() => setTab('setup')}
    />
  );

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#main"
        className="sr-only-focusable no-print fixed left-2 top-2 z-50 rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent shadow-lg"
      >
        Skip to main content
      </a>

      <Header plan={plan} onReset={handleReset} onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

      <Sidebar
        currentTab={tab}
        onSelectTab={setTab}
        onKeyDown={onKeyDown}
        tabRefs={refs}
        plan={plan}
        today={today}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAssistant={scrollToAssistant}
      />

      <div className="lg:pl-72 transition-all duration-300">
        <main
          id="main"
          className="no-print mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8"
          onPointerDownCapture={(event) => {
            if (plan && event.target instanceof HTMLInputElement && event.target.type === 'range') {
              setGrabbed(plan);
            }
          }}
        >
          {notice && (
            <div
              role="status"
              className={`mb-5 flex items-start justify-between gap-3 rounded-2xl border p-3.5 text-sm ${
                notice.kind === 'bad_link' ? 'border-warn bg-warn-soft text-warn' : 'border-line bg-accent-soft'
              }`}
            >
              <p className="flex items-center">
                {notice.kind === 'bad_link' && <Icon name="alert" className="mr-2 inline h-4 w-4" />}
                {notice.message}
              </p>
              <button type="button" className="btn-quiet shrink-0 text-xs font-semibold" onClick={() => setNotice(null)}>
                Dismiss
              </button>
            </div>
          )}

          {plan && <PlanMasthead plan={plan} today={today} />}
          {plan && (
            <div id="assistant-panel" className="mb-6">
              <AssistantPanel plan={grabbed ?? plan} today={today} onNavigate={setTab} />
            </div>
          )}

          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="panel-enter" key={tab}>
            {tab === 'setup' && (
              <div className="space-y-6">
                <PlanSetup
                  key={plan ? 'existing' : 'new'}
                  today={today}
                  existing={plan}
                  onCreate={(created) => {
                    focusTitleNext.current = true;
                    dispatch({ type: 'create', plan: created });
                    setTab('budget');
                  }}
                />
                {plan && (
                  <Suspense fallback={<p role="status" className="p-4 text-sm text-ink-soft">Loading ideas…</p>}>
                    <IdeasPanel plan={plan} />
                  </Suspense>
                )}
              </div>
            )}
            {tab === 'budget' && (plan ? <BudgetTab plan={plan} dispatch={dispatch} /> : needPlan)}
            {tab === 'timeline' && (plan ? <TimelineTab plan={plan} today={today} dispatch={dispatch} /> : needPlan)}
            {tab === 'vendors' &&
              (plan ? (
                <Suspense fallback={<p role="status" className="p-4 text-sm text-ink-soft">Loading vendors…</p>}>
                  <VendorsTab plan={plan} dispatch={dispatch} />
                </Suspense>
              ) : (
                needPlan
              ))}
          </div>
        </main>
      </div>

      {plan && (
        <ProgressPanel
          plan={plan}
          open={progressOpen}
          onToggle={() => setProgressOpen((v) => !v)}
          onNavigate={(next) => {
            setTab(next);
            setProgressOpen(false);
          }}
        />
      )}
      {plan && <PrintSummary plan={plan} today={today} />}
      <Toast toast={state.toast} occasion={plan?.occasion ?? 'wedding'} onDismiss={dismissToast} />
    </div>
  );
}
