# Alarm Card Demo

基于 Vercel AI SDK 的 `streamText + Output.object` 结构化流式输出示例，使用固定告警工单与告警资料实时生成告警处置卡片。

## 运行方式

```bash
pnpm install
pnpm --filter @example/alarm-card-demo dev
```

启动后打开：<http://localhost:3000>

## Demo 特性

- 使用 `@ai-sdk/openai-compatible` 连接 `http://10.50.95.196:8000/v1`
- 使用模型 `qwen3.5`
- 使用 `experimental_useObject` 持续接收 partial object
- 使用原子化卡片组件渲染定位信息、业务影响、处置动作、升级建议
- 自定义流程图组件渲染处理步骤分支
