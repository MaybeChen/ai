# Alarm Card Demo

基于 Vercel AI SDK 的 `streamText + Output.object` 结构化流式输出示例，用户只需要粘贴一段完整告警文本，页面就会以生成式 UI 的方式一点点长出告警卡片。

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

## 生成式 UI 约束

- 只自定义 **流程图** 组件。
- 其他区域全部由模型规划为原子 block（headline / status-strip / paragraph / bullet-list / key-value-list / metric / callout）。
- 页面不会预先展示完整大卡片骨架，而是随着 partial object 返回逐步长出一个个区块。
