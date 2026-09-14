# Lib 工具库与 Mock 数据模块

## 1. 模块职责

提供全项目的 Mock 数据、TypeScript 类型定义和通用工具函数。当前阶段（V1.3 UI 原型）所有数据均来源于此模块。

## 2. 目录结构

```
lib/
├── mock-data.ts                 # 核心 Mock 数据 & 类型定义
├── mcp-data.ts                  # MCP 服务 Mock 数据 & 类型定义
├── mock-result-data.ts          # Agent 执行结果 Mock 数据
├── mock-billing-data.ts         # 计费相关 Mock 数据
└── utils.ts                     # 通用工具函数
```

## 3. 文件说明

| 文件 | 职责 |
|------|------|
| `mock-data.ts` | 核心数据层：模型（Model）、对话（Conversation/Message）、搜索结果、Agent（Agent/AgentScene/AgentParameter）、邀请记录、推荐提示词的类型定义和 Mock 数据集 |
| `mcp-data.ts` | MCP 数据层：MCPServiceType/Status/Category 等类型、平台 MCP 服务列表、用户 MCP 服务列表、Mock 消息、分类标签和图标工具函数 |
| `mock-result-data.ts` | Agent 结果类型（AgentResultDetail）及涵盖文本/音频/视频/图片/文件/分镜的 Mock 数据 |
| `mock-billing-data.ts` | 消费记录（UsageRecord）、支付记录（PaymentRecord）、消费统计（UsageStats）的类型和 Mock 数据 |
| `utils.ts` | `cn()` 函数，组合 `clsx` + `tailwind-merge` 合并 CSS 类名 |

## 4. 对外提供的能力

### mock-data.ts（31 个导出）

**类型**：`Model`, `Conversation`, `Message`, `SearchResult`, `InviteRecord`, `ChatHistory`, `ChatMessage`, `AgentCategory`, `AgentScene`, `AgentParameter`, `Agent`

**Mock 数据**：`mockModels`, `mockChatMessages`, `mockMCPMessages`, `mockChatHistories`, `modelCapabilities`, `recommendedPrompts`, `mockConversations`, `mockAgents`

**查询函数**：`getAgentsByCategory()`, `getAgentById()`

### mcp-data.ts（16 个导出）

**类型**：`MCPServiceType`, `MCPServiceStatus`, `MCPCategory`, `MCPServiceConfig`, `MCPAuthStatus`, `MCPService`, `PlatformMCPService`, `MCPToolCall`, `MCPToolResult`, `MCPThinkingProcess`, `MCPMessageContent`

**Mock 数据**：`platformMCPServices`, `mockUserMCPServices`, `mockMCPMessages`, `categories`

**工具**：`serviceTypeLabels`, `serviceTypeFullLabels`, `getServiceIcon()`

### mock-result-data.ts

`AgentResultDetail`, `mockResultDetails`, `mockResultList`

### mock-billing-data.ts

`UsageRecord`, `PaymentRecord`, `UsageStats`, `mockUsageStats`, `mockUsageRecords`, `mockPaymentRecords`, `modelNames`

### utils.ts

`cn()` — 等效于 `twMerge(clsx(...inputs))`

## 5. 依赖关系

- **依赖**：`clsx`、`tailwind-merge`
- **被依赖**：被所有业务模块广泛依赖（workspace、agent、chat、contexts 等）

## 6. 开发约定

- **Mock 数据集中管理**：所有 Mock 数据放在 `lib/` 下，按领域拆分文件（mock-data、mcp-data、mock-result-data、mock-billing-data）
- **类型与数据共存**：每个 mock 文件同时导出对应的 TypeScript 类型/接口和数据
- **cn() 唯一入口**：合并 CSS 类名必须使用 `cn()`，禁止直接调用 `clsx()` 或 `twMerge()`
- **导入路径**：使用 `@/lib/xxx` 别名导入

## 7. 已知问题

- `mock-data.ts` 导出过多（31 个），后续可考虑按 Model/Chat/Agent 拆分
- 类型和值混在同一文件，体量较大（mock-data.ts 行数较多）
- 接入真实 API 后，类型和 Mock 数据需整体迁移
