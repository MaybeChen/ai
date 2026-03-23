# Alarm Card Demo

基于 Vercel AI SDK 的 `streamText + Output.object` 结构化流式输出示例，用户只需要粘贴一段完整告警文本，页面就会实时生成告警处置卡片。

## 运行方式

```bash
cd examples/alarm-card-demo
pnpm install --frozen-lockfile
pnpm dev
```

启动后打开：<http://localhost:3000>

## 输入方式

直接在页面输入框中粘贴原始告警内容，格式类似：

```text
【告警工单】
{...}

【告警资料】
# ...
```

不需要再额外输入“生成指令”。提交后卡片会先出现骨架，再随着 partial object 流式补全标题、总结、动作建议和流程图。
