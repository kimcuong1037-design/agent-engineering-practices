# Agent 工作流

> 定义模块从需求到交付的完整开发流程、阻断性门禁、以及 Agent 编排方式。

---

## 一、完整模块开发流程

### 阶段与步骤

```
Phase 1: 产品需求分析
  Step 1:  确定目标模块
  Step 2:  需求分析 Agent → requirements.md + user-stories.md
  Step 3:  [用户确认 User Stories] ⛔
  Step 3.5: 反向影响审查（检查上游模块 architecture.md）

Phase 2: UX/UI 设计
  Step 6:  UX 设计 Agent → ux-design.md
  Step 7:  [用户确认 UX] ⛔
  Step 8:  UI Schema Agent → ui-schema.md
  Step 9:  [用户确认 UI Schema] ⛔
  Step 9.5: 术语一致性扫描（glossary-management Skill）

Phase 3: 架构设计
  Step 4:  架构设计 Agent → architecture.md
  Step 5:  [用户确认架构] ⛔⛔ 阻断门禁

Phase 4: 工作流设计（视需要）
  识别状态机 → 流程建模 → Placeholder 决策

Phase 5: 前端实现 + 评估迭代
  Step 10: 前端工程 Agent（分批实现）
    Step 10a: types.ts + constants.ts + 目录结构
    Step 10b: Mock 数据创建
    Step 10c: 页面组件 + userStoryMapping + 路由注册
    Step 10d: i18n 集成
    Step 10e: 构建验证（每批 ≤5 文件后 npm run build）
  Step 11: UI 评估 Agent → 评估报告
  Step 12: P1/P2 修复迭代循环
  Step 12i: 模块交付检查清单（9 项）
  Step 13: 质量保障 Agent
  Step 14: 文档更新

Phase 6-8: 后端 → 质量 → 部署（见 ROADMAP.md）
```

### 关键流程规则

1. **禁止跳步**: architecture.md 是**阻断性门禁**——未经用户确认，绝不可进入实现阶段
2. **Step 3.5 反向影响审查**: 写完模块 requirements.md 后，回溯检查上游模块的 architecture.md 是否需要声明本模块为下游消费者
3. **Step 10 分批执行**: 修改 > 5 文件时须拆分多批，每批后 `npm run build`
4. **Step 12 评估退出条件**: 所有 P1 已解决 + P2 ≥ 80% 已解决 + 综合评分 ≥ 4.0

---

## 二、阻断性门禁（Blocking Gates）

```
需求确认 ⛔──→ UX 确认 ⛔──→ UI Schema 确认 ⛔──→ 架构确认 ⛔⛔──→ 前端实现
                                                        │
                                                        └── 最强阻断:
                                                            architecture.md 未经确认
                                                            绝不可进入实现阶段
```

### 门禁列表

| 门禁 | 前置条件 | 后续阶段 |
|------|----------|----------|
| 需求门禁 | requirements.md + user-stories.md 用户确认 | UX 设计 |
| UX 门禁 | ux-design.md 用户确认 | UI Schema 设计 |
| UI Schema 门禁 | ui-schema.md 用户确认 | 架构设计 |
| **架构门禁** | architecture.md 用户确认 | **前端实现** |
| 术语门禁 | 术语一致性扫描通过 | 前端实现 |

### SDK 实现方式

通过 `hooks.PreToolUse` 拦截：当检测到 Agent 尝试写入 `frontend/src/features/` 下的文件时，验证对应模块的 architecture.md 是否已标记为"用户已确认"。

---

## 三、Agent 编排流程图

```
Developer                  Agent (Claude)                 Skills/MCP
   │                            │                             │
   ├─ "开发站点管理模块" ────────→│                             │
   │                            ├─ session-management ────────→│ 加载上下文
   │                            ├─ correction-tracking ───────→│ 复读 P1-P10
   │                            │                             │
   │  ┌─── Phase 1: 需求分析 ────┤                             │
   │  │                         ├─ requirement-decomposition ─→│ L1-L4 分解
   │  │                         ├─ user-story-writing ────────→│ US + 验收标准
   │  │                         ├─ 反向影响审查 ───────────────→│ 上游检查
   │←─┤ "请确认 User Stories" ──│                             │
   ├──┤ "确认" ─────────────────→│                             │
   │  └─────────────────────────┤                             │
   │                            │                             │
   │  ┌─── Phase 2: UX/UI ──────┤                             │
   │  │                         ├─ ux-design ─────────────────→│ 交互设计
   │←─┤ "请确认 UX" ────────────│                             │
   ├──┤ "确认" ─────────────────→│                             │
   │  │                         ├─ ui-schema-design ──────────→│ 页面结构
   │←─┤ "请确认 UI Schema" ─────│                             │
   ├──┤ "确认" ─────────────────→│                             │
   │  └─────────────────────────┤                             │
   │                            │                             │
   │  ┌─── Phase 3: 架构 ⛔ ────┤                             │
   │  │                         ├─ data-model-design ─────────→│ 实体三问
   │  │                         ├─ glossary-management ───────→│ 术语扫描
   │  │                         ├─ blocking-gate ─────────────→│ 门禁检查
   │←─┤ "请确认架构 (⛔阻断)" ──│                             │
   ├──┤ "确认" ─────────────────→│                             │
   │  └─────────────────────────┤                             │
   │                            │                             │
   │  ┌─── Phase 5: 实现 ───────┤                             │
   │  │                         ├─ react-component-dev ───────→│ 分批生成
   │  │                         ├─ i18n-integration ──────────→│ i18n
   │  │                         ├─ delivery-checklist ────────→│ 9 项检查
   │  │                         ├─ ui-eval ───────────────────→│ 6 维评估
   │  │                         ├─ cross-domain-validator ────→│ 跨域校验
   │←─┤ "评估报告 + P1/P2" ─────│                             │
   │  │                         │                             │
   │  │  ┌── 修复迭代 ──────────┤                             │
   │  │  │  P1 修复 → 重评估     │                             │
   │  │  │  直到 P1=0, P2≥80%   │                             │
   │  │  └──────────────────────┤                             │
   │  └─────────────────────────┤                             │
   │                            │                             │
   │                            ├─ session-management ────────→│ 写明日锚点
   │←─ "模块完成" ──────────────│                             │
```

---

## 四、模块交付检查清单（9 项）

继承自 CORRECTIONS P2 模式（最后一公里检查）：

- [ ] **路由注册** — 所有页面在 router.tsx 中注册
- [ ] **导航菜单** — AppLayout 中三层侧边栏正确配置
- [ ] **面包屑** — 中间层使用子菜单名称
- [ ] **i18n** — zh-CN + en-US 完整覆盖
- [ ] **RequirementTag 三步集成** — userStoryMapping.ts → RequirementTag.tsx 注册 → 组件使用
- [ ] **Table scroll.x** — 显式列宽的 Table 必须设置 `scroll={{ x: sum }}`
- [ ] **architecture.md 存在** — 模块有对应的架构文档
- [ ] **跨模块视觉一致性** — 与已完成模块的视觉风格一致
- [ ] **构建通过** — `npm run build` 无错误
