# 继承资产清单

> 从原加气站项目（gas-station-software）继承到新框架中的资产。

---

## 治理类资产

| 资产 | 来源 | 在新框架中的角色 | 继承状态 |
|------|------|-----------------|----------|
| CORRECTIONS.md（10 模式） | 原项目 docs/ | 初始纠偏知识库 → governance/CORRECTIONS.md | ✅ 已继承 |
| STANDARDS.md（术语表） | 原项目 docs/ | 术语单一事实源 → governance/STANDARDS.md | ✅ 已继承（v1.3，适配 Fastify/Zustand/Vitest） |
| CONSTITUTION.md（8 原则） | 原项目 docs/ | Agent 工作流宪法 → governance/CONSTITUTION.md | ✅ 已继承 |
| AGENT-PLAN.md（14 步流程） | 原项目 docs/ | 模块开发流程模板 → governance/AGENT-WORKFLOW.md | ✅ 已继承 |
| SESSION-PROTOCOL.md | 原项目 docs/ | session-management Skill 参考 → governance/TEAM-COLLABORATION.md | ✅ 已继承 |

## Skill 资产

| 资产 | 来源 | 在新框架中的角色 | 继承状态 |
|------|------|-----------------|----------|
| 11 个 Skill 定义 | 原项目 docs/skills/ | Skills 迁移基础 → design/SKILLS-ARCHITECTURE.md | ✅ 已继承（设计层面） |
| UI 评估报告 | 原项目 docs/ | 评估维度参考 + 历史基线 | ✅ 已继承到 EVALUATION-FRAMEWORK.md |

## 代码资产

| 资产 | 来源 | 在新框架中的角色 | 继承状态 |
|------|------|-----------------|----------|
| 200+ TypeScript 接口 | 原项目 frontend/src/ | 后端数据契约 | ⬜ 待迁移（Phase 3） |
| 15+ Mock 数据集 | 原项目 frontend/src/mock/ | 测试数据工厂 + 数据库种子 | ⬜ 待迁移（Phase 5-6） |
| i18n 翻译文件 | 原项目 frontend/src/locales/ | 直接复用，由 MCP 工具增量维护 | ⬜ 待迁移（Phase 5） |
| cross-module-erd.md | 原项目 docs/ | 跨模块 ER 图基础 | ⬜ 待导入（Phase 3） |
| userStoryMapping.ts | 各模块目录 | 需求追溯 MCP 工具的数据源 | ⬜ 待迁移（Phase 5） |

## 原项目仓库

- **Git URL**: https://github.com/kimcuong1037-design/gas-station-software.git
- **本地克隆**: /tmp/gas-station-software（临时，按需重新克隆）
