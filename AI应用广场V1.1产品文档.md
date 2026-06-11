# AI应用广场 - 产品文档

> **版本：** V1.1  
> **更新日期：** 2026-06-10  
> **文档类型：** 产品 + 技术双轨文档  
> **目标读者：** 技术团队、产品设计团队

---

## 目录

- [Part 1 - 产品篇](#part-1---产品篇)
  - [1. 产品概述](#1-产品概述)
  - [2. 目标用户与场景](#2-目标用户与场景)
  - [3. 核心功能矩阵](#3-核心功能矩阵)
  - [4. 页面结构与信息架构](#4-页面结构与信息架构)
  - [5. 关键交互流程](#5-关键交互流程)
  - [6. V1.1 版本变更记录](#6-v11-版本变更记录)
- [Part 2 - 技术篇](#part-2---技术篇)
  - [1. 技术栈概览](#1-技术栈概览)
  - [2. 系统架构](#2-系统架构)
  - [3. 模块划分与职责](#3-模块划分与职责)
  - [4. 数据模型](#4-数据模型)
  - [5. 状态管理](#5-状态管理)
  - [6. 关键组件清单](#6-关键组件清单)
  - [7. 开发规范与扩展建议](#7-开发规范与扩展建议)

---

# Part 1 - 产品篇

## 1. 产品概述

### 1.1 产品定位

**AI应用广场**是一个**大模型聚合平台**，将多种 AI 能力（聊天对话、图片生成、视频生成）整合在一个统一的工作台中，让用户无需切换多个平台即可使用不同的 AI 模型。

### 1.2 核心价值主张

| 维度 | 价值描述 |
|------|----------|
| **一站式** | 聚合聊天、图片、视频等多种 AI 模型，统一入口 |
| **灵活扩展** | 支持 MCP（Model Context Protocol）服务接入，扩展模型能力 |
| **按需计费** | 按使用量计费（智点体系），支持在线充值 |
| **历史管理** | 支持多模型对话历史保存、搜索、重命名、删除 |

### 1.3 一句话描述

> "一个聚合多种 AI 大模型能力的一站式工作台，支持聊天、图片生成、视频生成，可通过 MCP 协议扩展服务，按智点计费。"

---

## 2. 目标用户与场景

### 2.1 用户画像

| 用户类型 | 特征 | 核心需求 |
|----------|------|----------|
| **AI 爱好者** | 个人用户，尝试不同模型 | 快速切换模型，对比效果 |
| **内容创作者** | 需要生成图片/视频素材 | 高质量生成，参数精细控制 |
| **开发者** | 使用 AI 辅助编程 | 代码生成、技术问答 |
| **企业用户** | 团队协作使用 | MCP 服务定制、统一计费管理 |

### 2.2 核心使用场景

```
场景 1：多模型对比测试
用户想对比 DeepSeek 和 Claude 对同一个问题的回答 → 在侧边栏切换模型，历史对话自动隔离

场景 2：批量生成图片素材
用户需要为电商网站生成多张商品图 → 选择 GPT-Image-2，设置比例/数量/质量，批量生成

场景 3：视频内容创作
用户需要制作短视频 → 选择 Gemini 3 Flash，上传参考图/音频，设置时长和分辨率

场景 4：MCP 服务扩展
用户需要 whois 查询能力 → 在 MCP 市场添加 whois 服务，启用后在对话中调用
```

---

## 3. 核心功能矩阵

### 3.1 功能总览

| 功能域 | 功能项 | 说明 | 优先级 |
|--------|--------|------|--------|
| **模型对话** | 聊天对话 | 支持多轮文本对话，Markdown/Code 渲染 | P0 |
| | 图片生成 | 文生图，支持比例/数量/质量/参考图 | P0 |
| | 视频生成 | 文生视频，支持时长/比例/分辨率/参考素材 | P0 |
| | 联网搜索 | 聊天模型可选启用实时网络搜索 | P1 |
| | 深度思考 | 聊天模型可选启用深度思考模式 | P1 |
| **模型管理** | 模型列表 | 侧边栏展示全部/聊天/图片/视频模型 | P0 |
| | 模型搜索 | 按名称/描述搜索模型 | P1 |
| | 模型分类 | 按 all/chat/image/video 筛选 | P0 |
| **MCP 服务** | MCP 选择器 | 工作台内快速启用/配置 MCP 服务 | P0 |
| | MCP 市场 | 浏览/添加平台提供的 MCP 服务 | P1 |
| | 我的 MCP | 管理已添加的 MCP 服务 | P1 |
| | MCP 配置 | 配置 APIKey、URL、请求头等参数 | P1 |
| **历史对话** | 历史列表 | 按模型隔离的历史对话记录 | P0 |
| | 历史搜索 | 搜索历史对话标题 | P1 |
| | 重命名/删除 | 管理历史对话 | P1 |
| **用户系统** | 手机登录 | 手机号+验证码登录 | P0 |
| | 余额管理 | 智点余额展示（1元=1000智点） | P0 |
| | 在线充值 | 支付宝/微信支付充值 | P0 |
| | 消费记录 | 查看每次调用的费用明细 | P1 |
| | 支付记录 | 查看充值历史 | P1 |

### 3.2 模型能力对照表

| 模型 | 类型 | 核心能力 | 特色参数 |
|------|------|----------|----------|
| DeepSeek V4 Pro | 聊天 | 多轮对话、代码生成、逻辑推理 | 联网搜索、深度思考 |
| MiniMax-M2.5 | 聊天 | 创意写作、情感理解 | 联网搜索、深度思考 |
| GLM-5-Turbo | 聊天 | 中文对话、知识问答 | 联网搜索、深度思考 |
| Claude Haiku 4.5 | 聊天 | 快速响应、安全对话 | 联网搜索、深度思考 |
| GPT-Image-2 | 图片 | 文生图、图像编辑 | 比例、数量、质量、优化提示词、参考图 |
| Qwen-Image-Max | 图片 | 中文场景理解、插画创作 | 比例、数量、质量、优化提示词、参考图 |
| Gemini 3 Flash | 视频 | 视频生成、多模态理解 | 时长、比例、分辨率、数量、模式、参考图/音频 |

---

## 4. 页面结构与信息架构

### 4.1 整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  Header (固定顶部)                                           │
│  ├─ Logo + 产品名称                                          │
│  ├─ 剩余智点 + 充值按钮                                       │
│  └─ 用户头像下拉菜单 (消费记录/支付记录/退出)                   │
├──────────┬──────────────────────────────────────────────────┤
│          │  SessionToolbar (浮动)                            │
│ Sidebar  │  ├─ 新建对话                                       │
│ (可折叠)  │  └─ 打开历史记录                                   │
│          │                                                  │
│ ┌──────┐ │  WorkspaceContent (内容区)                        │
│ │模型  │ │  ├─ 空状态：欢迎语 + 推荐提示词                     │
│ │列表  │ │  ├─ 对话中：消息列表 (文本/图片/视频)                │
│ │      │ │  └─ 模型卡片：能力标签 + 描述                       │
│ └──────┘ │                                                  │
│          │  InputArea (底部固定输入区)                         │
│          │  ├─ 模型参数栏 (聊天/图片/视频各不同)                │
│          │  ├─ 参考素材上传区                                  │
│          │  └─ 输入框 + 发送按钮                               │
└──────────┴──────────────────────────────────────────────────┘
```

### 4.2 页面路由/视图

| 视图 | 路径/触发方式 | 说明 |
|------|--------------|------|
| **工作台** | `/` (默认) | 主界面，包含侧边栏+内容区+输入区 |
| **消费记录** | Header → 消费记录 | 展示使用统计和明细列表 |
| **支付记录** | Header → 支付记录 | 展示充值历史 |
| **登录弹窗** | 未登录时触发操作 | 手机号+验证码登录 |
| **充值弹窗** | 点击充值按钮 | 选择金额，确认支付 |
| **历史记录抽屉** | 点击历史按钮 | 右侧滑出，展示当前模型的历史对话 |
| **MCP 配置弹窗** | MCP 选择器 → 配置 | 配置 MCP 服务的 APIKey 等参数 |

---

## 5. 关键交互流程

### 5.1 模型选择与对话流程

```
用户打开页面
    │
    ▼
侧边栏展示模型列表（默认全部）
    │
    ▼
用户点击模型卡片
    │
    ▼
WorkspaceContent 切换至该模型的欢迎页
    │
    ▼
用户输入提示词 / 点击推荐提示词
    │
    ▼
InputArea 根据模型类型展示对应参数栏
    │
    ▼
用户点击发送 → 检查登录状态
    │
    ├─ 未登录 → 弹出登录窗口
    └─ 已登录 → 发送消息
              │
              ▼
        展示用户消息 + AI 加载状态
              │
              ▼
        AI 回复（文本/Markdown/图片/视频）
              │
              ▼
        消息加入历史记录
```

### 5.2 MCP 服务配置与使用流程

```
用户在工作台点击 MCP 选择器
    │
    ▼
展示已添加的 MCP 服务列表
    │
    ▼
用户启用/禁用 MCP 总开关
    │
    ├─ 禁用 → 所有 MCP 服务不可选，隐藏数量显示
    └─ 启用 → 可勾选具体 MCP 服务
              │
              ▼
        用户勾选需要的 MCP 服务
              │
              ▼
        标题显示 "选择MCP服务（x）"
              │
              ▼
        点击 "MCP管理" → 跳转 MCP 服务页面
              │
              ▼
        在 MCP 市场浏览/搜索服务
              │
              ▼
        点击添加 → 弹出配置窗口
              │
              ▼
        按步骤配置 APIKey → 添加成功
              │
              ▼
        返回工作台，新 MCP 服务出现在选择器中
```

### 5.3 充值流程

```
用户点击 "充值" 按钮
    │
    ▼
弹出充值弹窗
    │
    ▼
选择充值金额（固定档位或自定义）
    │
    ▼
选择支付方式（支付宝/微信）
    │
    ▼
点击 "确认支付"
    │
    ▼
支付成功 → 余额更新 + Toast 提示
```

---

## 6. V1.1 版本变更记录

### 6.1 MCP 服务选择器优化

| 序号 | 变更项 | 说明 |
|------|--------|------|
| 1 | 移除 icon 和英文名称 | 选项仅显示服务名称，简化视觉 |
| 2 | "启用中" 提示 | 仅已勾选的 MCP 服务显示该标签 |
| 3 | 动态标题 | "选择MCP服务（x）"，x 为已选数量 |
| 4 | MCP 总开关 | 标题右侧 Switch，控制全局启用/关闭 |
| 5 | 禁用样式 | 停用时选项不可点击，opacity-50 + cursor-not-allowed |
| 6 | 选中样式 | 启用且有选择时边框高亮 + 背景色 |
| 7 | Toast 提示 | 启用/停用均显示全局提示 |
| 8 | 底部按钮 | "已选择x个服务" → "MCP管理"，点击跳转 MCP 服务页面 |

### 6.2 个人中心 - MCP 服务优化

| 序号 | 变更项 | 说明 |
|------|--------|------|
| 1 | 移除页面标题 | 更简洁的头部布局 |
| 2 | Tabs 居中 | 缩小宽度，居中显示 |
| 3 | 头部三栏布局 | 左侧"返回工作台" + 中间 Tabs + 右侧操作按钮 |
| 4 | 卡片三列布局 | 我的 MCP 和 MCP 市场均为一行 3 列 |
| 5 | 英文名称位置 | 从服务名称下方移到右侧 |
| 6 | 已添加 Badge | 使用 Badge 样式标识已添加状态 |
| 7 | 搜索功能 | 支持按名称/英文名/描述搜索 |
| 8 | 分页组件 | 中文显示（上一页/下一页） |
| 9 | Toast 反馈 | 添加/启用/停用/删除时全局提示 |
| 10 | 企业级定制入口 | 渐变背景按钮，跳转定制页面 |

### 6.3 快速配置 MCP 弹窗优化

| 序号 | 变更项 | 说明 |
|------|--------|------|
| 1 | 窗口标题 | 显示 "配置MCP服务" |
| 2 | APIKey 标题 | "API_KEY" → "APIKey" |
| 3 | Steps 组件 | 1行3列水平排列，步骤编号+标题+图片 |
| 4 | 可点击步骤 | Step1 访问官网可点击跳转 |
| 5 | 步骤截图 | 3 张 1:1 实际截图替换占位图 |
| 6 | 成功提示 | 添加成功显示 "xxx 已添加" |

### 6.4 其他优化

| 模块 | 变更项 | 说明 |
|------|--------|------|
| 编辑 MCP 弹窗 | 字段顺序调整 | 服务名称→英文名称→介绍→类型→URL→请求头→长运行模式→超时 |
| 数据模型 | 新增字段 | englishName、defaultUrl；状态简化为 enabled/disabled |
| Context | mcpEnabled | 新增全局 MCP 总开关状态 |
| 侧边栏 | 移除 MCP 列表 | 只保留大模型列表 |
| 导航栏 | 移除 MCP 计数 | 移除 "已配置MCP服务：x个" 组件 |
| 历史对话 | 时间格式 | 最近1条显示时分，其余显示完整时间 |
| 充值窗口 | 协议文本 | "支付成功即视为您同意《购买协议》"，移除复选框 |
| 全局 | Toast 组件 | layout.tsx 添加 Toaster（position="top-center"） |
| 分页 | 中文化 | "Previous"/"Next" → "上一页"/"下一页" |

---

# Part 2 - 技术篇

## 1. 技术栈概览

### 1.1 核心技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Next.js | 16.2.6 | React 全栈框架，App Router |
| **UI 库** | React | 19.x | 组件化 UI 开发 |
| **样式** | Tailwind CSS | 4.2.0 | 原子化 CSS |
| **组件库** | shadcn/ui | - | 基于 Radix UI 的无头组件 |
| **图标** | Lucide React | 0.564.0 | 图标库 |
| **字体** | Geist / Geist Mono | - | Google 字体 |
| **构建** | Turbopack | - | Next.js 默认打包工具 |
| **包管理** | pnpm | 11.3.0 | 包管理器 |

### 1.2 关键依赖

| 依赖 | 用途 |
|------|------|
| `@radix-ui/*` | 无头 UI 组件基础（Dialog、Dropdown、Tabs、Tooltip 等 20+ 组件） |
| `next-themes` | 主题切换（深色/浅色模式） |
| `recharts` | 数据可视化图表（计费统计） |
| `embla-carousel-react` | 轮播组件 |
| `react-hook-form` + `zod` | 表单处理与校验 |
| `date-fns` | 日期处理 |
| `tailwind-merge` + `clsx` | 类名合并工具 |
| `class-variance-authority` | 组件变体管理 |
| `@vercel/analytics` | Vercel 分析（生产环境） |

### 1.3 开发配置

```
TypeScript: 5.7.3
PostCSS: 8.5
Autoprefixer: 10.4.20
ESLint: 代码检查
```

---

## 2. 系统架构

### 2.1 组件层级图

```
RootLayout (app/layout.tsx)
│
├─ AuthProvider (contexts/auth-context.tsx)
│   │
│   └─ Workspace (components/workspace/workspace.tsx)  ← 核心容器
│       │
│       ├─ Header (components/workspace/header.tsx)
│       │
│       ├─ Sidebar (components/workspace/sidebar.tsx)
│       │   └─ ModelCard (components/workspace/model-card.tsx)
│       │
│       ├─ SessionToolbar (components/workspace/session-toolbar.tsx)
│       │
│       ├─ WorkspaceContent (components/workspace/workspace-content.tsx)
│       │   └─ ChatMessages (components/chat/chat-messages.tsx)
│       │       ├─ UserMessage (components/chat/user-message.tsx)
│       │       ├─ AIMessage (components/chat/ai-message.tsx)
│       │       ├─ StreamingMessage (components/chat/streaming-message.tsx)
│       │       └─ CodeBlock (components/chat/code-block.tsx)
│       │
│       ├─ InputArea (components/workspace/input-area.tsx)
│       │
│       ├─ HistoryDrawer (components/workspace/history-drawer.tsx)
│       │   └─ ChatHistoryItem (components/workspace/chat-history-item.tsx)
│       │
│       ├─ LoginModal (components/auth/login-modal.tsx)
│       │
│       ├─ RechargeModal (components/auth/recharge-modal.tsx)
│       │
│       ├─ BillingUsage (components/workspace/billing-usage.tsx)
│       │
│       └─ BillingPayments (components/workspace/billing-payments.tsx)
│
└─ Toaster (components/ui/sonner.tsx)  ← 全局 Toast
```

### 2.2 数据流向

```
用户操作
    │
    ▼
Workspace (状态中心)
    │
    ├─ 模型选择 ──→ Sidebar / WorkspaceContent / InputArea
    ├─ 消息状态 ──→ WorkspaceContent / ChatMessages
    ├─ 输入状态 ──→ InputArea
    ├─ 历史记录 ──→ HistoryDrawer
    ├─ 页面导航 ──→ Header / BillingUsage / BillingPayments
    └─ 登录状态 ──→ AuthContext → 所有组件
```

---

## 3. 模块划分与职责

### 3.1 模块总览

| 模块 | 目录 | 职责 |
|------|------|------|
| **Workspace** | `components/workspace/` | 核心工作区，状态管理中枢 |
| **Chat** | `components/chat/` | 消息展示、渲染、流式输出 |
| **Auth** | `components/auth/` | 登录、充值、认证相关 |
| **UI** | `components/ui/` | 基础 UI 组件库（shadcn/ui） |
| **Data** | `lib/` | Mock 数据、类型定义、工具函数 |
| **Context** | `contexts/` | React Context 状态管理 |

### 3.2 各模块详细职责

#### Workspace 模块

| 组件 | 职责 |
|------|------|
| `workspace.tsx` | 核心容器，管理所有全局状态（selectedModel、messages、currentPage 等） |
| `header.tsx` | 顶部导航，展示 Logo、智点余额、充值按钮、用户菜单 |
| `sidebar.tsx` | 左侧模型列表，支持分类筛选、搜索、折叠 |
| `workspace-content.tsx` | 内容区，根据状态展示欢迎页/对话列表/模型卡片 |
| `input-area.tsx` | 底部输入区，根据模型类型展示不同参数栏 |
| `session-toolbar.tsx` | 会话工具栏（新建对话、历史记录） |
| `history-drawer.tsx` | 历史对话抽屉，展示/搜索/管理历史 |
| `model-card.tsx` | 模型卡片组件 |
| `chat-history-item.tsx` | 历史对话条目 |
| `billing-usage.tsx` | 消费记录页面 |
| `billing-payments.tsx` | 支付记录页面 |

#### Chat 模块

| 组件 | 职责 |
|------|------|
| `chat-messages.tsx` | 消息列表容器，管理消息渲染和加载状态 |
| `user-message.tsx` | 用户消息渲染（文本/图片/视频参数） |
| `ai-message.tsx` | AI 消息渲染（文本/Markdown/图片/视频） |
| `streaming-message.tsx` | 流式消息渲染 |
| `markdown-content.tsx` | Markdown 内容渲染 |
| `code-block.tsx` | 代码块渲染，支持语法高亮 |
| `image-preview-dialog.tsx` | 图片预览弹窗 |
| `video-preview-dialog.tsx` | 视频预览弹窗 |
| `video-card.tsx` | 视频卡片组件 |

#### Auth 模块

| 组件 | 职责 |
|------|------|
| `login-modal.tsx` | 登录弹窗（手机号+验证码） |
| `recharge-modal.tsx` | 充值弹窗（金额选择+支付方式） |

#### UI 模块（shadcn/ui）

包含 40+ 基础组件：Button、Dialog、Dropdown、Tabs、Input、Select、Tooltip、Avatar、Badge、Card、ScrollArea、Sheet、Switch、Toast 等。

---

## 4. 数据模型

### 4.1 核心类型定义

```typescript
// lib/mock-data.ts

// 模型定义
interface Model {
  id: string           // 模型唯一标识
  name: string         // 模型名称
  type: 'chat' | 'image' | 'video'  // 模型类型
  description: string  // 模型描述
  logo: string         // 模型 Logo（emoji）
  addedAt: Date        // 添加时间
}

// 聊天消息
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  contentType: 'text' | 'markdown' | 'code'
  codeLanguage?: string
  timestamp: Date
  status?: 'sending' | 'success' | 'error'
}

// 历史对话
interface ChatHistory {
  id: string
  title: string
  modelId: string
  createdAt: Date
}

// 图片消息参数
interface ImageParams {
  ratio: 'auto' | '1:1' | '3:2' | '2:3' | '16:9' | '9:16'
  count: 1 | 2 | 4
  quality: 'auto' | 'high' | 'medium' | 'low'
  optimizePrompt: boolean
}

// 视频消息参数
interface VideoParams {
  duration: 5 | 10 | 15 | 30 | 60
  ratio: '1:1' | '9:16' | '16:9'
  resolution: '720p' | '1080p' | '2k' | '4k'
  count: 1 | 2
  mode: 'fast' | 'quality'
}
```

### 4.2 用户相关类型

```typescript
// contexts/auth-context.tsx

interface User {
  id: string
  phone: string
  balance: number      // 余额（元）
  avatar?: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (phone: string, code: string) => void
  logout: () => void
  updateBalance: (amount: number) => void
  setShowLoginModal: (show: boolean) => void
  showLoginModal: boolean
  setShowRechargeModal: (show: boolean) => void
  showRechargeModal: boolean
}
```

### 4.3 计费相关类型

```typescript
// lib/mock-billing-data.ts

interface UsageRecord {
  id: string
  conversationName: string
  modelName: string
  modelType: 'chat' | 'image' | 'video'
  status: 'success' | 'failed' | 'generating'
  inputTokens: number
  outputTokens: number
  cost: number
  startTime: string
  endTime: string
}

interface PaymentRecord {
  id: string
  orderNo: string
  amount: number
  payTime: string
  payMethod: 'alipay' | 'wechat'
}

interface UsageStats {
  totalCost: number
  totalCalls: number
  successCalls: number
  failedCalls: number
}
```

### 4.4 MCP 服务类型（V1.1 新增）

```typescript
// lib/mcp-data.ts (V1.1)

interface MCPService {
  id: string
  name: string
  englishName: string       // V1.1 新增
  description: string
  type: string
  url: string
  defaultUrl?: string       // V1.1 新增（平台服务默认URL）
  headers?: Record<string, string>
  longRunningMode?: boolean
  timeout?: number
  status: 'enabled' | 'disabled'  // V1.1 简化
}
```

---

## 5. 状态管理

### 5.1 状态分层

| 层级 | 状态 | 管理方式 | 说明 |
|------|------|----------|------|
| **全局状态** | 用户认证、登录/充值弹窗显隐 | AuthContext | 跨组件共享 |
| **模块状态** | MCP 总开关 | MCPContext (V1.1) | MCP 相关全局状态 |
| **页面状态** | 选中模型、消息列表、输入值、历史记录 | Workspace useState | 工作区内共享 |
| **组件状态** | 搜索词、折叠状态、参数值 | 各组件 useState | 组件内部管理 |

### 5.2 AuthContext 状态流

```
AuthProvider
    │
    ├─ isLoggedIn: boolean     ← 登录状态
    ├─ user: User | null       ← 用户信息（含余额）
    ├─ showLoginModal: boolean ← 登录弹窗显隐
    └─ showRechargeModal       ← 充值弹窗显隐
         │
         ▼
    所有子组件通过 useAuth() 访问
```

### 5.3 Workspace 核心状态

```typescript
// workspace.tsx

const [selectedModel, setSelectedModel] = useState<Model | null>(mockModels[0])
const [messages, setMessages] = useState<Message[]>(...)
const [inputValue, setInputValue] = useState('')
const [isLoading, setIsLoading] = useState(false)
const [currentPage, setCurrentPage] = useState<string | null>(null)
const [chatHistories, setChatHistories] = useState(mockChatHistories)
const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
```

---

## 6. 关键组件清单

### 6.1 组件目录结构

```
components/
├── workspace/          # 工作区模块
│   ├── workspace.tsx      # 核心容器
│   ├── header.tsx         # 顶部导航
│   ├── sidebar.tsx        # 侧边栏
│   ├── workspace-content.tsx  # 内容区
│   ├── input-area.tsx     # 输入区
│   ├── session-toolbar.tsx    # 会话工具栏
│   ├── history-drawer.tsx # 历史抽屉
│   ├── chat-history-item.tsx  # 历史条目
│   ├── model-card.tsx     # 模型卡片
│   ├── billing-usage.tsx  # 消费记录
│   └── billing-payments.tsx   # 支付记录
│
├── chat/               # 聊天模块
│   ├── chat-messages.tsx  # 消息列表
│   ├── user-message.tsx   # 用户消息
│   ├── ai-message.tsx     # AI 消息
│   ├── streaming-message.tsx  # 流式消息
│   ├── markdown-content.tsx   # Markdown 渲染
│   ├── code-block.tsx     # 代码块
│   ├── image-preview-dialog.tsx   # 图片预览
│   ├── video-preview-dialog.tsx   # 视频预览
│   └── video-card.tsx     # 视频卡片
│
├── auth/               # 认证模块
│   ├── login-modal.tsx    # 登录弹窗
│   └── recharge-modal.tsx # 充值弹窗
│
├── ui/                 # UI 组件库（shadcn/ui）
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── tabs.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── tooltip.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── scroll-area.tsx
│   ├── sheet.tsx
│   ├── switch.tsx
│   ├── sonner.tsx         # Toast
│   └── ... (40+ 组件)
│
└── theme-provider.tsx  # 主题提供者
```

### 6.2 关键组件接口

#### Sidebar Props

```typescript
interface SidebarProps {
  selectedModel: Model | null
  onSelectModel: (model: Model) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}
```

#### InputArea Props

```typescript
interface InputAreaProps {
  model: Model | null
  onSendMessage?: (message: string, params?: ImageParams | VideoParams, referenceAssets?: any) => void
  inputValue?: string
  onInputChange?: (value: string) => void
}
```

#### WorkspaceContent Props

```typescript
interface WorkspaceContentProps {
  model: Model | null
  messages: Message[]
  isLoading?: boolean
  onSelectPrompt: (prompt: string) => void
  insufficientPoints?: boolean
}
```

---

## 7. 开发规范与扩展建议

### 7.1 代码组织规范

| 规范 | 说明 |
|------|------|
| **目录结构** | 按功能模块划分（workspace/chat/auth/ui），而非按类型 |
| **组件命名** | PascalCase，与文件名一致 |
| **类型定义** | 统一放在 `lib/mock-data.ts` 或组件文件顶部 |
| **样式方案** | 优先使用 Tailwind CSS，复杂样式用 `cn()` 工具函数合并 |
| **图标** | 统一使用 `lucide-react`，按需导入 |
| **颜色变量** | 使用 CSS 变量（bg-background、text-foreground 等），支持主题切换 |

### 7.2 扩展建议

| 扩展方向 | 建议 |
|----------|------|
| **接入真实 API** | 当前为 Mock 数据，需替换为真实的大模型 API 调用 |
| **后端服务** | 需要用户认证、计费、历史记录持久化的后端服务 |
| **WebSocket** | 聊天对话需要 WebSocket 实现真正的流式输出 |
| **文件存储** | 图片/视频生成结果需要对象存储（OSS/S3） |
| **MCP 服务** | 当前为 UI 层面，需要真实的 MCP 协议实现 |
| **移动端适配** | 当前为桌面端优先，需补充移动端响应式布局 |
| **多语言** | 当前为中文，可扩展 i18n 支持 |

### 7.3 构建与部署

```bash
# 开发
pnpm dev          # 启动开发服务器（Turbopack）

# 构建
pnpm build        # 生产构建
pnpm start        # 启动生产服务器

# 代码检查
pnpm lint         # ESLint 检查
```

### 7.4 Next.js 配置

```javascript
// next.config.mjs
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,    // 构建时忽略 TS 错误
  },
  images: {
    unoptimized: true,          // 不使用 Next.js 图片优化
  },
  allowedDevOrigins: ['192.168.0.51', 'localhost'],
}
```

---

## 附录

### A. 相关文档

- [AI应用市场 V1.1 版本功能清单](./AI应用市场%20V1.1%20版本功能清单.md)
- [AI应用广场V1.1-PRD.docx](./AI应用广场V1.1-PRD.docx)

### B. 快速导航

| 想了解 | 查看章节 |
|--------|----------|
| 产品定位和价值 | [1. 产品概述](#1-产品概述) |
| 用户是谁 | [2. 目标用户与场景](#2-目标用户与场景) |
| 有哪些功能 | [3. 核心功能矩阵](#3-核心功能矩阵) |
| 页面怎么组织 | [4. 页面结构与信息架构](#4-页面结构与信息架构) |
| 用户怎么操作 | [5. 关键交互流程](#5-关键交互流程) |
| V1.1 改了什么 | [6. V1.1 版本变更记录](#6-v11-版本变更记录) |
| 用了什么技术 | [1. 技术栈概览](#1-技术栈概览) |
| 系统怎么架构 | [2. 系统架构](#2-系统架构) |
| 代码怎么组织 | [3. 模块划分与职责](#3-模块划分与职责) |
| 数据结构定义 | [4. 数据模型](#4-数据模型) |
| 状态怎么管理 | [5. 状态管理](#5-状态管理) |
| 组件清单 | [6. 关键组件清单](#6-关键组件清单) |
| 怎么扩展 | [7. 开发规范与扩展建议](#7-开发规范与扩展建议) |

---

> **文档维护说明：** 本文档随产品迭代更新，每次版本发布时需同步更新变更记录和相关章节。
