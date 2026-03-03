# 加气站项目基于 Claude Agent SDK 重构 Proposal (v2)

> **日期**: 2026-03-03 | **修订**: v2（基于第一轮反馈优化）
> **项目**: gas-station-software → Agent-Driven Architecture
> **当前状态**: 加气站项目为**未完成开发的前端原型**（React + TypeScript + Ant Design），需求仍处于与真实用户沟通的早期阶段
> **目标**: 评估并规划使用 Claude Agent SDK + Skills 体系来重构加气站项目，覆盖从产品需求分析到部署运维的完整生命周期

---

## 一、加气站项目现状评估

### 1.1 项目概况

| 指标 | 数值 |
|------|------|
| TypeScript 文件数 | 142 |
| 代码行数 | ~37,000 |
| 功能模块 | 6 个（运营 4 + 能源贸易 3） |
| 页面数量 | 50+ |
| 文档文件 | 50+ |
| Mock 数据集 | 15+ |
| i18n 语言 | 2（中文 / 英文） |
| TypeScript 接口 | 200+ |

### 1.2 技术栈

- **前端**: React 19 + TypeScript 5.9 + Vite 7.3 + Ant Design 6
- **图表**: ECharts 6
- **国际化**: i18next
- **后端**: 无（纯 Mock 数据）
- **测试**: 无
- **状态管理**: 无（仅 useState + Outlet Context）
- **CI/CD**: 无

### 1.3 6 个功能模块

**运营域（Operations）**:
1. **站点管理** — CRUD、区域分组、员工、班次、加油枪
2. **交接班** — 实时看板、结算、交接历史、向导式流程
3. **设备台账** — 7 类设备监控、油罐液位、维修工单
4. **巡检管理** — 巡检计划/执行/问题跟踪/分析

**能源贸易域（Energy Trade）**:
5. **价格管理** — 基础定价、调价审批、会员价、协议价
6. **订单交易** — 加油订单、异常处理、退款、多支付方式
7. **库存管理** — 进销存台账、油罐比对、库存预警

### 1.4 项目优势——值得继承的资产

- **文档驱动体系**: CONSTITUTION.md（8 原则）、AGENT-PLAN.md（14 步工作流）、CORRECTIONS.md（10 大纠偏模式）、STANDARDS.md（术语表）
- **模块化结构**: 每模块有 types.ts / constants.ts / userStoryMapping.ts
- **i18n 从第一天就做了**: 中英双语完整覆盖
- **需求可追溯**: RequirementTag 组件 + userStoryMapping 三步集成
- **Agent 技能体系**: docs/skills/ 下 11 个 Skill 定义（需求分析、架构设计、UI 评估等）
- **质量评估框架**: 6 维评估体系 + P1/P2 分级分类 + 迭代修复闭环
- **团队协同协议**: SESSION-PROTOCOL.md（启动/关闭/交接）

### 1.5 项目短板

- **未完成开发** — 需求仍在与用户早期沟通中，会持续变化
- **无后端** — 所有数据为客户端 Mock，无持久化
- **无状态管理** — 复杂交互场景下 props drilling 严重
- **无测试** — 0 单元测试 / 集成测试 / E2E 测试
- **无表单校验框架** — Ant Form 的 rules 使用不充分
- **无错误处理策略** — 缺乏全局 Error Boundary 和重试逻辑

---

## 二、从原框架继承的核心机制

> 这是本次重构方案相比 v1 的重要补充。原加气站项目积累了一套成熟的治理机制，我们必须继承并增强。

### 2.1 CORRECTIONS.md — 持续迭代纠偏机制

**机制**: 每次用户纠正都记录为一个模式（Pattern），形成可查询的反模式库。

| 模式编码 | 主题 | 核心要点 |
|----------|------|----------|
| P1 | 路由/导航/命名一致性 | 路由定义为常量、所有入口同步、静态路由先于动态 |
| P2 | 模块交付检查清单（最后一公里） | 9 项检查：路由注册、导航菜单、面包屑、i18n、RequirementTag、Table scroll.x、architecture.md、跨模块视觉一致性、构建通过 |
| P3 | 流程遵守与步骤 | 严格顺序、架构阶段完成实体定义、设计阶段端到端走查 |
| P4 | 交互完整性 | 可点击元素必须有 onClick、面包屑可点、统计卡片与列表双向联动 |
| P5 | 数据模型与 Mock 完整性 | 核心实体架构阶段完整定义、Mock 覆盖全生命周期 |
| P6 | Skill 定义质量 | 分解 Skill 须定义粒度标准、明确 Agent 行为边界、评估 Skill 须提供可执行验证步骤 |
| P7 | 跨阶段/跨模块依赖管理 | 依赖标记 `⚠️ Phase N Dependency`、上游 architecture.md 须列出所有下游消费者 |
| P8 | 修复优先级与决策框架 | P1 分类（业务影响 vs 体验影响）、评估修改成本、执行前须用户确认 |
| P9 | i18n 翻译键命名规范 | 禁止嵌套对象键作叶子键、使用 common.* 通用词、全局完整性校验 |
| P10 | API 文档——写操作需 JSON 示例 | 所有写端点须有完整请求/响应示例 |

**继承方式**: 在新框架中设立 `CORRECTIONS.md`，初始化时导入上述 10 个模式作为起始知识；后续每个模块开发前须复读模式表作为前置检查。

### 2.2 宪法原则（CONSTITUTION.md）

8 条原则中，以下需要直接继承到新框架：

| 原则 | 在新框架中的体现 |
|------|-----------------|
| **先分解再动手** | Skills 设计：requirement-decomposition Skill 强制 L1-L4 分解 |
| **先标准后编码** | 工作流中 architecture.md 为**阻断性门禁**，未通过不可进入实现 |
| **忠实准确** | Agent 生成的代码必须可追溯到已确认的需求和设计 |
| **框架优先 MVP 优先** | 重构采用渐进策略：先试点站点管理 → 验证 → 推广 |
| **不确定须确认** | Agent 遇到未定义概念时，必须暂停向用户确认 |
| **纠偏经验持续积累** | 继承 CORRECTIONS.md 机制 |
| **删除需双重确认** | Agent 的 `canUseTool` 回调中对文件删除做双重确认 |
| **关键文档变更需审批** | 架构、需求、计划文档变更通过 hooks 拦截，要求用户审批后提交 |

### 2.3 阻断性验证（Blocking Gates）

原框架在关键环节设置了**阻断性门禁**，确保质量不被绕过：

```
需求确认 ──→ 架构设计 ⛔ ──→ UX 设计 ──→ UI Schema ──→ 前端实现
                │
                └── 阻断: architecture.md 未经用户确认，不可进入实现阶段
```

**继承方式**: 在 Agent 工作流中通过 SDK 的 `hooks.PreToolUse` 实现门禁检查——检测到开发类工具调用时，验证前置文档是否已确认。

### 2.4 术语一致性扫描

原框架有 `glossary-management` Skill，维护三层术语体系：
- **Layer 1**: 业务术语（加注机、加油枪、油罐、工单...）
- **Layer 2**: 角色术语（站长、安全主管、操作员...）
- **Layer 3**: 模块/菜单术语 + 状态枚举

**继承方式**:
- STANDARDS.md 作为术语的**单一事实源**
- 新增术语前必须先注册
- MCP 工具 `terminology-scan` 在代码生成后自动扫描术语一致性
- Step 9.5 术语一致性扫描作为必经步骤

### 2.5 Session 协同协议

原框架定义了完整的会话协议：
- **Session 启动 5 步**: 读 PROGRESS.md → 读 ROADMAP → 加载 CORRECTIONS 意识 → 加载模块上下文 → 与用户对齐
- **Session 关闭 4 步**: 更新 PROGRESS → 更新 ROADMAP → 记录纠偏 → 写"明日锚点"
- **模块交接清单**: 当前步骤、文档完成度、未解决问题、关键文件、特殊注意事项

**继承方式**: 编码为 `session-management` Skill，Agent 启动和关闭时自动执行。对于 3-5 人团队尤为重要——确保任何人接手都能快速进入状态。

---

## 三、重构带来的好处及潜在问题

### 3.1 好处

#### A. 团队协同层面（3-5 人团队）
| 好处 | 说明 |
|------|------|
| **标准化开发流程** | 通过 Skills 定义模块级开发规范，3-5 人使用相同的 Agent 工作流，消除个人风格差异 |
| **知识沉淀与复用** | 领域知识编码为 Skills + knowledge-base，新成员即可快速上手 |
| **Session 交接无缝化** | Session 协议确保任何人接手任意模块都能 5 分钟内进入状态 |
| **纠偏经验共享** | CORRECTIONS.md 让一个人踩过的坑，所有人都不再踩 |
| **Review 效率提升** | Agent 自动执行规范检查 + 术语扫描 + 模块交付清单验证 |

#### B. 产品设计层面（新增）
| 好处 | 说明 |
|------|------|
| **需求变更可控** | 渐进式需求确认流程，每个模块独立经过"分析→设计→实现→评估"闭环 |
| **设计与实现对齐** | UX/UI 设计文档作为 Agent 生成代码的输入，避免实现偏离设计 |
| **需求可追溯** | RequirementTag 机制从代码反向追溯到需求 ID |

#### C. 技术层面
| 好处 | 说明 |
|------|------|
| **补齐后端短板** | Agent 辅助生成后端 API、数据库 Schema、ORM 模型 |
| **自动化测试生成** | Agent 基于 types.ts 和 Mock 数据自动生成测试 |
| **架构升级** | 引入状态管理、API 客户端层、错误边界等生产级基础设施 |

### 3.2 潜在问题与风险

| 风险 | 严重程度 | 缓解策略 |
|------|----------|----------|
| **Agent 生成代码质量不可控** | 高 | 6 维评估框架 + P1/P2 分级修复 + 阻断性门禁 |
| **SDK 版本不稳定** | 中 | V2 API 标记为 unstable；锁定版本 + 封装抽象层 |
| **需求持续变化导致返工** | 中 | 模块独立闭环 + MVP 优先 + 架构预留扩展点 |
| **领域知识表达局限** | 中 | knowledge-base 结构化存储 + Skill 引用而非内嵌 |
| **团队 Agent SDK 学习曲线** | 中 | 有 Claude Code 基础；渐进式引入，Phase 0 充分培训 |
| **多 Agent 并行时跨域冲突** | 中 | 共享术语表 + ER 图约束 + MCP 一致性校验工具 |
| **Placeholder 功能被遗忘** | 低 | DEFERRED-FIXES.md 集中跟踪 + 依赖标记 `⚠️ Phase N Dependency` |
| **成本控制** | 低 | `maxBudgetUsd` 限制 + Haiku 处理简单任务 |

### 3.3 关于数据结构的 Concern

> 您确认现有 Mock 数据"绝大多数"是最终结构。我的 concern 如下：

| 风险点 | 说明 | 应对 |
|--------|------|------|
| **跨模块外键关系** | 15+ Mock 数据集之间的 ID 引用关系是手动维护的，后端化时需要重新建立 FK 约束 | 在 architecture.md 中用 cross-module-erd.md 明确定义所有跨模块关系 |
| **状态机不完整** | 部分实体的状态流转（如工单生命周期）在 Mock 中用枚举表示，但缺少状态转换规则 | 架构阶段用"实体三问分析"补全状态机 |
| **聚合查询未定义** | 看板/仪表盘页面需要跨实体聚合数据，Mock 中是静态组装的，后端需定义聚合 API | 架构阶段做"聚合接口预分析" |
| **数据结构局部调整** | 您提到需要支持未来调整。建议后端采用 Prisma，其 Schema 迁移机制可以平滑处理字段增减 | 选择 Prisma 作为 ORM + 版本化迁移 |

---

## 四、重构阶段与步骤规划（修订版）

> **核心变化**: 在 Development 之前增加了完整的产品设计生命周期，并将评估机制贯穿全流程。

### 阶段总览

```
Phase 0: 基础设施 & PoC        ← 在 agent-engineering-practices 中
Phase 1: 产品需求分析           ← 试点: 站点管理模块
Phase 2: UX/UI 设计
Phase 3: 架构设计（⛔ 阻断门禁）
Phase 4: 工作流设计（可选）
Phase 5: 前端实现 + 评估迭代
Phase 6: 后端开发
Phase 7: 质量保障
Phase 8: 部署 & 运维
```

### Phase 0: 基础设施准备 & PoC（在 agent-engineering-practices 中）

**目标**: 搭建 Agent + Skills 工具链，用站点管理模块做端到端验证

**步骤**:
1. **继承治理机制** — 从原项目导入 CORRECTIONS.md（10 模式）、STANDARDS.md（术语表）、宪法原则
2. **搭建 Skills 开发框架** — Skill 模板（SKILL.md + 流程 + Prompt 模板 + 检查清单）
3. **开发核心 Skills**（见第五节详细设计）
4. **构建 MCP 工具服务** — terminology-scan、module-completeness-check 等
5. **PoC 端到端验证** — 用站点管理模块验证"需求分析 → 架构设计 → 前端生成 → 评估"完整流程
6. **编写团队使用手册** — Skills 使用指南、Agent 工作流文档、培训材料

### Phase 1: 产品需求分析（新增）

**目标**: 对试点模块（站点管理）进行完整的需求分析

**步骤**:
1. **需求拆解** — 使用 `requirement-decomposition` Skill，将站点管理拆解为 L1-L4 层级
   - L1: 子系统 → L2: 模块 → L3: 功能组 → L4: 原子功能点
   - 每个 L4 标注优先级：[MVP] / [MVP+] / [PROD] / [FUTURE]
2. **User Story 编写** — 使用 `user-story-writing` Skill，为每个 L4 生成 User Story + 验收标准
3. **用户确认** — ⛔ 阻断点：User Story 须与真实用户确认后方可继续
4. **反向影响审查（Step 3.5）** — 检查上游模块的 architecture.md 是否需要声明本模块为下游消费者

**关键输出**: requirements.md + user-stories.md

### Phase 2: UX/UI 设计（新增）

**目标**: 完成交互设计和页面结构定义

**步骤**:
1. **UX 设计** — 使用 `ux-design` Skill，定义用户旅程、交互流程、页面间导航关系
2. **用户确认** — ⛔ 阻断点：UX 设计须用户确认
3. **UI Schema 设计** — 使用 `ui-schema-design` Skill，定义每个页面的组件结构、数据绑定、状态管理
4. **用户确认** — ⛔ 阻断点：UI Schema 须用户确认
5. **术语一致性扫描** — 使用 `glossary-management` Skill，确保设计文档中的术语与 STANDARDS.md 一致

**关键输出**: ux-design.md + ui-schema.md

### Phase 3: 架构设计（⛔ 阻断门禁）

**目标**: 完成数据模型、API 设计、跨模块关系定义

**步骤**:
1. **实体三问分析** — 对每个核心实体执行：
   - Q1: 本实体自身承载哪些字段（非继承）？
   - Q2: 如何创建（手动 vs 自动）？
   - Q3: 有哪些副作用和生命周期约束？
2. **数据库 Schema 草案** — PostgreSQL ENUM + CREATE TABLE + 索引 + 约束
3. **跨模块 ER 图更新** — 更新 cross-module-erd.md
4. **跨模块数据流定义** — 列出下游消费者 + 触发机制 + 数据契约
5. **聚合接口预分析** — 识别看板/仪表盘需要的聚合查询
6. **Placeholder 标记** — 标记跨模块共享功能（如统一审批流）为 `⚠️ Phase N Dependency`
7. **API 设计** — RESTful 端点 + 请求/响应示例（含写操作 JSON 示例，遵循 P10 模式）
8. **用户确认** — ⛔ **阻断门禁**：architecture.md 未经确认，绝不可进入实现阶段

**关键输出**: architecture.md + cross-module-erd.md 更新

### Phase 4: 工作流设计（视需要）

**目标**: 对涉及多步骤/多角色的业务流程进行工作流建模

**适用场景**:
- 交接班向导流程
- 价格调整审批流
- 巡检计划→执行→问题跟踪
- 维修工单生命周期

**步骤**:
1. **识别工作流** — 列出模块中涉及状态机的业务流程
2. **流程建模** — 状态图 + 角色矩阵 + 触发条件 + 数据流
3. **Placeholder 决策** — 统一审批流等跨模块共享功能，标记为 Placeholder，记入 DEFERRED-FIXES.md

**关键输出**: workflow-design 补充到 architecture.md

### Phase 5: 前端实现 + 评估迭代

**目标**: Agent 驱动的前端代码生成 + 6 维质量评估

**步骤**:
1. **分批实现**（遵循 P2 模式——最后一公里检查清单）:
   - Step 10a: types.ts + constants.ts + 目录结构
   - Step 10b: Mock 数据创建
   - Step 10c: 页面组件 + userStoryMapping + 路由注册
   - Step 10d: i18n 集成
   - Step 10e: 构建验证（每批 ≤5 文件后 `npm run build`）
2. **模块交付检查清单**（9 项，继承 P2 模式）
3. **6 维 UI 评估**（见第六节评估框架）
4. **P1/P2 分级修复迭代**
5. **退出条件**: 所有 P1 已解决 + P2 ≥ 80% 已解决 + 综合评分 ≥ 4.0

### Phase 6: 后端开发（Agent 驱动）

**步骤**:
1. **数据库实现** — 基于 Phase 3 的 Schema 草案，用 Prisma 生成
2. **API 开发** — Node.js + Fastify，基于 architecture.md 中的端点设计
3. **认证授权** — JWT + RBAC（8 个角色的权限矩阵）
4. **前后端对接** — MSW → 真实 API 渐进式替换
5. **数据种子** — Mock 数据作为种子导入

### Phase 7: 质量保障

**步骤**:
1. **单元测试** — Vitest + React Testing Library（目标 80% 覆盖率）
2. **集成测试** — API 端到端测试
3. **E2E 测试** — Playwright 覆盖核心 User Journey
4. **安全审查** — 使用内置 /security-review

### Phase 8: 部署 & 运维

**步骤**:
1. **CI/CD 管道** — GitHub Actions（lint → test → build → deploy）
2. **容器化** — Dockerfile + docker-compose（云服务优先，预留私有化接口）
3. **监控** — 日志 + 错误追踪

---

## 五、Agent 与 Skills 的规划设计（修订版）

> **核心变化**: 增加了产品/设计阶段的 Skills，以及治理和评估类 Skills。

### 5.1 Skills 体系设计（四层）

```
Skills 分层结构:

├── 治理层 Skills (框架治理, 团队协同)
│   ├── session-management     — Session 启动/关闭/交接协议
│   ├── correction-tracking    — CORRECTIONS.md 纠偏记录与模式积累
│   ├── glossary-management    — 术语一致性管理与扫描
│   └── blocking-gate          — 阻断性门禁检查（架构确认、需求确认）
│
├── 产品/设计层 Skills (开发前阶段) ← 新增
│   ├── requirement-decomposition  — 需求 L1-L4 分解
│   ├── user-story-writing         — User Story + 验收标准生成
│   ├── ux-design                  — 交互设计与用户旅程
│   ├── ui-schema-design           — 页面组件结构与数据绑定
│   ├── data-model-design          — 实体三问分析 + 数据库 Schema
│   └── workflow-design            — 工作流/状态机建模
│
├── 工程层 Skills (实现阶段)
│   ├── react-component-dev        — React 组件开发（12 层 import 规范）
│   ├── mock-data-creation         — Mock 数据生成
│   ├── i18n-integration           — i18n 集成与完整性校验
│   ├── api-implementation         — 后端 API 开发
│   ├── test-generator             — 自动测试生成
│   └── module-bootstrap           — 新模块脚手架（全栈）
│
└── 质量/评估层 Skills (贯穿全程)
    ├── ui-eval                    — 6 维 UI 评估框架（含 P1/P2 分级）
    ├── code-review                — 代码审查
    ├── delivery-checklist         — 模块交付 9 项检查清单
    └── cross-domain-validator     — 跨域一致性校验 ← 新增
```

### 5.2 新增 Skills 详细设计

#### Skill: `session-management`（治理层）
```
目的: 确保 3-5 人团队的会话连续性和交接无缝化
触发: 每次 Agent Session 启动和关闭时

启动流程 (5 步):
  1. 读取 PROGRESS.md 获取当前模块状态
  2. 读取 ROADMAP.md 进度
  3. 加载 CORRECTIONS.md §1 模式表（建立纠偏意识）
  4. 加载当前模块上下文
  5. 与用户对齐: "当前在模块 X 的第 Y 步，上次完成了 Z，接下来..."

关闭流程 (4 步):
  1. 更新 PROGRESS.md（当前步骤、已完成工作、影响文件）
  2. 更新 ROADMAP.md
  3. 记录新发现的纠偏模式
  4. 写"明日锚点"（当前模块、继续步骤、待确认事项、建议优先读取的文件）

交接清单:
  - 当前 AGENT-PLAN Step
  - 文档完成度
  - 未解决问题（含上下文）
  - 关键文件位置
  - 特殊注意事项（跨模块依赖、技术债、用户偏好）
```

#### Skill: `correction-tracking`（治理层）
```
目的: 持续积累纠偏经验，防止同类错误反复出现
触发: 用户指出问题或修正 Agent 输出时

流程:
  1. 识别纠偏模式: 匹配现有 P1-P10 模式，或创建新模式 P11+
  2. 记录到 CORRECTIONS.md:
     - §1 模式查询表: 一行摘要
     - §2 时间线: 日期 | 标题 | 根因 | 关联模式
  3. 完整记录到 CORRECTIONS-ARCHIVE.md（含上下文和根因分析）
  4. 检查是否需要更新相关 Skill 定义（模式 P6 要求）

规则: 每个新模块开发前，必须复读 §1 模式表
```

#### Skill: `cross-domain-validator`（质量层，新增）
```
目的: 确保多 Agent 并行工作时的跨域一致性
触发: 架构设计完成后、前端实现完成后

检查维度:
  1. 术语一致性: 扫描所有文档和代码，检查是否使用 STANDARDS.md 中注册的术语
  2. ER 关系完整性: 验证 cross-module-erd.md 中所有外键关系在代码中正确实现
  3. Placeholder 追踪: 扫描所有 `⚠️ Phase N Dependency` 标记，确认记入 DEFERRED-FIXES.md
  4. 共享实体一致性: 检查跨模块共享的实体（Station、Employee 等）在各模块 types.ts 中定义一致
  5. API 契约: 验证前端 API 调用与后端端点定义的参数/响应一致

输出: 跨域一致性报告（问题清单 + 修复建议）
```

#### Skill: `blocking-gate`（治理层）
```
目的: 实现阻断性门禁，确保关键文档在进入下一阶段前已确认
触发: Agent 尝试进入实现阶段时

门禁列表:
  1. requirements.md + user-stories.md → 须用户确认 → 方可进入 UX 设计
  2. ux-design.md → 须用户确认 → 方可进入 UI Schema
  3. ui-schema.md → 须用户确认 → 方可进入架构设计
  4. architecture.md → ⛔ 须用户确认 → 方可进入前端实现
  5. 术语一致性扫描 → 须通过 → 方可进入前端实现

实现: 通过 SDK hooks.PreToolUse 拦截文件写入操作，检查前置文档状态
```

### 5.3 MCP 工具服务设计

```typescript
// gas-station-mcp-server.ts
const server = createSdkMcpServer({
  name: 'gas-station-tools',
  version: '1.0.0',
  tools: [
    // 工具 1: 术语一致性扫描
    tool('terminology-scan', '扫描文档/代码中的术语是否符合 STANDARDS.md',
      z.object({ targetPath: z.string(), scope: z.enum(['docs', 'code', 'all']) }),
      async (args) => { /* 扫描并报告不一致的术语 */ }
    ),

    // 工具 2: 跨模块 ER 一致性检查
    tool('er-consistency-check', '检查跨模块实体关系的一致性',
      z.object({ modules: z.array(z.string()) }),
      async (args) => { /* 验证外键、共享实体定义一致 */ }
    ),

    // 工具 3: Placeholder 追踪
    tool('track-placeholders', '扫描并汇总所有 Phase N Dependency 标记',
      z.object({}),
      async (args) => { /* 扫描 ⚠️ 标记，更新 DEFERRED-FIXES.md */ }
    ),

    // 工具 4: 模块交付检查清单验证
    tool('delivery-checklist', '执行模块交付 9 项检查',
      z.object({ modulePath: z.string() }),
      async (args) => { /* 路由、菜单、面包屑、i18n、RequirementTag... */ }
    ),

    // 工具 5: i18n 完整性校验
    tool('i18n-completeness', '扫描所有 t() 调用，验证 key 在中英文中都存在',
      z.object({ modulePath: z.string() }),
      async (args) => { /* grep t(...) 并交叉验证 locale 文件 */ }
    ),

    // 工具 6: 需求追溯
    tool('trace-requirement', '追溯需求 ID 到代码实现',
      z.object({ requirementId: z.string() }),
      async (args) => { /* 查找 userStoryMapping.ts 中的映射 */ }
    )
  ]
})
```

### 5.4 Agent 工作流编排（修订版）

```
完整模块开发流程 (Agent-Driven, 含产品设计):

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

### 5.5 多 Agent 并行协同——跨域处理策略

> 这是 3-5 人团队并行开发时的核心挑战。

#### 共享资源锁定机制

```
共享资源 (所有 Agent 只读引用, 修改须走审批):
├── STANDARDS.md          — 术语表 (Single Source of Truth)
├── cross-module-erd.md   — 跨模块 ER 图
├── DEFERRED-FIXES.md     — Placeholder 追踪表
├── CORRECTIONS.md        — 纠偏模式表
└── router.tsx            — 路由注册表 (避免冲突)
```

#### Placeholder 管理策略

跨模块共享功能（如统一审批流）的处理方式：

```
1. 识别: 在架构阶段识别"这个功能跨越多个模块"
2. 标记: 在 architecture.md 中标记为 ⚠️ Phase N Dependency
3. 登记: 记入 DEFERRED-FIXES.md，包含:
   - 功能描述
   - 涉及模块列表
   - 临时替代方案（如简单的 status 字段切换）
   - 预计统一开发时间
4. 实现临时版: 在各模块中实现最简 Placeholder（如硬编码审批通过）
5. 统一开发: 所有依赖模块完成后，统一开发共享功能并替换 Placeholder
```

**典型 Placeholder 示例**:
| 共享功能 | 临时方案 | 统一开发时机 |
|----------|----------|-------------|
| 全站统一审批流 | 硬编码 "已审批" / "待审批" 状态切换 | 所有涉及审批的模块完成后 |
| 权限中间件 | Mock 角色检查函数，始终返回 true | 后端 Phase 6 |
| 消息通知系统 | console.log + Toast | 全模块完成后 |

---

## 六、评估框架（继承 + 增强）

> 对于 Agent 驱动的开发，评估是质量兜底的关键环节。

### 6.1 优先级排序（明确）

```
评估优先级 (从高到低):

P0 — 阻断性问题 (必须立即修复)
  │  路由是否可达（能否进入页面）
  │  User Journey 能否顺利走完（端到端流程）
  │  业务逻辑是否正确（状态流转、数据计算）
  │
P1 — 功能性问题 (发布前必须修复)
  │  ├── P1-Business: 功能缺失、数据绑定错误
  │  └── P1-Experience: i18n 缺失、交互不完整
  │
P2 — 体验性问题 (80% 修复后可发布)
  │  覆盖完整度（是否所有 User Story 都有对应页面）
  │  UI 还原程度（与设计稿的一致性）
  │
P3 — 打磨类问题 (后续迭代)
     视觉和用户体验设计的细节评估
     动画、微交互、无障碍
```

### 6.2 六维评估框架（继承自原框架）

| 维度 | 权重 | 评估要点 |
|------|------|----------|
| **D1: 视觉保真度与设计一致性** | 20% | 配色、字体、间距、组件样式、跨模块视觉一致性 |
| **D2: 功能正确性** | 25% | 正常流程、错误状态、空状态、加载状态、路由一致性、**User Journey 完整性** |
| **D3: 无障碍** | 20% | 语义 HTML、ARIA、键盘导航、颜色对比度 |
| **D4: 代码质量与可维护性** | 15% | 组件拆分、命名、TypeScript 类型、无死代码 |
| **D5: 性能** | 10% | 无不必要的 re-render、高效数据获取 |
| **D6: 用户体验与交互设计** | 10% | 交互反馈、一致性、信息层级 |

### 6.3 评估迭代流程

```
Step 1: 运行 6 维评估 → 生成评估报告
Step 2: P1 二次分类 (CRITICAL):
        ├── 影响: Business Impact vs Experience Impact
        ├── 成本: Low (1-3行) / Medium (30-50行) / High (架构变更)
        └── 输出: 分类结果 → 用户确认修复优先级
Step 3: 执行修复 (用户确认的项目)
Step 4: 重新评估 (回到 Step 1)
Step 5: 退出条件:
        ├── 所有 P1 已解决
        ├── P2 已解决 ≥ 80%
        └── 综合评分 ≥ 4.0
```

### 6.4 专项检查（D2 子项，高优先级）

#### User Journey 完整性检查
- 从模块入口到核心任务完成，无断点？
- 每个页面的前置条件在前序页面中可建立？
- 跨模块数据入口有便捷访问点？
- 默认视图展示"当前状态概览"而非操作流程？

#### 路由一致性检查
- router.tsx 定义与 UI Schema 页面列表匹配？
- 所有 `navigate()` / `<Link>` 路径指向已定义路由？
- 静态路由先于动态路由？
- 未定义路由有合理的错误处理？

---

## 七、已确认的决策

### 7.1 流程决策（已回答）

| # | 决策点 | 答案 | 影响 |
|---|--------|------|------|
| 6 | **重构范围** | 先试点"站点管理"模块 | Phase 0-5 围绕站点管理验证，成功后推广 |
| 7 | **团队规模** | 3-5 人 | Skills 粒度适中、Session 协议重要、需要关注并行冲突 |
| 8 | **Agent SDK 经验** | Claude Code 有经验，Agent SDK 几乎零基础 | Phase 0 需充分培训；渐进引入，先 Skills 后 SDK |
| 9 | **时间预期** | 重要不紧急，无明确时间 | 可以充分验证 PoC，不急于全面推广 |
| 10 | **部署环境** | 云服务为主，预留私有化 | Docker + docker-compose，不做 K8s；预留环境变量配置 |

### 7.2 业务决策（已回答）

| # | 决策点 | 答案 | 影响 |
|---|--------|------|------|
| 11 | **需求变更** | 会持续变化，与用户沟通处于早期 | 必须支持模块独立闭环、渐进式确认、架构预留扩展 |
| 12 | **数据迁移** | 绝大多数是最终结构，需支持局部调整 | 用 Prisma 迁移机制；关注跨模块 FK、状态机、聚合查询 |
| 13 | **性能要求** | 暂不考虑 | Phase 7 中性能优化优先级降低 |
| 14 | **合规要求** | 暂不考虑 | 不纳入 Phase 7 |

### 7.3 待确认的技术选型（下一轮讨论）

| # | 决策点 | 选项 | 我的建议 |
|---|--------|------|----------|
| 1 | **后端技术栈** | A. Node.js + Fastify<br>B. Python + FastAPI<br>C. 暂不做后端 | **A** — TypeScript 全栈，类型共享 |
| 2 | **数据库** | A. PostgreSQL<br>B. MySQL | **A** — 关系模型 + 原框架架构文档已按 PG 设计 |
| 3 | **ORM** | A. Prisma<br>B. Drizzle | **A** — Schema 迁移 + 类型安全 + 支持局部调整 |
| 4 | **状态管理** | A. Zustand<br>B. Jotai | **A** — 轻量、学习曲线低 |
| 5 | **测试框架** | A. Vitest<br>B. Jest | **A** — Vite 生态一致 |

---

## 八、核心重点与难点（修订版）

### 8.1 重点

| # | 重点 | 原因 |
|---|------|------|
| 1 | **产品设计阶段的 Agent 有效性** | 需求分析和 UX 设计需要领域知识 + 用户反馈，Agent 的输出质量高度依赖 Skill 中的领域知识准确性 |
| 2 | **阻断性门禁的严格执行** | 团队中可能有人想"跳过设计直接写代码"，门禁机制必须在 SDK 层面强制执行 |
| 3 | **跨域一致性（多 Agent 并行）** | 3-5 人并行时，术语、ER 关系、Placeholder 管理是最容易出问题的地方 |
| 4 | **评估驱动的质量保障** | Agent 生成代码的质量波动大，6 维评估 + P1/P2 迭代是兜底的关键 |
| 5 | **Session 交接（团队协同）** | 需求持续变化 + 多人协同，Session 协议和"明日锚点"对项目连续性至关重要 |

### 8.2 难点

| # | 难点 | 挑战 | 应对策略 |
|---|------|------|----------|
| 1 | **需求变更下的增量设计** | 需求持续变化，已完成模块可能需要调整 | 模块独立闭环 + 反向影响审查（Step 3.5）+ Prisma 迁移 |
| 2 | **业务规则的结构化表达** | 安全法规、计量标准、价格策略复杂 | knowledge-base 目录 + Skill 引用 + 术语表 |
| 3 | **Placeholder 的生命周期管理** | 临时方案容易被遗忘，导致技术债 | DEFERRED-FIXES.md 集中管理 + MCP 工具定期扫描 |
| 4 | **Agent SDK 学习曲线** | 团队无 SDK 经验 | Phase 0 充分培训；先用 Claude Code + Skills，逐步引入 SDK API |
| 5 | **评估标准的主观性** | 6 维中"视觉"和"体验"维度主观性强 | 将 D2 功能正确性（可自动化）权重最高；User Journey 检查可脚本化 |

---

## 九、工作量预估（修订版）

> 基于试点"站点管理"模块、3-5 人团队、重要不紧急的节奏。

### 9.1 Phase 0: 基础设施 & PoC

| 任务 | Agent 辅助度 | 工作量 |
|------|-------------|--------|
| 继承治理机制（CORRECTIONS、STANDARDS、宪法） | 中 | 2-3 天 |
| Skills 开发框架 + 模板 | 低（需人工设计） | 2-3 天 |
| 治理层 Skills（4 个） | 中 | 3-4 天 |
| 产品/设计层 Skills（6 个） | 中 | 4-6 天 |
| 工程层 Skills（6 个） | 中 | 3-5 天 |
| 质量/评估层 Skills（4 个） | 中 | 3-4 天 |
| MCP 工具服务（6 个工具） | 中 | 3-4 天 |
| PoC 端到端验证（站点管理列表页） | 高 | 3-4 天 |
| 团队培训材料 | 高 | 2-3 天 |
| **小计** | | **25-36 天（约 4-6 周）** |

### 9.2 Phase 1-5: 站点管理模块（试点）

| 任务 | Agent 辅助度 | 工作量 |
|------|-------------|--------|
| Phase 1: 需求分析 + User Story | 高 | 3-4 天 |
| Phase 2: UX/UI 设计 | 高 | 3-5 天 |
| Phase 3: 架构设计 | 中 | 3-4 天 |
| Phase 4: 工作流设计（如有需要） | 中 | 1-2 天 |
| Phase 5: 前端实现 + 评估迭代 | 高 | 5-8 天 |
| **小计** | | **15-23 天（约 3-4 周）** |

### 9.3 Phase 6-8（站点管理试点的后端 + 质量 + 部署）

| 任务 | Agent 辅助度 | 工作量 |
|------|-------------|--------|
| Phase 6: 后端开发 | 高 | 5-7 天 |
| Phase 7: 测试 | 高 | 3-5 天 |
| Phase 8: 部署基础设施 | 高 | 2-3 天 |
| **小计** | | **10-15 天（约 2-3 周）** |

### 9.4 总计（试点阶段）

| 阶段 | 工作量 | 备注 |
|------|--------|------|
| Phase 0 | 4-6 周 | 基础设施 + PoC（1-2 人） |
| Phase 1-5 | 3-4 周 | 站点管理完整闭环（1-2 人） |
| Phase 6-8 | 2-3 周 | 后端 + 质量 + 部署（1-2 人） |
| **试点总计** | **约 9-13 周** | 单模块全流程验证 |

### 9.5 全面推广预估

试点成功后，剩余 5 个模块的推广：

| 项目 | 预估 | 备注 |
|------|------|------|
| 剩余 5 模块（3-5 人并行） | 8-12 周 | 复用 Skills + 团队已上手，效率提升 50%+ |
| 跨模块整合（Placeholder 统一开发） | 2-3 周 | 审批流、权限中间件、通知系统 |
| **全面推广总计** | **约 10-15 周** | 3-5 人团队 |

### 9.6 整体预估

| 范围 | 工作量 | 条件 |
|------|--------|------|
| 试点（站点管理全流程） | 9-13 周 | 1-2 人 |
| 全面推广（剩余 5 模块 + 整合） | 10-15 周 | 3-5 人 |
| **从启动到全部完成** | **约 19-28 周** | 试点 + 推广串行 |

---

## 十、建议的下一步行动

### 立即可做（在 agent-engineering-practices 项目中）

1. **确认技术选型**（第七节 §7.3 的 5 个待确认决策）
2. **开始 Phase 0** — 从继承治理机制开始
   - 导入 CORRECTIONS.md 10 个模式
   - 导入 STANDARDS.md 术语表
   - 创建第一个 Skill: `session-management`
3. **PoC 目标明确** — 用站点管理的"站点列表页"做最小验证

### PoC 验收标准

- [ ] Agent 能正确执行"需求分析 → 架构设计 → 前端生成"的 3 阶段流程
- [ ] 阻断性门禁有效工作（跳过架构确认时被拦截）
- [ ] 生成的代码通过 TypeScript 编译 + ESLint
- [ ] 术语扫描检测到不一致时能正确报告
- [ ] Session 启动时能正确加载上下文和 CORRECTIONS 意识
- [ ] 团队成员能独立使用 Skills 进行开发

---

## 附录 A: Claude Agent SDK 关键 API

| API | 用途 |
|-----|------|
| `query()` | 核心入口，执行单次 Agent 任务 |
| `createSdkMcpServer()` | 创建自定义 MCP 工具服务 |
| `tool()` | 定义单个 MCP 工具（Zod schema） |
| `options.skills` | 预加载 Skills |
| `options.agents` | 定义子 Agent |
| `options.mcpServers` | 配置 MCP 服务器（type: 'sdk' 用于内嵌） |
| `options.hooks` | 生命周期钩子（PreToolUse 用于门禁） |
| `options.permissionMode` | 权限控制模式 |
| `options.maxBudgetUsd` | 成本限制 |
| `options.canUseTool` | 自定义工具权限回调（用于双重确认） |

## 附录 B: 继承资产清单

| 资产 | 来源 | 在新框架中的角色 |
|------|------|-----------------|
| CORRECTIONS.md（10 模式） | 原项目 docs/ | 初始纠偏知识库 |
| STANDARDS.md（术语表） | 原项目 docs/ | 术语单一事实源 |
| CONSTITUTION.md（8 原则） | 原项目 docs/ | Agent 工作流宪法 |
| AGENT-PLAN.md（14 步流程） | 原项目 docs/ | 模块开发流程模板 |
| SESSION-PROTOCOL.md | 原项目 docs/ | session-management Skill 参考 |
| 11 个 Skill 定义 | 原项目 docs/skills/ | Skills 迁移基础 |
| 200+ TypeScript 接口 | 原项目 frontend/ | 后端数据契约 |
| 15+ Mock 数据集 | 原项目 frontend/mock/ | 测试数据工厂 + 数据库种子 |
| i18n 翻译文件 | 原项目 frontend/locales/ | 直接复用 |
| cross-module-erd.md | 原项目 docs/ | 跨模块 ER 图基础 |
| UI 评估报告 | 原项目 docs/ | 评估维度参考 + 历史基线 |
