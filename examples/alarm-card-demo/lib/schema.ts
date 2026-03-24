import { DeepPartial } from 'ai';
import { z } from 'zod';

const flowchartSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      detail: z.string(),
      kind: z.enum(['start', 'decision', 'action', 'end']),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string(),
    }),
  ),
});

const blockSchema = z.object({
  id: z.string().describe('区块唯一 id。'),
  type: z
    .enum([
      'headline',
      'status-strip',
      'paragraph',
      'bullet-list',
      'key-value-list',
      'metric',
      'flowchart',
      'callout',
      'thinking-steps',
    ])
    .describe('原子组件类型。'),
  title: z.string().optional().describe('区块标题。'),
  text: z.string().optional().describe('段落、说明或强调文案。'),
  tone: z
    .enum(['neutral', 'info', 'warning', 'danger', 'success'])
    .optional()
    .describe('区块语气或颜色倾向。'),
  items: z.array(z.string()).optional().describe('列表类区块的条目。'),
  pairs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional()
    .describe('键值对区块的数据。'),
  value: z.string().optional().describe('metric 区块的大号值。'),
  flowchart: flowchartSchema.optional().describe('仅 flowchart 区块使用。'),
});

export const alertCardSchema = z.object({
  title: z.string().describe('整张卡片的主标题。'),
  blocks: z
    .array(blockSchema)
    .describe('按展示顺序输出的原子组件列表，模型可以自行规划顺序和组合。'),
});

export type PartialAlertCard = DeepPartial<typeof alertCardSchema>;
