# 加气站项目 Agent-Driven 重构 — 文档索引

> **项目**: gas-station-software → Agent-Driven Architecture
> **目标**: 使用 Claude Agent SDK + Skills 体系重构加气站项目，覆盖从产品需求分析到部署运维的完整生命周期
> **团队**: 3-5 人 | **试点模块**: 站点管理 | **节奏**: 重要不紧急

---

## 文档导航

### 治理类 (`governance/`)
> Agent 启动每个 session 都应加载的上下文

| 文档 | 说明 | 类型 |
|------|------|------|
| [CONSTITUTION.md](governance/CONSTITUTION.md) | 8 条宪法原则 + 在新框架中的映射 | 稳定 |
| [AGENT-WORKFLOW.md](governance/AGENT-WORKFLOW.md) | 完整模块开发流程（14 步）+ 阻断门禁 + 流程图 | 稳定 |
| [CORRECTIONS.md](governance/CORRECTIONS.md) | 纠偏模式 P1-P10 + 记录规则 | 活文档 |
| [EVALUATION-FRAMEWORK.md](governance/EVALUATION-FRAMEWORK.md) | 6 维评估 + P0-P3 分级 + 迭代流程 | 稳定 |
| [TEAM-COLLABORATION.md](governance/TEAM-COLLABORATION.md) | Session 协议 + 交接清单 + 共享资源 + 跨域策略 | 稳定 |

### 设计类 (`design/`)
> 开发 Skills、MCP 工具时的设计参考

| 文档 | 说明 | 类型 |
|------|------|------|
| [SKILLS-ARCHITECTURE.md](design/SKILLS-ARCHITECTURE.md) | 四层 Skills 体系 + 20 个 Skill 详细设计 | 稳定 |
| [MCP-TOOLS.md](design/MCP-TOOLS.md) | MCP 工具服务设计（6 个工具 + 代码示例） | 稳定 |
| [TECH-STACK.md](design/TECH-STACK.md) | 技术选型决策 + 理由 | 已确认 |

### 项目推进类 (`planning/`)
> 跟踪进度、规划工作、记录决策

| 文档 | 说明 | 类型 |
|------|------|------|
| [ROADMAP.md](planning/ROADMAP.md) | Phase 0-8 路线图 + 详细步骤 + 工作量预估 | 稳定 |
| [PROGRESS.md](planning/PROGRESS.md) | 当前进度跟踪 | 活文档 |
| [DECISIONS-LOG.md](planning/DECISIONS-LOG.md) | 所有决策记录（已确认 + 待确认） | 活文档 |
| [DEFERRED-FIXES.md](planning/DEFERRED-FIXES.md) | Placeholder / 延迟功能追踪表 | 活文档 |

### 参考类 (`reference/`)
> 背景信息、一次性分析、API 参考

| 文档 | 说明 | 类型 |
|------|------|------|
| [GAS-STATION-ASSESSMENT.md](reference/GAS-STATION-ASSESSMENT.md) | 加气站项目现状评估 + 好处风险 + 数据结构 concern | 静态 |
| [INHERITED-ASSETS.md](reference/INHERITED-ASSETS.md) | 从原项目继承的资产清单 | 静态 |
| [SDK-API-REFERENCE.md](reference/SDK-API-REFERENCE.md) | Claude Agent SDK 关键 API | 静态 |

### 归档 (`archive/`)

| 文档 | 说明 |
|------|------|
| [PROPOSAL-v2.md](archive/PROPOSAL-v2.md) | 原始 Proposal 完整归档 |
