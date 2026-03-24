# Alarm Card Demo

基于 Vercel AI SDK 的 `streamText + Output.object` 结构化流式输出示例，用户只需要粘贴一段完整告警文本，页面就会以生成式 UI 的方式一点点长出告警卡片。

## 运行方式

```bash
cd examples/alarm-card-demo
pnpm install --frozen-lockfile
pnpm dev
```

启动后打开：<http://localhost:3000>

## 界面行为

- 初始界面是类似 `json-render` chat example 的 landing 状态：中间是引导文案，底部是输入框。
- 当你输入并提交告警信息后，才会出现对话气泡。
- Assistant 区域不会先出现完整卡片框架，而是随着 partial object 逐步长出 block。
- 不展示思考过程，直接给出结果型 block，并继续长出标题、状态条、列表和流程图。
- 只有 **流程图** 使用自定义组件；其他区域都由模型规划为原子 block。

- 已在请求层显式关闭 thinking/reasoning，避免 reasoning-delta 流过长。
