# 技术选型

> 所有技术选型已于 2026-03-04 确认。

---

## 已确认的技术栈

| 层级 | 技术 | 选定理由 |
|------|------|----------|
| **后端框架** | Node.js + Fastify | TypeScript 全栈，前后端类型共享；Fastify 性能优于 Express |
| **数据库** | PostgreSQL | 关系模型适合结构化业务数据；原框架架构文档已按 PG 设计 |
| **ORM** | Prisma | Schema 驱动 + 类型安全 + 版本化迁移机制，支持未来数据结构局部调整 |
| **前端状态管理** | Zustand | 轻量、TypeScript 友好、学习曲线低、团队易上手 |
| **测试框架** | Vitest | 与 Vite 生态一致、执行速度快、兼容 Jest API |

## 继承的技术栈（来自原项目）

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端框架** | React | 19.x |
| **语言** | TypeScript | 5.9.x |
| **构建工具** | Vite | 7.x |
| **UI 组件库** | Ant Design | 6.x |
| **图表** | ECharts | 6.x |
| **国际化** | i18next + react-i18next | 25.x / 16.x |
| **日期处理** | dayjs | 1.x |
| **路由** | React Router DOM | 7.x |

## Agent 工具链

| 工具 | 版本 | 用途 |
|------|------|------|
| **Claude Agent SDK** | ^0.2.63 | Agent 编排、工具定义、会话管理 |
| **Anthropic SDK** | ^0.78.0 | Skills API、模型调用 |
| **Zod** | ^4.0.0 | MCP 工具参数校验 |

## 部署环境

| 项目 | 选择 | 备注 |
|------|------|------|
| **目标环境** | 云服务为主 | 预留私有化部署的可能性 |
| **容器化** | Docker + docker-compose | 不做 K8s，保持简单 |
| **CI/CD** | GitHub Actions | lint → test → build → deploy |
| **配置管理** | 环境变量 | 通过 .env 文件 + docker-compose 注入 |
