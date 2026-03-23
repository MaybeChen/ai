import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { Output, streamText } from 'ai';
import { z } from 'zod';
import { alertDocument, alertWorkOrder } from '@/lib/alarm-data';
import { alertCardSchema } from '@/lib/schema';

export const maxDuration = 30;

const requestSchema = z.object({
  prompt: z.string().min(1),
});

const modelFactory = createOpenAICompatible({
  name: 'local-qwen',
  baseURL: 'http://10.50.95.196:8000/v1',
  supportsStructuredOutputs: true,
});

export async function POST(req: Request) {
  const { prompt } = requestSchema.parse(await req.json());

  const result = streamText({
    model: modelFactory.chatModel('qwen3.5'),
    output: Output.object({ schema: alertCardSchema }),
    temperature: 0.2,
    prompt: [
      '你是一名NOC值守专家，需要把原始告警资料整理成适合在监控大屏中阅读的结构化告警卡片。',
      '输出必须符合给定 schema，字段内容全部使用简体中文。',
      'summary、title、status、impact、possibleCauses、immediateActions、flowchart 节点 detail 都要可直接展示，避免空话。',
      'flowchart 中至少生成 5 个节点，并覆盖人工复位、主动复位、等待240秒、升级华为技术支持等关键分支。',
      'location 需要拆成数组，每项只保留一个键值描述。',
      'nextObservation.waitSeconds 固定为 240。',
      '',
      `用户目标：${prompt}`,
      `告警工单：${JSON.stringify(alertWorkOrder, null, 2)}`,
      `告警资料：\n${alertDocument}`,
    ].join('\n'),
  });

  return result.toTextStreamResponse();
}
