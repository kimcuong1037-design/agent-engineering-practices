# Claude Agent SDK 关键 API 参考

> 基于 @anthropic-ai/claude-agent-sdk v0.2.63

---

## 核心 API

| API | 用途 |
|-----|------|
| `query()` | 核心入口，执行单次 Agent 任务 |
| `createSdkMcpServer()` | 创建自定义 MCP 工具服务 |
| `tool()` | 定义单个 MCP 工具（Zod schema） |
| `unstable_v2_createSession()` | 多轮会话（alpha，谨慎使用） |
| `unstable_v2_prompt()` | 单次提示（alpha） |

## Options 配置

### Agent 与 Skills

| 选项 | 用途 |
|------|------|
| `options.skills` | 预加载 Skills |
| `options.agents` | 定义子 Agent |
| `options.mcpServers` | 配置 MCP 服务器（type: 'sdk' 用于内嵌） |

### 权限与安全

| 选项 | 用途 |
|------|------|
| `options.permissionMode` | 权限控制：'default' / 'acceptEdits' / 'plan' / 'bypassPermissions' |
| `options.canUseTool` | 自定义工具权限回调（用于双重确认） |
| `options.maxBudgetUsd` | 成本限制 |
| `options.sandbox` | 沙箱配置（网络/文件系统限制） |

### 生命周期钩子

| 选项 | 用途 |
|------|------|
| `options.hooks` | 20 个生命周期事件钩子 |

**关键钩子**:
- `PreToolUse` — 工具执行前拦截（**用于阻断性门禁**）
- `PostToolUse` — 工具执行后回调
- `SessionStart` / `SessionEnd` — Session 生命周期
- `SubagentStart` / `SubagentStop` — 子 Agent 生命周期

### Thinking 配置

| 选项 | 用途 |
|------|------|
| `thinking: { type: 'adaptive' }` | Claude 自行决定（Opus 4.6+） |
| `thinking: { type: 'enabled', budgetTokens: N }` | 固定预算 |
| `thinking: { type: 'disabled' }` | 关闭 |

### 其他

| 选项 | 用途 |
|------|------|
| `options.model` | 模型选择（claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5） |
| `options.effort` | 努力等级：'low' / 'medium' / 'high' / 'max' |
| `options.cwd` | 工作目录 |
| `options.maxTurns` | 最大对话轮次 |
| `options.persistSession` | 是否持久化 Session |

## Query 对象方法

| 方法 | 用途 |
|------|------|
| `for await (const msg of query)` | 迭代消息流 |
| `query.interrupt()` | 中断执行 |
| `query.supportedCommands()` | 列出可用 Skills |
| `query.supportedModels()` | 列出可用模型 |
| `query.initializationResult()` | 获取初始化结果 |

## 消息类型

| 类型 | 说明 |
|------|------|
| `SDKAssistantMessage` | Claude 的响应 |
| `SDKResultMessage` | 成功/错误结果（含 usage 统计） |
| `SDKPartialAssistantMessage` | 流式消息事件 |
| `SDKTaskNotificationMessage` | 任务状态通知 |

## 参考链接

- 官方文档: https://platform.claude.com/docs/en/agent-sdk/overview
- GitHub: https://github.com/anthropics/claude-agent-sdk-typescript
- 本地 SDK 路径: `node_modules/@anthropic-ai/claude-agent-sdk/`
- 本地类型定义: `node_modules/@anthropic-ai/claude-agent-sdk/sdk.d.ts`（2436 行）
