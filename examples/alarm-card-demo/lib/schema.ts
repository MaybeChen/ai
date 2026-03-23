import { DeepPartial } from 'ai';
import { z } from 'zod';

export const alertCardSchema = z.object({
  title: z.string().describe('卡片主标题，包含告警名称和处理结论。'),
  summary: z.string().describe('一句话总结当前告警状态和建议。'),
  severity: z.enum(['高', '中', '低']).describe('告警严重级别。'),
  status: z.string().describe('当前处置状态。'),
  alarmId: z.string(),
  location: z.array(z.string()).describe('从定位信息中提取出的关键字段。'),
  impact: z.array(z.string()).describe('业务影响，控制在2-3条。'),
  possibleCauses: z.array(z.string()).describe('可能原因列表。'),
  immediateActions: z.array(z.string()).describe('建议立刻执行的动作列表。'),
  escalation: z.object({
    owner: z.string().describe('建议联系的责任方。'),
    condition: z.string().describe('什么情况下需要升级处理。'),
  }),
  flowchart: z.object({
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
  }),
  nextObservation: z.object({
    waitSeconds: z.number(),
    checkpoint: z.string(),
  }),
});

export type PartialAlertCard = DeepPartial<typeof alertCardSchema>;
