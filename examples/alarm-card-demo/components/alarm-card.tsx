import type { PartialAlertCard } from '@/lib/schema';
import { Flowchart } from './flowchart';

type Block = NonNullable<PartialAlertCard['blocks']>[number];

type Tone = 'neutral' | 'info' | 'warning' | 'danger' | 'success';

const toneStyles: Record<Tone, string> = {
  neutral: 'border-slate-800 bg-slate-950/80 text-slate-200',
  info: 'border-sky-400/30 bg-sky-400/10 text-sky-50',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-50',
  danger: 'border-rose-400/30 bg-rose-400/10 text-rose-50',
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-50',
};

function BlockShell({
  tone = 'neutral',
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[26px] border p-5 shadow-glow transition ${toneStyles[tone]}`}
    >
      {children}
    </section>
  );
}

function normalizeTone(value?: string): Tone {
  switch (value) {
    case 'info':
    case 'warning':
    case 'danger':
    case 'success':
      return value;
    default:
      return 'neutral';
  }
}

function renderBlock(block: Block, index: number) {
  if (!block) {
    return null;
  }

  const tone = normalizeTone(block.tone);
  const items = (block.items ?? []).filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );
  const pairs = (block.pairs ?? []).filter(
    (pair): pair is { label?: string; value?: string } => Boolean(pair),
  );

  switch (block.type) {
    case 'headline':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-3">
            {block.title ? (
              <div className="text-xs uppercase tracking-[0.32em] text-slate-400">
                {block.title}
              </div>
            ) : null}
            <div className="text-2xl font-semibold tracking-tight text-white">
              {block.text ?? '标题生成中...'}
            </div>
          </div>
        </BlockShell>
      );

    case 'thinking-steps':
      return (
        <BlockShell key={block.id ?? index} tone={tone === 'neutral' ? 'info' : tone}>
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-300/90">
              {block.title ?? '思考过程'}
            </div>
            <ol className="space-y-3 text-sm leading-7 text-current/90">
              {items.length ? (
                items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/15 text-xs">
                      {itemIndex + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-300/70">正在整理可展示的思考步骤...</li>
              )}
            </ol>
          </div>
        </BlockShell>
      );

    case 'status-strip':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="flex flex-wrap gap-2">
            {items.length ? (
              items.map((item, itemIndex) => (
                <span
                  key={`${item}-${itemIndex}`}
                  className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-current"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">状态条生成中...</span>
            )}
          </div>
        </BlockShell>
      );

    case 'paragraph':
    case 'callout':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-3">
            {block.title ? (
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                {block.title}
              </div>
            ) : null}
            <p className="text-sm leading-7 text-current/90">
              {block.text ?? '说明内容生成中...'}
            </p>
          </div>
        </BlockShell>
      );

    case 'bullet-list':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              {block.title ?? '列表区块'}
            </div>
            <ul className="space-y-3 text-sm leading-7 text-current/90">
              {items.length ? (
                items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-current/70" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">列表内容生成中...</li>
              )}
            </ul>
          </div>
        </BlockShell>
      );

    case 'key-value-list':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              {block.title ?? '键值信息'}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pairs.length ? (
                pairs.map((pair, pairIndex) => (
                  <div
                    key={`${pair.label}-${pairIndex}`}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {pair.label ?? '字段'}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-current/90">
                      {pair.value ?? '生成中...'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400">键值内容生成中...</div>
              )}
            </div>
          </div>
        </BlockShell>
      );

    case 'metric':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {block.title ?? '关键指标'}
            </div>
            <div className="text-4xl font-semibold text-white">
              {block.value ?? '--'}
            </div>
            <p className="text-sm leading-6 text-current/80">
              {block.text ?? '指标说明生成中...'}
            </p>
          </div>
        </BlockShell>
      );

    case 'flowchart':
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
              {block.title ?? '流程图'}
            </div>
            <Flowchart flowchart={block.flowchart} />
          </div>
        </BlockShell>
      );

    default:
      return (
        <BlockShell key={block.id ?? index} tone={tone}>
          <p className="text-sm text-slate-400">区块生成中...</p>
        </BlockShell>
      );
  }
}

export function AlarmCard({ card }: { card?: PartialAlertCard }) {
  const blocks = (card?.blocks ?? []).filter((block): block is Block =>
    Boolean(block),
  );

  return (
    <div className="space-y-4">
      {card?.title ? (
        <div className="text-3xl font-semibold tracking-tight text-white">
          {card.title}
        </div>
      ) : null}

      {blocks.length ? (
        <div className="space-y-4">{blocks.map(renderBlock)}</div>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-400 shadow-glow">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
          正在规划第一批原子组件...
        </div>
      )}
    </div>
  );
}
