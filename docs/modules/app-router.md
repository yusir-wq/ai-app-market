# App Router 路由层

## 1. 模块职责

Next.js App Router 页面入口层，负责全局布局（字体、Provider、元数据）、页面路由和全局样式定义。

## 2. 目录结构

```
app/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页入口
├── globals.css                   # 全局样式 & CSS 变量
├── agent/
│   ├── page.tsx                  # 智能体广场列表页
│   └── [id]/page.tsx             # 智能体详情页
└── design-system/
    └── page.tsx                  # 设计系统预览页

styles/
└── globals.css                   # 备用全局样式（与 app/globals.css 关系待确认）
```

## 3. 文件说明

| 文件 | 职责 |
|------|------|
| `app/layout.tsx` | 根布局，配置 Inter/JetBrains Mono 字体，设置元数据（zh-CN），挂载 AuthProvider 和 Toaster 通知容器 |
| `app/page.tsx` | 首页，用 MCPProvider 包裹并渲染 Workspace 主组件 |
| `app/globals.css` | 定义 shadcn/ui 语义化颜色令牌（亮/暗模式）、图表色板、侧栏令牌、品牌色、排版间距等全部 CSS 自定义属性 |
| `app/agent/page.tsx` | 智能体广场，分类筛选 + 关键词搜索 + 卡片网格展示，点击跳转详情 |
| `app/agent/[id]/page.tsx` | 动态路由详情，从 mockAgents 按 id 查询，渲染 AgentShell，未找到返回 404 |
| `app/design-system/page.tsx` | 设计系统文档页，交互式展示颜色/排版/间距/圆角/阴影/过渡/按钮/表单/智能体卡片模式等规范 |

## 4. 对外提供的能力

| 导出名称 | 说明 |
|----------|------|
| `RootLayout` | 默认导出，根布局组件 |
| `Home` | 默认导出，首页组件 |
| `AgentListPage` | 默认导出，智能体列表页 |
| `AgentDetailPage` | 默认导出，智能体详情页（async） |
| `DesignSystemPage` | 默认导出，设计系统页 |

## 5. 依赖关系

- **依赖**：
  - `app/layout.tsx` → `contexts/auth-context.tsx`、`components/ui/toaster.tsx`、`@vercel/analytics`
  - `app/page.tsx` → `contexts/mcp-context.tsx`、`components/workspace/workspace.tsx`
  - `app/agent/page.tsx` → `lib/mock-data.ts`、`components/agent/agent-scene-cards.tsx`、`components/ui/`
  - `app/agent/[id]/page.tsx` → `lib/mock-data.ts`、`components/agent/agent-shell.tsx`
  - `app/design-system/page.tsx` → `components/ui/`
- **被依赖**：Next.js 框架自动路由（无组件引用）

## 6. 开发约定

- **页面组件使用 default export**：Next.js App Router 约定，非 layout 页面必须 default export
- **服务端组件优先**：`.tsx` 文件默认是 Server Component，仅在需要交互时添加 `'use client'` 指令
- **元数据**：通过 `metadata` 导出静态配置（如 title、description）
- **路径**：遵循 Next.js 文件系统路由，动态路由用 `[id]` 目录命名
- **CSS**：`app/globals.css` 为主文件，`styles/globals.css` 为备用（关系待确认）

## 7. 已知问题

- `styles/globals.css` 与 `app/globals.css` 两个全局样式文件并存，关系不明确，可能存在冗余
- `app/agent/[id]/page.tsx` 为 async Server Component，但 `mock-data.ts` 的 `getAgentById()` 为同步函数
