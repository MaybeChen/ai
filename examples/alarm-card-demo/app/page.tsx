'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useMemo, useState } from 'react';
import { AlarmCard } from '@/components/alarm-card';
import { alertDocument, alertWorkOrder, defaultPrompt } from '@/lib/alarm-data';
import { alertCardSchema } from '@/lib/schema';

export default function Page() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [submittedPrompt, setSubmittedPrompt] = useState(defaultPrompt);

  const { submit, object, isLoading, stop, error, clear } = useObject({
    api: '/api/generate-card',
    schema: alertCardSchema,
  });

  const workOrderJson = useMemo(
    () => JSON.stringify(alertWorkOrder, null, 2),
    [],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <header className="rounded-[32px] border border-slate-800 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">
              Generative Alert UI Demo
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              stream + output.object 告警卡片生成式 UI
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              参照 chat 风格布局，将固定测试告警输入到 Vercel AI SDK
              的结构化流式输出中，实时渲染原子组件卡片与流程图。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            <div>模型地址：http://10.50.95.196:8000/v1</div>
            <div>模型名称：qwen3.5</div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 rounded-[28px] border border-slate-800 bg-slate-950/70 p-5 shadow-glow">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              测试工单
            </div>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900/90 p-4 text-xs leading-6 text-slate-200">
              {workOrderJson}
            </pre>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              告警资料
            </div>
            <pre className="mt-3 max-h-[420px] overflow-auto rounded-2xl bg-slate-900/90 p-4 text-xs leading-6 text-slate-200 whitespace-pre-wrap">
              {alertDocument}
            </pre>
          </div>
        </aside>

        <section className="flex min-h-[720px] flex-col rounded-[28px] border border-slate-800 bg-slate-950/70 shadow-glow">
          <div className="flex-1 space-y-6 overflow-auto p-5 lg:p-6">
            <div className="flex justify-end">
              <div className="max-w-2xl rounded-[28px] border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm leading-7 text-sky-50">
                <div className="mb-2 text-xs uppercase tracking-[0.28em] text-sky-300/80">
                  User
                </div>
                {submittedPrompt}
              </div>
            </div>

            <div className="flex justify-start">
              <div className="w-full max-w-4xl rounded-[28px] border border-slate-800 bg-slate-900/60 p-3 lg:p-4">
                <div className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-500">
                  Assistant
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
              setSubmittedPrompt(prompt);
              submit({ prompt });
            }}
          >
            <div className="rounded-[28px] border border-slate-700 bg-slate-900/90 p-3">
              <textarea
                value={prompt}
                onChange={event => setPrompt(event.target.value)}
                rows={4}
                className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="输入你的卡片生成指令..."
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-500">
                  卡片中的文字会随着 partial object 持续刷新。
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setPrompt(defaultPrompt);
                      setSubmittedPrompt(defaultPrompt);
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
                    {isLoading ? '生成中...' : '生成告警卡片'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
