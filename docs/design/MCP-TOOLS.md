# MCP 工具服务设计

> 使用 Claude Agent SDK 的 `createSdkMcpServer()` 创建领域特定工具，为 Agent 提供自动化校验和生成能力。

---

## 工具清单

| # | 工具名 | 用途 | 触发时机 |
|---|--------|------|----------|
| 1 | `terminology-scan` | 扫描术语一致性 | Step 9.5 + 代码生成后 |
| 2 | `er-consistency-check` | 检查跨模块 ER 关系 | 架构完成后 + 实现完成后 |
| 3 | `track-placeholders` | 扫描并汇总 Placeholder 标记 | 架构完成后 + 按需 |
| 4 | `delivery-checklist` | 执行模块交付 9 项检查 | Step 12i |
| 5 | `i18n-completeness` | 扫描 i18n 完整性 | Step 10d 后 |
| 6 | `trace-requirement` | 需求到代码的追溯 | 按需 |

---

## 详细设计

### 工具 1: `terminology-scan`

```typescript
tool('terminology-scan', '扫描文档/代码中的术语是否符合 STANDARDS.md',
  z.object({
    targetPath: z.string().describe('要扫描的文件或目录路径'),
    scope: z.enum(['docs', 'code', 'all']).describe('扫描范围')
  }),
  async (args) => {
    // 1. 读取 STANDARDS.md 中的术语表
    // 2. 扫描目标路径下的所有文件
    // 3. 检查是否使用了未注册的术语变体
    // 4. 报告不一致项 + 建议的标准术语
    return { type: 'text', text: '术语一致性报告...' }
  }
)
```

### 工具 2: `er-consistency-check`

```typescript
tool('er-consistency-check', '检查跨模块实体关系的一致性',
  z.object({
    modules: z.array(z.string()).describe('要检查的模块列表')
  }),
  async (args) => {
    // 1. 读取 cross-module-erd.md 中定义的关系
    // 2. 扫描各模块 types.ts 中的实体定义
    // 3. 验证外键引用、共享实体字段是否一致
    // 4. 检查 ID 类型匹配
    return { type: 'text', text: 'ER 一致性报告...' }
  }
)
```

### 工具 3: `track-placeholders`

```typescript
tool('track-placeholders', '扫描并汇总所有 Phase N Dependency 标记',
  z.object({}),
  async (args) => {
    // 1. 在所有 .md 和 .ts/.tsx 文件中搜索 ⚠️ Phase N Dependency
    // 2. 提取功能描述、涉及模块、当前状态
    // 3. 与 DEFERRED-FIXES.md 交叉比对
    // 4. 报告未登记的 Placeholder
    return { type: 'text', text: 'Placeholder 追踪报告...' }
  }
)
```

### 工具 4: `delivery-checklist`

```typescript
tool('delivery-checklist', '执行模块交付 9 项检查',
  z.object({
    modulePath: z.string().describe('模块路径，如 features/operations/station')
  }),
  async (args) => {
    // 1. 检查 router.tsx 中是否注册了该模块的所有页面路由
    // 2. 检查 AppLayout 中导航菜单配置
    // 3. 检查面包屑配置
    // 4. 扫描所有 .tsx 中的 t() 调用，验证 i18n key 存在
    // 5. 检查 RequirementTag 三步集成
    // 6. 检查 Table 组件的 scroll.x 设置
    // 7. 验证 architecture.md 存在
    // 8. 跨模块视觉一致性（需人工辅助）
    // 9. 运行 npm run build 验证
    return { type: 'text', text: '交付检查清单结果...' }
  }
)
```

### 工具 5: `i18n-completeness`

```typescript
tool('i18n-completeness', '扫描所有 t() 调用，验证 key 在中英文中都存在',
  z.object({
    modulePath: z.string().describe('模块路径')
  }),
  async (args) => {
    // 1. grep 所有 .tsx 文件中的 t('...') 和 t("...") 调用
    // 2. 提取所有 i18n key
    // 3. 读取 zh-CN 和 en-US locale 文件
    // 4. 交叉比对，报告缺失的 key
    // 5. 检查是否存在"嵌套对象键作叶子键"的问题（P9 模式）
    return { type: 'text', text: 'i18n 完整性报告...' }
  }
)
```

### 工具 6: `trace-requirement`

```typescript
tool('trace-requirement', '追溯需求 ID 到代码实现',
  z.object({
    requirementId: z.string().describe('需求 ID，如 US-001')
  }),
  async (args) => {
    // 1. 搜索所有 userStoryMapping.ts 文件
    // 2. 找到该需求 ID 对应的组件和页面
    // 3. 检查实现状态（implemented / partial / planned / not-planned）
    // 4. 返回文件路径、组件名、实现状态
    return { type: 'text', text: '需求追溯结果...' }
  }
)
```

---

## MCP 服务器注册

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk'
import { z } from 'zod'

export const gasStationMcpServer = createSdkMcpServer({
  name: 'gas-station-tools',
  version: '1.0.0',
  tools: [
    // 上述 6 个工具定义
  ]
})

// 在 Agent SDK options 中注册:
const options = {
  mcpServers: [
    { type: 'sdk', server: gasStationMcpServer }
  ]
}
```
