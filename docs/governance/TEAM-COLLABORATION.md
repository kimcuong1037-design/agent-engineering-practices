# 团队协同机制

> 面向 3-5 人团队的协同规则，涵盖 Session 协议、共享资源管理、跨域处理策略。

---

## 一、Session 协同协议

### 1.1 Session 启动（5 步）

每次 Agent Session 启动时，必须执行：

1. **读取 PROGRESS.md** — 获取当前模块状态和上次停在哪里
2. **读取 ROADMAP.md** — 了解整体进度
3. **加载 CORRECTIONS.md §1 模式表** — 建立纠偏意识
4. **加载当前模块上下文** — 读取该模块的需求/架构/设计文档
5. **与用户对齐** — "当前在模块 X 的第 Y 步，上次完成了 Z，接下来继续..."

### 1.2 Session 关闭（4 步）

每次 Agent Session 结束前，必须执行：

1. **更新 PROGRESS.md** — 当前步骤状态、已完成工作、影响的文件列表
2. **更新 ROADMAP.md** — 如果有模块或阶段完成
3. **记录纠偏** — 如果本次 Session 中发现了新的纠偏模式
4. **写"明日锚点"** — 记录：
   - 当前模块
   - 继续的步骤（AGENT-PLAN Step N）
   - 待确认事项
   - 建议优先读取的文件

### 1.3 模块交接清单

当一个人需要将未完成的模块交给另一个人时，须提供：

- [ ] 当前 AGENT-PLAN Step
- [ ] 文档完成度（requirements ✅ / architecture ⬜ / ux ⬜ ...）
- [ ] 已完成的检查项
- [ ] **未解决问题**（含上下文）
- [ ] **关键文件**位置
- [ ] **特殊注意事项**（跨模块依赖、已知技术债、用户偏好）

---

## 二、共享资源管理

### 2.1 共享资源清单

以下资源为所有 Agent / 团队成员**只读引用**，修改须走审批流程：

```
共享资源:
├── STANDARDS.md          — 术语表 (Single Source of Truth)
├── cross-module-erd.md   — 跨模块 ER 图
├── DEFERRED-FIXES.md     — Placeholder 追踪表
├── CORRECTIONS.md        — 纠偏模式表
└── router.tsx            — 路由注册表 (避免冲突)
```

### 2.2 术语一致性管理

继承自原框架的 `glossary-management` Skill：

- **STANDARDS.md** 是术语的**单一事实源**
- 三层术语体系:
  - **Layer 1**: 业务术语（加注机、加油枪、油罐、工单...）
  - **Layer 2**: 角色术语（站长、安全主管、操作员...）
  - **Layer 3**: 模块/菜单术语 + 状态枚举
- **规则**:
  - 新增术语前必须先在 STANDARDS.md 中注册
  - MCP 工具 `terminology-scan` 在代码生成后自动扫描一致性
  - Step 9.5 术语一致性扫描是必经步骤

### 2.3 共享资源修改流程

```
需要修改共享资源时:
1. 提出修改需求（说明原因和影响范围）
2. 评估对其他正在进行的模块的影响
3. 通知所有相关开发者
4. 获得用户/负责人审批
5. 执行修改
6. 通知所有人更新本地引用
```

---

## 三、跨域处理策略

> 3-5 人并行开发时的核心挑战：确保基于同一套标准，处理好跨模块关系。

### 3.1 跨域一致性校验

使用 `cross-domain-validator` Skill，在以下时机执行：
- 架构设计完成后
- 前端实现完成后

**校验维度**:
1. **术语一致性** — 扫描文档和代码，检查是否使用 STANDARDS.md 注册的术语
2. **ER 关系完整性** — 验证 cross-module-erd.md 中所有外键关系在代码中正确实现
3. **Placeholder 追踪** — 扫描 `⚠️ Phase N Dependency` 标记，确认记入 DEFERRED-FIXES.md
4. **共享实体一致性** — 检查跨模块共享实体（Station、Employee 等）在各模块 types.ts 中定义一致
5. **API 契约** — 验证前端 API 调用与后端端点定义的参数/响应一致

### 3.2 Placeholder 管理策略

跨模块共享功能（如统一审批流）的处理方式：

```
1. 识别: 在架构阶段识别"这个功能跨越多个模块"
2. 标记: 在 architecture.md 中标记为 ⚠️ Phase N Dependency
3. 登记: 记入 DEFERRED-FIXES.md，包含:
   - 功能描述
   - 涉及模块列表
   - 临时替代方案
   - 预计统一开发时间
4. 实现临时版: 在各模块中实现最简 Placeholder
5. 统一开发: 所有依赖模块完成后，统一开发共享功能并替换 Placeholder
```

**典型 Placeholder 示例**:

| 共享功能 | 临时方案 | 统一开发时机 |
|----------|----------|-------------|
| 全站统一审批流 | 硬编码 "已审批" / "待审批" 状态切换 | 所有涉及审批的模块完成后 |
| 权限中间件 | Mock 角色检查函数，始终返回 true | 后端 Phase 6 |
| 消息通知系统 | console.log + Toast | 全模块完成后 |

---

## 四、多 Agent 并行工作指引

### 并行安全的操作
- 不同模块的 `features/{domain}/{module}/` 目录下的文件修改
- 各模块独立的 Mock 数据
- 各模块独立的 i18n keys（模块前缀隔离）

### 需要协调的操作
- 修改 `router.tsx`（路由注册）
- 修改 `AppLayout.tsx`（导航菜单）
- 修改共享组件（RequirementTag.tsx 等）
- 修改共享资源（STANDARDS.md、cross-module-erd.md 等）
- 新增/修改跨模块引用的 TypeScript 类型

### 冲突预防

- 每个模块的路由前缀确保唯一（`/operations/station`, `/operations/shift-handover` 等）
- i18n key 使用模块名作前缀（`station.xxx`, `shiftHandover.xxx`）
- 共享类型放在独立的 `shared/types.ts` 中，修改走审批
