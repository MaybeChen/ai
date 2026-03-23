import type { PartialAlertCard } from '@/lib/schema';
import { Flowchart } from './flowchart';

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-glow">
      <div className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">
        {title}
      </div>
      {children}
    </section>
  );
}

function BulletList({
  items,
  placeholder,
}: {
  items?: Array<string | undefined>;
  placeholder: string;
}) {
  const normalizedItems = (items ?? []).filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );

  return (
    <ul className="space-y-3 text-sm leading-6 text-slate-200">
      {normalizedItems.length ? (
        normalizedItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
            <span>{item}</span>
          </li>
        ))
      ) : (
        <li className="text-slate-500">{placeholder}</li>
      )}
    </ul>
  );
}

export function AlarmCard({ card }: { card?: PartialAlertCard }) {
  const locations = (card?.location ?? []).filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-glow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Chip>{card?.alarmId ?? 'ALM-100116'}</Chip>
              <Chip>{card?.severity ?? '告警等级生成中'}</Chip>
              <Chip>{card?.status ?? '等待模型输出'}</Chip>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {card?.title ?? '告警卡片生成中'}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {card?.summary ??
                  '模型正在根据工单和资料构建结构化处置建议，请稍候...'}
              </p>
            </div>
          </div>
          <div className="min-w-[220px] rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              下一观察点
            </div>
            <div className="mt-3 text-3xl font-semibold text-sky-300">
              {card?.nextObservation?.waitSeconds ?? '--'}s
            </div>
            <p className="mt-2 leading-6 text-slate-400">
              {card?.nextObservation?.checkpoint ?? '等待模型生成检查点说明。'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Section title="定位信息">
            <div className="flex flex-wrap gap-2">
              {locations.length ? (
                locations.map((item, index) => (
                  <Chip key={`${item}-${index}`}>{item}</Chip>
                ))
              ) : (
                <p className="text-sm text-slate-500">定位信息拆解中...</p>
              )}
            </div>
          </Section>

          <Section title="业务影响">
            <BulletList items={card?.impact} placeholder="业务影响生成中..." />
          </Section>

          <Section title="即时处置动作">
            <BulletList
              items={card?.immediateActions}
              placeholder="正在整理推荐动作..."
            />
          </Section>

          <Section title="流程图">
            <Flowchart flowchart={card?.flowchart} />
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="可能原因">
            <BulletList
              items={card?.possibleCauses}
              placeholder="可能原因提炼中..."
            />
          </Section>

          <Section title="升级建议">
            <div className="space-y-3 text-sm leading-6 text-slate-200">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  责任方
                </div>
                <p className="mt-1">{card?.escalation?.owner ?? '生成中...'}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  升级条件
                </div>
                <p className="mt-1">
                  {card?.escalation?.condition ?? '生成中...'}
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
