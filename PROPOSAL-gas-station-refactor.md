# 加气站项目基于 Claude Agent SDK 重构 Proposal

> **日期**: 2026-03-03
> **项目**: gas-station-software → Agent-Driven Architecture
> **当前状态**: 加气站项目为纯前端原型（React + TypeScript + Ant Design），无后端、无测试、无部署管道
> **目标**: 评估并规划使用 Claude Agent SDK + Skills 体系来重构加气站项目，提升团队协同效率

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

### 1.4 项目优势

- 文档体系非常完善（CONSTITUTION.md、AGENT-PLAN.md、CORRECTIONS.md、STANDARDS.md）
- 模块化结构清晰，每模块有 types.ts / constants.ts / userStoryMapping.ts
- i18n 从第一天就做了
- 需求可追溯（RequirementTag 组件映射到需求 ID）

### 1.5 项目短板

- **无后端** — 所有数据为客户端 Mock，无持久化
- **无状态管理** — 复杂交互场景下 props drilling 严重
- **无测试** — 0 单元测试 / 集成测试 / E2E 测试
- **无表单校验框架** — Ant Form 的 rules 使用不充分
- **无错误处理策略** — 缺乏全局 Error Boundary 和重试逻辑
- **Mock 数据维护成本高** — 15+ 数据集需手动同步

---

## 二、重构带来的好处及潜在问题

### 2.1 好处

#### A. 团队协同层面
| 好处 | 说明 |
|------|------|
| **标准化开发流程** | 通过 Skills 定义模块级开发规范（编码标准、API 规范、测试覆盖率要求），每个开发者使用相同的 Agent 工作流 |
| **知识沉淀与复用** | 将加气站领域知识（油品类型、安全法规、计量标准）编码为 Skills，新成员即可快速上手 |
| **一致性保障** | Agent 驱动的代码生成确保所有模块遵循相同的架构模式、命名规范、错误处理策略 |
| **Review 效率提升** | Agent 可自动执行代码审查、安全检查、标准合规检查，减少人工 Review 负担 |

#### B. 技术层面
| 好处 | 说明 |
|------|------|
| **补齐后端短板** | 通过 Agent 辅助快速生成后端 API、数据库 Schema、ORM 模型 |
| **自动化测试生成** | Agent 可基于现有 types.ts 和 Mock 数据自动生成单元测试和集成测试 |
| **架构升级** | 引入状态管理（Zustand/Jotai）、API 客户端层、错误边界等生产级基础设施 |
| **文档代码同步** | Agent 可确保代码变更时文档自动更新，避免文档过时 |

#### C. 效率层面
| 好处 | 说明 |
|------|------|
| **加速重复性工作** | CRUD 页面、表格配置、表单校验等模式化代码由 Agent 生成 |
| **减少低级错误** | Agent 自动校验类型一致性、API 契约匹配、i18n key 完整性 |
| **并行开发能力** | 不同模块可由不同 Agent 实例并行处理，互不干扰 |

### 2.2 潜在问题与风险

| 风险 | 严重程度 | 缓解策略 |
|------|----------|----------|
| **Agent 生成代码质量不可控** | 高 | 建立严格的 Review Skill + 自动化测试门槛 |
| **SDK 版本不稳定** | 中 | claude-agent-sdk 目前 v0.2.x，V2 API 标记为 unstable；锁定版本 + 关注变更日志 |
| **领域知识表达局限** | 中 | 加气站业务规则复杂（安全法规、计量标准），Skill 的 prompt 表达有限；需辅以结构化的 knowledge-base |
| **团队学习成本** | 中 | 团队需要学习 Agent SDK + MCP + Skills 体系；需渐进式引入 |
| **调试困难** | 中 | Agent 多步操作出错时追踪困难；利用 SDK 的 `debug` + `hooks` 机制做可观测性 |
| **过度依赖 AI** | 低 | 核心业务逻辑仍需人工设计和审查；Agent 定位为加速器而非替代者 |
| **成本控制** | 低 | API 调用有费用；用 `maxBudgetUsd` 限制 + Haiku 处理简单任务 |

---

## 三、重构阶段与步骤规划

### Phase 0: 基础设施准备（当前项目中完成）
> 在 agent-engineering-practices 项目中搭建和验证

**步骤**:
1. **搭建 Skills 开发框架** — 创建 Skills 项目模板（SKILL.md + 辅助文件）
2. **开发核心 Skills** — 编码规范 Skill、API 设计 Skill、测试生成 Skill
3. **构建 MCP 工具服务** — 用 `createSdkMcpServer()` 构建加气站领域工具
4. **端到端验证** — 用一个简单模块（如站点管理的 List 页面）验证完整流程
5. **编写团队使用手册** — Skills 使用指南、Agent 工作流文档

### Phase 1: 架构升级（加气站项目中执行）
> 在不改变业务功能的前提下，升级技术基础设施

**步骤**:
1. **引入状态管理** — Zustand 或 Jotai 替代 useState + Outlet Context
2. **添加 API 客户端层** — 建立 API 抽象层（Axios/Fetch wrapper），Mock 数据迁移到 MSW
3. **建立测试基础设施** — Vitest + React Testing Library + MSW
4. **添加错误处理** — 全局 Error Boundary + Toast 通知系统
5. **引入表单校验** — Ant Form rules 补全或引入 Zod schema
6. **代码分层** — 将 UI 逻辑和业务逻辑分离（hooks 层）

### Phase 2: 后端开发（Agent 驱动）
> 基于现有文档和 types.ts 用 Agent 生成后端

**步骤**:
1. **数据库 Schema 设计** — 基于架构文档中的 ER 图生成 PostgreSQL schema
2. **API 开发** — RESTful API（Node.js + Express/Fastify 或 Python + FastAPI）
3. **认证授权** — JWT + RBAC（8 个角色的权限矩阵）
4. **前后端对接** — 将 Mock 数据替换为真实 API 调用
5. **数据迁移** — Mock 数据作为种子数据导入

### Phase 3: 质量保障（Agent 驱动）
> 全面补齐测试和质量体系

**步骤**:
1. **单元测试** — 所有 utility 函数、hooks、业务逻辑
2. **集成测试** — API 端到端测试
3. **E2E 测试** — Playwright 覆盖核心业务流程
4. **安全审查** — OWASP Top 10 检查
5. **性能优化** — 大数据量分页、虚拟滚动、懒加载
6. **无障碍合规** — WCAG 2.1 基本合规

### Phase 4: 部署与运维
**步骤**:
1. **CI/CD 管道** — GitHub Actions（lint → test → build → deploy）
2. **容器化** — Dockerfile + docker-compose
3. **监控** — 日志 + 错误追踪 + 性能监控
4. **文档同步** — 确保文档与代码保持一致

---

## 四、Agent 与 Skills 的规划设计

这是本次重构的核心创新点。以下是我建议的 Agent/Skills 架构：

### 4.1 Skills 体系设计

```
Skills 分层结构:
├── 基础层 Skills (通用, 跨项目复用)
│   ├── code-standards        — 编码规范检查与修正
│   ├── api-design             — RESTful API 设计与生成
│   ├── test-generator         — 自动测试生成
│   ├── db-schema              — 数据库 Schema 设计
│   └── security-review        — 安全审查（可复用内置 /security-review）
│
├── 领域层 Skills (加气站业务专用)
│   ├── gas-station-domain     — 加气站领域知识（油品、法规、计量）
│   ├── station-operations     — 运营业务规则
│   └── energy-trade-rules     — 能源贸易业务规则
│
└── 工作流 Skills (团队协同专用)
    ├── module-bootstrap       — 新模块脚手架（前+后端+测试+文档）
    ├── pr-workflow             — PR 创建与审查流程
    └── release-checklist      — 发版检查清单
```

### 4.2 各 Skill 详细设计

#### Skill 1: `code-standards`
```
目的: 确保所有代码遵循统一规范
触发: 代码编写完成后自动触发
内容:
  - TypeScript strict mode 规范
  - React 组件命名/结构规范
  - 文件组织规范 (types.ts / constants.ts / hooks/ / components/)
  - i18n key 命名规范
  - Git commit message 规范
```

#### Skill 2: `module-bootstrap`
```
目的: 一键生成新功能模块的完整脚手架
触发: 开发者需要创建新模块时
输入: 模块名称、业务描述、数据模型
输出:
  - 前端: pages/ + components/ + types.ts + constants.ts + hooks/
  - 后端: routes/ + controllers/ + models/ + validators/
  - 测试: __tests__/ (单元 + 集成)
  - 文档: requirements.md + architecture.md
```

#### Skill 3: `gas-station-domain`
```
目的: 提供加气站领域知识上下文
内容:
  - 油品分类 (92#, 95#, 98#, 0#柴油, LNG, CNG)
  - 安全法规 (AQ 3010, GB 50156)
  - 计量标准 (体积温度补偿、密度换算)
  - 设备分类 (7类: 油罐、加油机、油泵、阀门、传感器、消防、电气)
  - 角色权限矩阵 (8个角色)
  - 业务流程 (加油→结算→交接班→盘点)
```

#### Skill 4: `api-design`
```
目的: 基于数据模型自动设计 RESTful API
输入: TypeScript 接口定义 (types.ts)
输出:
  - API 端点设计 (CRUD + 业务操作)
  - 请求/响应 Schema (Zod validation)
  - OpenAPI/Swagger 规范
  - API 客户端代码 (前端调用层)
```

#### Skill 5: `test-generator`
```
目的: 基于现有代码自动生成测试
输入: 源文件路径
输出:
  - 单元测试 (Vitest)
  - 组件测试 (React Testing Library)
  - API 测试 (supertest)
  - Mock 数据工厂 (基于 types.ts)
```

### 4.3 MCP 工具服务设计

使用 `createSdkMcpServer()` 创建领域特定工具：

```typescript
// gas-station-mcp-server.ts
const server = createSdkMcpServer({
  name: 'gas-station-tools',
  version: '1.0.0',
  tools: [
    // 工具 1: 验证油品数据一致性
    tool('validate-fuel-data', '校验油品数据的完整性和一致性',
      z.object({ module: z.string() }),
      async (args) => { /* 检查 types.ts 与 mock 数据的一致性 */ }
    ),

    // 工具 2: 生成 i18n keys
    tool('generate-i18n', '为新增组件生成中英文 i18n keys',
      z.object({ component: z.string(), keys: z.array(z.string()) }),
      async (args) => { /* 生成并插入 i18n 翻译 */ }
    ),

    // 工具 3: 检查模块完整性
    tool('check-module-completeness', '检查功能模块是否包含所有必要文件',
      z.object({ modulePath: z.string() }),
      async (args) => { /* 验证 types.ts, constants.ts, pages/, etc. */ }
    ),

    // 工具 4: 需求追溯
    tool('trace-requirement', '追溯需求到代码实现',
      z.object({ requirementId: z.string() }),
      async (args) => { /* 查找 userStoryMapping.ts 中的映射 */ }
    )
  ]
})
```

### 4.4 Agent 工作流编排

```
典型开发流程 (Agent-Driven):

Developer                Agent (Claude)              Skills/MCP
   │                          │                          │
   ├─ "创建库存预警模块" ──────→│                          │
   │                          ├─ 加载 gas-station-domain ─→│ 领域知识
   │                          ├─ 加载 module-bootstrap ───→│ 脚手架模板
   │                          │                          │
   │                          ├─ 分析现有模块结构 ──────────│
   │                          ├─ 生成前端脚手架 ───────────│
   │                          ├─ 生成后端 API ─────────────│
   │                          ├─ 生成测试文件 ─────────────│
   │                          ├─ 生成 i18n keys ──────────→│ MCP: generate-i18n
   │                          ├─ 检查模块完整性 ──────────→│ MCP: check-module
   │                          ├─ 运行 code-standards ─────→│ 规范检查
   │                          │                          │
   │←─ 生成完毕，请 Review ────│                          │
   │                          │                          │
   ├─ "Review 通过" ──────────→│                          │
   │                          ├─ 运行测试 ────────────────│
   │                          ├─ 创建 PR ─────────────────│
   │                          │                          │
   │←─ PR 已创建 ─────────────│                          │
```

### 4.5 多 Agent 协同方案

利用 SDK 的 subagent 能力实现并行开发：

```typescript
const options: Options = {
  agents: [
    {
      name: 'frontend-agent',
      description: '负责前端 React 组件开发',
      // 限定工具范围，只能操作 frontend/ 目录
    },
    {
      name: 'backend-agent',
      description: '负责后端 API 和数据库开发',
    },
    {
      name: 'test-agent',
      description: '负责测试编写和执行',
    },
    {
      name: 'review-agent',
      description: '负责代码审查和质量把关',
    }
  ]
}
```

---

## 五、核心重点与难点

### 5.1 重点

| # | 重点 | 原因 |
|---|------|------|
| 1 | **Skills 的领域知识准确性** | 加气站业务规则复杂（安全法规、计量标准、多角色权限），Skill 中的描述必须准确否则会生成错误代码 |
| 2 | **Mock → 真实 API 的平滑迁移** | 15+ Mock 数据集需要逐步替换为真实 API 调用，不能破坏现有前端 |
| 3 | **Agent 生成代码的质量把控** | 需要建立自动化质量门禁（lint + test + review），防止 AI 生成的代码引入 bug |
| 4 | **团队工作流的标准化** | Skills 和 Agent 流程需要团队统一执行，否则会出现"有人用 Agent 有人不用"的分裂 |

### 5.2 难点

| # | 难点 | 挑战 | 应对策略 |
|---|------|------|----------|
| 1 | **业务规则的结构化表达** | 加气站的安全法规、计量标准、价格策略等规则复杂，难以在 Skill prompt 中完整表达 | 使用 knowledge-base 目录存储结构化领域知识，Skill 引用而非内嵌 |
| 2 | **跨模块数据一致性** | 6 个模块间有大量数据关联（站点→设备→维修工单→巡检），Agent 修改一个模块时可能破坏其他模块 | 建立跨模块 ER 图约束 + MCP 工具校验一致性 |
| 3 | **Agent SDK 的稳定性** | V2 API 标记为 unstable，版本迭代快 | 封装一层抽象层，隔离 SDK API 变化；锁定版本 |
| 4 | **增量重构的复杂性** | 不能一次性重写所有代码，需要逐模块渐进式重构，新旧代码要共存 | 按模块独立重构，Feature Flag 控制新旧切换 |
| 5 | **i18n 的同步维护** | 新生成的代码需要同时维护中英文翻译，容易遗漏 | MCP 工具自动生成 i18n keys + 完整性检查 |

---

## 六、需要您输入的关键决策

以下决策会显著影响重构方案的方向：

### 6.1 技术选型决策

| # | 决策点 | 选项 | 我的建议 |
|---|--------|------|----------|
| 1 | **后端技术栈** | A. Node.js + Express/Fastify<br>B. Python + FastAPI<br>C. 暂不做后端 | **A** — 前后端统一 TypeScript，类型可共享 |
| 2 | **数据库** | A. PostgreSQL<br>B. MySQL<br>C. MongoDB | **A** — 结构化数据 + 关系模型最适合 |
| 3 | **ORM** | A. Prisma<br>B. Drizzle<br>C. TypeORM | **A** — 类型安全、Schema 驱动、生态成熟 |
| 4 | **状态管理** | A. Zustand<br>B. Jotai<br>C. Redux Toolkit | **A** — 轻量、TypeScript 友好、学习曲线低 |
| 5 | **测试框架** | A. Vitest<br>B. Jest | **A** — 与 Vite 生态一致、速度快 |

### 6.2 流程决策

| # | 决策点 | 说明 |
|---|--------|------|
| 6 | **重构范围** | 是全部 6 个模块都重构，还是先选 1-2 个做试点？建议先试点"站点管理"模块 |
| 7 | **团队规模** | 预计有多少人参与？这影响 Skills 的粒度设计和协同策略 |
| 8 | **团队的 Agent SDK 经验** | 团队成员是否有使用 Claude Code / Agent SDK 的经验？影响培训投入 |
| 9 | **时间预期** | 希望在多长时间内完成重构？影响阶段划分和优先级 |
| 10 | **部署环境** | 目标部署环境是什么？（云服务、私有化、混合）影响容器化和 CI/CD 方案 |

### 6.3 业务决策

| # | 决策点 | 说明 |
|---|--------|------|
| 11 | **需求变更** | 在重构过程中，业务需求是否可能变化？如果是，需要更灵活的架构 |
| 12 | **数据迁移** | 现有的 Mock 数据是否就是最终的业务数据结构？还是需要调整？ |
| 13 | **性能要求** | 是否有特定的性能指标（响应时间、并发用户数、数据量）？ |
| 14 | **合规要求** | 加气站行业是否有特殊的数据合规要求（数据本地化、审计日志等）？ |

---

## 七、工作量预估

### 7.1 Phase 0: 基础设施准备（在 agent-engineering-practices 中）

| 任务 | Agent 辅助度 | 工作量预估 |
|------|-------------|-----------|
| Skills 开发框架搭建 | 低（需人工设计） | 2-3 天 |
| 5 个核心 Skills 开发 | 中 | 5-7 天 |
| MCP 工具服务开发 | 中 | 3-4 天 |
| 端到端验证（试点模块） | 高 | 2-3 天 |
| 团队使用手册 | 高 | 1-2 天 |
| **小计** | | **13-19 天（约 2-3 周）** |

### 7.2 Phase 1: 架构升级

| 任务 | Agent 辅助度 | 工作量预估 |
|------|-------------|-----------|
| 引入状态管理 | 高 | 3-4 天 |
| API 客户端层 + MSW | 高 | 2-3 天 |
| 测试基础设施 | 高 | 2-3 天 |
| 错误处理 + 表单校验 | 高 | 2-3 天 |
| 代码分层重构 | 中 | 3-5 天 |
| **小计** | | **12-18 天（约 2-3 周）** |

### 7.3 Phase 2: 后端开发

| 任务 | Agent 辅助度 | 工作量预估 |
|------|-------------|-----------|
| 数据库 Schema（6 模块） | 高 | 3-4 天 |
| RESTful API 开发（6 模块） | 高 | 8-12 天 |
| 认证授权（JWT + RBAC） | 中 | 3-4 天 |
| 前后端对接 | 高 | 5-7 天 |
| 数据种子 + 迁移 | 高 | 2-3 天 |
| **小计** | | **21-30 天（约 3-5 周）** |

### 7.4 Phase 3: 质量保障

| 任务 | Agent 辅助度 | 工作量预估 |
|------|-------------|-----------|
| 单元测试（目标 80% 覆盖率） | 很高 | 5-7 天 |
| 集成测试 | 高 | 3-4 天 |
| E2E 测试（核心流程） | 中 | 4-6 天 |
| 安全审查 + 修复 | 中 | 2-3 天 |
| 性能优化 | 低 | 3-5 天 |
| **小计** | | **17-25 天（约 3-4 周）** |

### 7.5 Phase 4: 部署与运维

| 任务 | Agent 辅助度 | 工作量预估 |
|------|-------------|-----------|
| CI/CD 管道 | 高 | 2-3 天 |
| 容器化 | 高 | 1-2 天 |
| 监控 + 日志 | 中 | 2-3 天 |
| 文档同步 | 高 | 1-2 天 |
| **小计** | | **6-10 天（约 1-2 周）** |

### 7.6 总计

| 阶段 | 工作量 | 备注 |
|------|--------|------|
| Phase 0 | 2-3 周 | 当前项目中完成 |
| Phase 1 | 2-3 周 | 可与 Phase 0 部分并行 |
| Phase 2 | 3-5 周 | 核心工作量 |
| Phase 3 | 3-4 周 | 可与 Phase 2 后期并行 |
| Phase 4 | 1-2 周 | 可与 Phase 3 后期并行 |
| **总计** | **约 8-13 周**（1 人全职） | 多人并行可压缩至 4-8 周 |

> **注意**: 以上估算基于 Agent 辅助效率提升约 40-60% 的假设。如果不使用 Agent，同等工作量预计需 15-22 周。

---

## 八、建议的下一步行动

### 立即可做（在 agent-engineering-practices 项目中）

1. **选择一个试点模块**（建议"站点管理"—最简单且独立）
2. **开发第一个 Skill** — `gas-station-domain`（领域知识 Skill）
3. **创建 MCP 工具原型** — 验证 `createSdkMcpServer()` + 自定义工具的可行性
4. **端到端 PoC** — 用 Agent + Skill 重新生成站点管理模块的列表页，对比质量

### 验收标准

PoC 成功的标准：
- [ ] Agent 能正确理解加气站领域知识
- [ ] 生成的代码符合现有编码规范
- [ ] 生成的代码通过 TypeScript 编译
- [ ] 生成的 i18n keys 完整且准确
- [ ] 团队成员能独立使用 Skills 进行开发

---

## 附录 A: Claude Agent SDK 关键 API

| API | 用途 |
|-----|------|
| `query()` | 核心入口，执行单次 Agent 任务 |
| `createSdkMcpServer()` | 创建自定义 MCP 工具服务 |
| `tool()` | 定义单个 MCP 工具（Zod schema） |
| `unstable_v2_createSession()` | 多轮会话（alpha） |
| `options.skills` | 预加载 Skills |
| `options.agents` | 定义子 Agent |
| `options.mcpServers` | 配置 MCP 服务器 |
| `options.hooks` | 生命周期钩子（20 个事件） |
| `options.permissionMode` | 权限控制模式 |
| `options.maxBudgetUsd` | 成本限制 |

## 附录 B: 现有项目资产可复用清单

| 资产 | 复用方式 |
|------|----------|
| 50+ 文档文件 | 直接作为 Skill 的 knowledge-base |
| 200+ TypeScript 接口 | 作为后端开发的数据契约 |
| 15+ Mock 数据集 | 作为测试数据工厂和数据库种子 |
| userStoryMapping.ts | 需求追溯 MCP 工具的数据源 |
| CONSTITUTION.md | Agent 工作流的基础规则 |
| STANDARDS.md | code-standards Skill 的核心参考 |
| i18n 翻译文件 | 直接复用，由 MCP 工具增量维护 |
