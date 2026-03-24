'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useMemo, useState } from 'react';
import { AlarmCard } from '@/components/alarm-card';
import { defaultAlarmInput } from '@/lib/alarm-data';
import { alertCardSchema } from '@/lib/schema';

const starterPrompts = [
  'HTTP进程故障告警卡片',
  'TCP进程异常处置',
  '240秒观察流程',
  '华为技术支持升级判断',
] as const;

function summarizeAlarmInput(value: string) {
  const lines = value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.slice(0, 10).join('\n');
}

export default function Page() {
  const [alarmInput, setAlarmInput] = useState(defaultAlarmInput);
  const [submittedInput, setSubmittedInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { submit, object, isLoading, stop, error, clear } = useObject({
    api: '/api/generate-card',
    schema: alertCardSchema,
  });

  const previewInput = useMemo(
    () => summarizeAlarmInput(submittedInput || alarmInput),
    [alarmInput, submittedInput],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between border-b border-slate-900/80 pb-4 text-sm text-slate-400">
        <span className="font-medium text-slate-200">alarm-card-demo</span>
        <span>json-render 风格 landing + 渐进式生成</span>
      </div>

      {!hasSubmitted ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="space-y-5 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              你想分析哪一条告警？
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400">
              直接粘贴完整的【告警工单】和【告警资料】原文；提交后会出现对话气泡，并让卡片以原子组件的方式一点点长出来。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {starterPrompts.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setAlarmInput(defaultAlarmInput)}
                  className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300 transition hover:border-slate-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-1 flex-col gap-6 py-4">
          <div className="flex justify-end">
            <div className="w-full max-w-3xl rounded-[28px] border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm leading-7 text-sky-50">
              <div className="mb-2 text-xs uppercase tracking-[0.28em] text-sky-300/80">
                User Input
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-sky-50">
                {previewInput}
              </pre>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="w-full max-w-5xl rounded-[28px] border border-slate-800 bg-slate-900/40 p-4 lg:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-slate-500">
                <span>Assistant Stream</span>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-400">
                  {isLoading ? 'Blocks streaming…' : 'Ready'}
                </span>
              </div>
              <AlarmCard card={object} />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
              请求失败：{error.message}
            </div>
          ) : null}
        </section>
      )}

      <form
        className="sticky bottom-0 mt-6"
        onSubmit={event => {
          event.preventDefault();
          setSubmittedInput(alarmInput);
          setHasSubmitted(true);
          clear();
          submit({ alarmInput });
        }}
      >
        <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-800 bg-slate-950/90 p-3 shadow-glow backdrop-blur">
          <textarea
            value={alarmInput}
            onChange={event => setAlarmInput(event.target.value)}
            rows={hasSubmitted ? 10 : 6}
            className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
            placeholder="请粘贴完整告警信息，包含【告警工单】和【告警资料】..."
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
            <div className="text-xs text-slate-500">
              会先展示一个可见的“思考过程”摘要，再继续长出标题、状态条、列表和流程图。
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  clear();
                  setHasSubmitted(false);
                  setAlarmInput(defaultAlarmInput);
                  setSubmittedInput('');
                }}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                重置
              </button>
              {isLoading ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="rounded-full border border-rose-400/40 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"
                >
                  停止生成
                </button>
              ) : null}
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-sky-400 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isLoading ? '生成中...' : '开始生成'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
