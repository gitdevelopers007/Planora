import { useState, type KeyboardEvent } from 'react';
import type { IntakeParse } from '../schemas';
import { parseIntake, type RequestOptions } from '../lib/api';
import { useAiCall } from '../lib/useAiCall';
import { AnswerMeta } from './ThinkingTrace';
import { AiError, AiLoading } from './ui';
import { Icon } from './Icon';

export const EXAMPLE_EVENT =
  'Shaadi in Pune, 200 guests, 8 lakh budget, mid-Feb, simple ceremony but premium food';

const SAMPLE_PROMPTS = [
  {
    label: '💍 Traditional Wedding',
    text: 'Plan a traditional wedding in Pune for 200 guests with a budget of ₹8 lakh in February. I want premium food, elegant decorations, and a simple ceremony.',
  },
  {
    label: '🎉 30th Birthday Bash',
    text: 'Birthday party in Mumbai for 50 close friends, budget 1.5 lakh, next month. Needs acoustic music, finger foods and custom photo booth.',
  },
  {
    label: '🪔 Community Festival',
    text: 'Community Diwali celebration for 400 people, ₹5 lakh total budget in November. Stage lighting, catering buffet, sound system, and safety management.',
  },
];

/**
 * Free-text intake with GenAI. Gemini parses the natural language description into
 * structured event parameters (occasion, budget, guests, date, vibe, priorities).
 */
export function DescribeEvent({ onParsed }: { onParsed: (result: IntakeParse) => string[] }) {
  const [description, setDescription] = useState('');
  const [filled, setFilled] = useState<string | null>(null);
  const ai = useAiCall((options: RequestOptions, text: string) => parseIntake(text, options));

  /** Tab on an empty box accepts the example, like ghost-text autocomplete in an editor. */
  function acceptExample(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Tab' || event.shiftKey || description !== '') return;
    event.preventDefault();
    setDescription(EXAMPLE_EVENT);
  }

  async function fill(textToUse?: string) {
    const text = textToUse ?? description;
    if (!text.trim()) return;
    setFilled(null);
    const result = await ai.run(text);
    if (!result) return;
    const found = onParsed(result);
    setFilled(
      found.length
        ? `Filled ${found.join(', ')}. Please check the details before creating your plan.`
        : 'We could not find event details in that text. You can fill the form below by hand.',
    );
  }

  return (
    <section className="card border-accent/20 bg-card shadow-sm lg:sticky lg:top-24" aria-labelledby="describe-h">
      <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon name="sparkle" className="h-4 w-4" />
          </div>
          <div>
            <h2 id="describe-h" className="font-display text-base font-bold text-ink">
              Describe your event
            </h2>
          </div>
        </div>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
          Instant Fill
        </span>
      </div>

      <p className="hint mt-3">
        Write it the way you would tell a friend. We will fill the form for you.
      </p>

      {/* Quick Example Chips */}
      <div className="mt-3 space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/75">
          Quick suggestions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setDescription(sample.text);
              }}
              className="rounded-lg border border-line bg-paper/80 px-2.5 py-1 text-xs font-medium text-ink transition-all hover:border-accent hover:bg-accent-soft hover:text-accent"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="describe" className="sr-only">
          Event description
        </label>
        <textarea
          id="describe"
          className="input min-h-28 text-sm leading-relaxed"
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={EXAMPLE_EVENT}
          aria-describedby={description === '' ? 'describe-tab-hint' : undefined}
          onKeyDown={acceptExample}
        />
        {description === '' && (
          <p id="describe-tab-hint" className="hint mt-1">
            Press <kbd className="rounded border border-line px-1.5 text-xs">Tab</kbd> to use this example.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={() => void fill()}
          disabled={description.trim() === '' || ai.state.status === 'loading'}
        >
          Fill form from description
        </button>
        <span className="text-[11px] text-ink-soft">
          {description.length}/1000 · AI suggestion, always check it
        </span>
      </div>

      <div className="mt-3" aria-live="polite">
        {ai.state.status === 'loading' && (
          <AiLoading label="Gemini is reading your description…" progress={ai.progress} />
        )}
        {ai.state.status === 'error' && (
          <AiError message={ai.state.message} onRetry={() => void fill()} />
        )}
        {filled && ai.state.status === 'done' && (
          <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-3">
            <p className="text-sm font-medium text-accent">{filled}</p>
            <AnswerMeta progress={ai.progress} />
          </div>
        )}
      </div>
    </section>
  );
}
