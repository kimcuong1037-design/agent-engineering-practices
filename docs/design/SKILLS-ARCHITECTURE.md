# Skills 体系架构

> 定义四层 Skills 体系的完整结构和每个 Skill 的详细设计。

---

## 一、四层 Skills 总览

```
Skills 分层结构:

├── 治理层 Skills (框架治理, 团队协同)
│   ├── session-management     — Session 启动/关闭/交接协议
│   ├── correction-tracking    — CORRECTIONS.md 纠偏记录与模式积累
│   ├── glossary-management    — 术语一致性管理与扫描
│   └── blocking-gate          — 阻断性门禁检查
│
├── 产品/设计层 Skills (开发前阶段)
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
    └── cross-domain-validator     — 跨域一致性校验
```

**总计**: 20 个 Skills（治理 4 + 产品/设计 6 + 工程 6 + 质量 4）

---

## 二、治理层 Skills 详细设计

### Skill: `session-management`

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

### Skill: `correction-tracking`

```
目的: 持续积累纠偏经验，防止同类错误反复出现
触发: 用户指出问题或修正 Agent 输出时

流程:
  1. 识别纠偏模式: 匹配现有 P1-P10 模式，或创建新模式 P11+
  2. 记录到 CORRECTIONS.md:
     - §1 模式查询表: 一行摘要
     - §2 时间线: 日期 | 标题 | 根因 | 关联模式
  3. 完整记录到 CORRECTIONS-ARCHIVE.md（含上下文和根因分析）
  4. 检查是否需要更新相关 Skill 定义（P6 模式要求）

规则: 每个新模块开发前，必须复读 §1 模式表
```

### Skill: `glossary-management`

```
目的: 维护术语一致性，确保所有文档和代码使用统一术语
触发: Step 9.5 术语扫描、新增术语时

三层术语体系:
  Layer 1: 业务术语（加注机、加油枪、油罐、工单...）
  Layer 2: 角色术语（站长、安全主管、操作员...）
  Layer 3: 模块/菜单术语 + 状态枚举

流程:
  1. 新增术语 → 先在 STANDARDS.md 中注册（中文 + 英文 + 代码命名）
  2. 扫描 → 使用 MCP 工具 terminology-scan 检查文档/代码一致性
  3. 报告 → 输出不一致项 + 修复建议
```

### Skill: `blocking-gate`

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

---

## 三、产品/设计层 Skills 详细设计

### Skill: `requirement-decomposition`

```
目的: 将模块需求拆解为 L1-L4 层级
输入: 模块名称 + 业务描述
输出: requirements.md

分解层级:
  L1: 子系统（按域划分）
  L2: 模块（如站点管理）
  L3: 功能组
  L4: 原子功能点（可被单个测试用例验证）

每个 L4 标注优先级: [MVP] / [MVP+] / [PROD] / [FUTURE]

分解原则:
  - 忠实拆分，不即兴发挥
  - 每个子问题有明确的输入、输出、验收标准
```

### Skill: `user-story-writing`

```
目的: 为每个 L4 功能点生成 User Story + 验收标准
输入: requirements.md 中的 L4 列表
输出: user-stories.md

User Story 格式:
  作为 [角色]，我希望 [功能]，以便 [价值]

验收标准格式:
  Given [前置条件], When [操作], Then [预期结果]
```

### Skill: `ux-design`

```
目的: 定义用户旅程、交互流程、页面间导航关系
输入: user-stories.md
输出: ux-design.md

内容:
  - 用户旅程图
  - 页面间导航关系
  - 核心交互流程
  - 状态转换说明
```

### Skill: `ui-schema-design`

```
目的: 定义每个页面的组件结构、数据绑定、状态管理
输入: ux-design.md + types.ts（如已有）
输出: ui-schema.md

内容:
  - 页面组件树
  - 数据绑定关系
  - 状态管理策略
  - 组件属性定义
```

### Skill: `data-model-design`

```
目的: 完成实体建模和数据库 Schema 设计
输入: requirements.md + 领域知识
输出: architecture.md

实体三问分析（必须执行，不可跳过）:
  Q1: 本实体自身承载哪些字段（非继承）？
  Q2: 如何创建（手动 vs 自动）？
  Q3: 有哪些副作用和生命周期约束？

产出:
  - PostgreSQL Schema 草案（ENUM + CREATE TABLE + 索引 + 约束）
  - 跨模块 ER 图更新（cross-module-erd.md）
  - 跨模块数据流定义（下游消费者 + 触发机制 + 数据契约）
  - 聚合接口预分析
  - API 端点设计（RESTful + 请求/响应 JSON 示例）
```

### Skill: `workflow-design`

```
目的: 对涉及多步骤/多角色的业务流程进行工作流建模
触发: 模块中存在状态机类业务流程时

适用场景:
  - 交接班向导流程
  - 价格调整审批流
  - 巡检计划→执行→问题跟踪
  - 维修工单生命周期

产出:
  - 状态图
  - 角色矩阵
  - 触发条件
  - 数据流
  - Placeholder 决策（共享功能标记为 ⚠️ Phase N Dependency）
```

---

## 四、工程层 Skills 详细设计

### Skill: `react-component-dev`

```
目的: 生成符合规范的 React 组件代码
触发: Phase 5 前端实现阶段

12 层 Import 规范（严格，不可调换）:
  1. React 核心
  2. Router & Navigation
  3. i18n
  4. Ant Design 组件（字母序）
  5. Ant Design icons
  6. Ant Design 类型
  7. 外部库
  8. Mock 数据
  9. 模块类型
  10. 模块常量
  11. 共享组件
  12. 本地子组件

交互完整性规则（继承 P4）:
  - 每个 hoverable/cursor:pointer 必须有对应 onClick
  - 面包屑可点击带导航
  - 统计卡片与列表过滤器双向联动
  - 主列表含全量数据，专项视图是过滤子集
```

### Skill: `mock-data-creation`

```
目的: 生成覆盖全生命周期的 Mock 数据
输入: types.ts 中的接口定义
输出: mock/ 目录下的数据文件

规则（继承 P5）:
  - Mock 数据覆盖全生命周期（created → active → completed → archived）
  - 交叉验证状态与详情数据
  - 扩展 custom_fields / source_doc / tags
```

### Skill: `i18n-integration`

```
目的: 完成国际化集成并确保完整性
输入: 组件代码
输出: 更新的 locale 文件（zh-CN + en-US）

规则（继承 P9）:
  - 禁止嵌套对象键作叶子翻译键
  - 使用 common.* 通用词
  - 叶子节点必须是字符串
  - 全局完整性校验（扫描所有 t() 调用，验证两种语言都有对应 key）
```

### Skill: `api-implementation`

```
目的: 基于 architecture.md 生成后端 API 代码
输入: architecture.md 中的 API 设计
输出: Node.js + Fastify 路由/控制器/验证

技术栈: Node.js + Fastify + Prisma + PostgreSQL
规则（继承 P10）:
  - 所有写端点有完整请求/响应 JSON 示例
  - GET/POST/PUT/PATCH/DELETE 同等对待
```

### Skill: `test-generator`

```
目的: 基于现有代码自动生成测试
输入: 源文件路径
输出:
  - 单元测试（Vitest）
  - 组件测试（React Testing Library）
  - API 测试（supertest）
  - Mock 数据工厂（基于 types.ts）
```

### Skill: `module-bootstrap`

```
目的: 一键生成新功能模块的完整脚手架
输入: 模块名称、业务描述、数据模型
输出:
  - 前端: pages/ + components/ + types.ts + constants.ts + hooks/
  - 后端: routes/ + controllers/ + models/ + validators/
  - 测试: __tests__/（单元 + 集成）
  - 文档: requirements.md + architecture.md
```

---

## 五、质量/评估层 Skills 详细设计

### Skill: `ui-eval`

```
目的: 执行 6 维 UI 评估
输入: 已实现的模块代码
输出: 评估报告

详见: governance/EVALUATION-FRAMEWORK.md

评估流程:
  1. 6 维评分 → 加权汇总
  2. P1 二次分类（Business vs Experience + 修改成本）
  3. 用户确认修复优先级
  4. 修复 → 重评估 → 直到退出条件
```

### Skill: `code-review`

```
目的: 自动代码审查
触发: 代码实现完成后

检查项:
  - TypeScript strict mode 合规
  - 无 any 类型
  - 组件拆分合理
  - 无硬编码 magic number
  - 无死代码
  - 安全问题
```

### Skill: `delivery-checklist`

```
目的: 执行模块交付 9 项检查
触发: Step 12i

详见: governance/AGENT-WORKFLOW.md §四
```

### Skill: `cross-domain-validator`

```
目的: 确保多 Agent 并行工作时的跨域一致性
触发: 架构设计完成后、前端实现完成后

检查维度:
  1. 术语一致性: 扫描文档/代码 vs STANDARDS.md
  2. ER 关系完整性: cross-module-erd.md vs 代码实现
  3. Placeholder 追踪: ⚠️ 标记 vs DEFERRED-FIXES.md
  4. 共享实体一致性: 跨模块 types.ts 定义一致性
  5. API 契约: 前端调用 vs 后端端点

输出: 跨域一致性报告（问题清单 + 修复建议）
```

---

## 六、Skill 文件模板

每个 Skill 文件应遵循以下结构（用于 Anthropic Skills API 上传或本地使用）：

```markdown
# Skill: [名称]

## 元信息
- Skill ID: [唯一标识]
- 所属层级: [治理/产品设计/工程/质量]
- Agent 类型: [使用此 Skill 的 Agent]
- 输入: [所需输入]
- 输出: [产出物]
- 依赖: [前置 Skill 或文档]

## 流程定义
### Step 1: [动作]
[详细操作说明]
### Step 2: [动作]
...

## Prompt 模板
[含 {{VARIABLE}} 占位符的 Prompt 模板]

## 输出格式
[预期的文件结构和内容格式]

## 检查清单
- [ ] 检查项 1
- [ ] 检查项 2
```
