'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useState } from 'react';
import { AlarmCard } from '@/components/alarm-card';
import { defaultAlarmInput } from '@/lib/alarm-data';
import { alertCardSchema } from '@/lib/schema';

function summarizeAlarmInput(value: string) {
  const lines = value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.slice(0, 10).join('\n');
}

export default function Page() {
  const [alarmInput, setAlarmInput] = useState(defaultAlarmInput);
  const [submittedInput, setSubmittedInput] = useState(defaultAlarmInput);

  const { submit, object, isLoading, stop, error, clear } = useObject({
    api: '/api/generate-card',
    schema: alertCardSchema,
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <header className="rounded-[32px] border border-slate-800 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">
              Generative Alert UI Demo
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              原始告警输入 → 流式告警卡片
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              只粘贴完整告警信息，提交后 Assistant 卡片会先以空骨架出现，再随着
              partial object 持续补全文字、动作建议和流程图节点。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            <div>模型地址：http://10.50.95.196:8000/v1</div>
            <div>模型名称：qwen3.5</div>
          </div>
        </div>
      </header>

      <section className="flex min-h-[780px] flex-col rounded-[28px] border border-slate-800 bg-slate-950/70 shadow-glow">
        <div className="flex-1 space-y-6 overflow-auto p-5 lg:p-6">
          <div className="flex justify-end">
            <div className="w-full max-w-3xl rounded-[28px] border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm leading-7 text-sky-50">
              <div className="mb-2 text-xs uppercase tracking-[0.28em] text-sky-300/80">
                User Input
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-sky-50">
                {summarizeAlarmInput(submittedInput)}
              </pre>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="w-full max-w-5xl rounded-[28px] border border-slate-800 bg-slate-900/60 p-3 lg:p-4">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-slate-500">
                <span>Assistant Card</span>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-400">
                  {isLoading ? 'Streaming partial object…' : 'Ready'}
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
        </div>

        <form
          className="border-t border-slate-800 p-4 lg:p-5"
          onSubmit={event => {
            event.preventDefault();
            setSubmittedInput(alarmInput);
            clear();
            submit({ alarmInput });
          }}
        >
          <div className="rounded-[28px] border border-slate-700 bg-slate-900/90 p-3">
            <textarea
              value={alarmInput}
              onChange={event => setAlarmInput(event.target.value)}
              rows={14}
              className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="请粘贴完整告警信息，包含【告警工单】和【告警资料】..."
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
              <div className="text-xs text-slate-500">
                输入只有原始告警文本；提交后卡片骨架先出现，字段内容会流式刷新。
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setAlarmInput(defaultAlarmInput);
                    setSubmittedInput(defaultAlarmInput);
                  }}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  恢复示例输入
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
                  {isLoading ? '生成中...' : '生成告警卡片'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
