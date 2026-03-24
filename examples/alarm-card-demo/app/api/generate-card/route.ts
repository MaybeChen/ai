import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { Output, streamText } from 'ai';
import { z } from 'zod';
import { alertCardSchema } from '@/lib/schema';

export const maxDuration = 30;

const requestSchema = z.object({
  alarmInput: z.string().min(1),
});

const modelFactory = createOpenAICompatible({
  name: 'local-qwen',
  baseURL: 'http://10.50.95.196:8000/v1',
  supportsStructuredOutputs: true,
});

export async function POST(req: Request) {
  const { alarmInput } = requestSchema.parse(await req.json());

  const result = streamText({
    model: modelFactory.chatModel('qwen3.5'),
    output: Output.object({ schema: alertCardSchema }),
    temperature: 0.1,
    maxOutputTokens: 900,
    prompt: [
      '你是一名 NOC 值守专家兼生成式 UI 规划器，需要把用户粘贴的原始告警内容整理成一组按顺序展示的原子组件。',
      '不要进行深度思考，不要输出思考过程或分析步骤；直接给出简洁、可执行的结果。',
      '除流程图外，不要预设固定大卡片框架；你需要自己决定先输出哪些 block，再逐步补全后续 block。',
      '你只能依据用户提供的原始告警文本进行总结，不要假设额外信息。',
      '请把 blocks 设计为可以逐步流式展示的原子组件，优先让第一批 block 尽快出现。',
      '可用 block.type 只有：headline、status-strip、paragraph、bullet-list、key-value-list、metric、flowchart、callout。',
      'headline 用于主结论；status-strip 用于标签或状态胶囊；paragraph/callout 用于总结或提醒；bullet-list 用于原因和动作；key-value-list 用于定位信息；metric 用于等待 240s 等关键数字。',
      'flowchart 是唯一允许使用自定义组件的区域，必须单独放在一个 flowchart block 中。',
      'flowchart 中至少生成 5 个节点，并覆盖人工复位、主动复位、等待240秒、升级华为技术支持等关键分支。',
      '所有字段内容全部使用简体中文，blocks 按最终展示顺序输出。',
      '建议尽量先输出 headline，再补充后续 block。',
      '',
      '以下是用户输入的完整告警信息：',
      alarmInput,
    ].join('\n'),
  });

  return result.toTextStreamResponse();
}
