# Workspace 工作台模块

## 1. 模块职责

应用主容器，管理全局视图路由（home/chat/mcp-center/billing/agent 等）、多模型对话流程、导航面板和全局弹窗。

## 2. 目录结构

```
components/workspace/
├── workspace.tsx                 # 主容器（1424行）
├── workspace-content.tsx         # 工作区内容
├── header.tsx                    # 顶部导航栏
├── nav-panel.tsx                 # 左侧导航面板
├── sidebar.tsx                   # 侧边栏面板（旧版）
├── session-toolbar.tsx           # 会话工具栏
├── home-content.tsx              # 首页主内容
├── home-input-area.tsx           # 首页输入区
├── input-area.tsx                # 对话页输入区
├── model-card.tsx                # 模型卡片
├── model-list-row.tsx            # 模型分类行
├── model-search-dialog.tsx       # 模型搜索弹窗
├── model-mention-popover.tsx     # @提及模型选择器
├── model-param-popover.tsx       # 模型参数设置
├── model-response-card.tsx       # 模型回复卡片
├── chat-history-item.tsx         # 对话历史列表项
├── history-drawer.tsx            # 对话历史详情抽屉
├── search-results-drawer.tsx     # 搜索结果来源抽屉
├── thinking-process.tsx          # 思考过程展示
├── attachment-preview.tsx        # 附件预览
├── user-profile-popover.tsx      # 用户信息弹出面板
├── new-user-benefit-toast.tsx    # 新用户福利提示
├── mcp-center.tsx                # MCP 服务中心
├── mcp-service-card.tsx          # MCP 服务卡片
├── mcp-service-list.tsx          # MCP 服务市场列表
├── mcp-service-selector.tsx      # MCP 服务选择器
├── mcp-service-detail-modal.tsx  # MCP 服务详情弹窗
├── mcp-quick-config-modal.tsx    # MCP 快速配置弹窗
├── mcp-quick-create-modal.tsx    # MCP 快速创建弹窗
├── mcp-message-view.tsx          # MCP 消息视图
├── mcp-tool-result.tsx           # MCP 工具调用结果面板
├── billing-usage.tsx             # 消费记录页面
├── billing-payments.tsx          # 支付记录页面
├── invite-dialog.tsx             # 邀请弹窗（原版）
├── invite-dialog-refactor.tsx    # 邀请弹窗（重构版）
├── invite-dialog-demo.tsx        # 邀请弹窗演示页
├── agent-home-view.tsx           # 智能体主页视图
├── agent-detail-view.tsx         # 智能体详情视图（空占位）
└── agent-result-detail-view.tsx  # 智能体结果详情视图
```

## 3. 文件说明

| 文件 | 职责 |
|------|------|
| `workspace.tsx` | 顶层布局，管理 viewMode 路由切换、多模型对话、对话 CRUD、移动端适配 |
| `workspace-content.tsx` | 渲染当前视图内容（模型详情/欢迎页/聊天消息） |
| `header.tsx` | 顶部栏，头像下拉菜单（消费/支付记录、MCP 中心、退出登录） |
| `nav-panel.tsx` | 左侧导航，对话历史列表、新建对话、模型/智能体标签切换 |
| `sidebar.tsx` | 旧版侧边栏，模型搜索/筛选和智能体列表 |
| `session-toolbar.tsx` | 浮动工具栏，新建对话/打开历史记录 |
| `home-content.tsx` | 首页主体，推荐模型行 + 搜索弹窗入口 + 输入区 |
| `home-input-area.tsx` | 首页输入，@模型提及、MCP 选择、附件上传、联网/深度思考开关 |
| `input-area.tsx` | 对话页输入，文件上传、@提及、MCP 选择器、附件预览 |
| `model-card.tsx` | 模型卡片，logo/名称/提供商/类型标签，支持选中高亮 |
| `model-list-row.tsx` | 模型分类行，带左右箭头导航的水平滚动卡片列表 |
| `model-search-dialog.tsx` | 模型搜索弹窗，分类标签 + 关键词搜索 |
| `model-mention-popover.tsx` | @提及选择器，按类型分组，多选上限 4 个 |
| `model-param-popover.tsx` | 图片/视频参数设置 Popover，含默认值常量 |
| `model-response-card.tsx` | AI 回复卡片，搜索/深度思考 Badge、重新生成、消耗智点 |
| `chat-history-item.tsx` | 历史列表项，内联重命名和删除 |
| `history-drawer.tsx` | 对话历史抽屉，按模型分组展示聊天记录 |
| `search-results-drawer.tsx` | 搜索结果来源 Sheet，展示引用 URL 列表 |
| `thinking-process.tsx` | 思考过程折叠面板，Brain 图标 + 首行预览 |
| `attachment-preview.tsx` | 上传文件列表预览，缩略图/图标/格式标签/删除 |
| `user-profile-popover.tsx` | 用户弹出面板，头像/用户名/智点余额/导航菜单 |
| `new-user-benefit-toast.tsx` | 新用户福利 Toast，2 秒自动消失 |
| `mcp-center.tsx` | MCP 中心主页，"我的 MCP"+"MCP 市场"双标签 |
| `mcp-service-card.tsx` | 服务卡片，名称/图标/类型/状态 Badge |
| `mcp-service-list.tsx` | 市场列表，搜索过滤 + 点击拉详情 |
| `mcp-service-selector.tsx` | 多选 Popover，已添加的 MCP 服务 + 总开关 |
| `mcp-service-detail-modal.tsx` | 服务详情弹窗，提供"添加服务"入口 |
| `mcp-quick-config-modal.tsx` | 快速配置弹窗，填写 API Key 添加服务 |
| `mcp-quick-create-modal.tsx` | 快速创建弹窗，名称/描述/类型/API 地址/请求方式 |
| `mcp-message-view.tsx` | MCP 消息视图，工具调用结果 + Markdown 回复 |
| `mcp-tool-result.tsx` | 工具调用结果折叠面板，名称/状态/返回数据 |
| `billing-usage.tsx` | 消费记录，日期/模型/类型/点数表 + 筛选 + 导出 |
| `billing-payments.tsx` | 支付记录，充值明细 + 支付方式 Badge |
| `invite-dialog.tsx` | 邀请弹窗（原版），10 条链接列表 |
| `invite-dialog-refactor.tsx` | 邀请弹窗（重构版），单条链接 + 奖励说明 + 好友状态 |
| `invite-dialog-demo.tsx` | 邀请弹窗演示页 |
| `agent-home-view.tsx` | 智能体分类卡片网格，搜索和导航 |
| `agent-detail-view.tsx` | 空占位文件 |
| `agent-result-detail-view.tsx` | 智能体执行结果详情展示 |

## 4. 对外提供的能力

| 类别 | 导出名称 |
|------|----------|
| 容器 | `Workspace`, `WorkspaceContent` |
| 导航 | `Header`, `NavPanel`, `Sidebar`, `SessionToolbar` |
| 模型交互 | `ModelCard`, `ModelListRow`, `ModelSearchDialog`, `ModelMentionPopover`, `ModelParamPopover`, `ModelResponseCard` |
| 对话 | `ChatHistoryItem`, `HistoryDrawer`, `SearchResultsDrawer`, `ThinkingProcess` |
| 输入 | `HomeInputArea`, `InputArea`, `HomeContent` |
| 附件 | `AttachmentPreview`, `UploadedFile`（类型）, `buildUploadedFiles` |
| MCP | `MCPCenter`, `MCPServiceCard`, `MCPServiceList`, `MCPServiceSelector`, `MCPServiceDetailModal`, `MCPQuickConfigModal`, `MCPQuickCreateModal`, `MCPMessageView`, `MCPToolResultPanel` |
| 计费 | `BillingUsage`, `BillingPayments` |
| 邀请 | `InviteDialog`, `InviteDialogRefactor`, `InviteDialogDemo` |
| 用户 | `UserProfilePopover`, `NewUserBenefitToast` |
| 参数类型 | `ImageParams`, `VideoParams`, `ModelParams`, `DEFAULT_IMAGE_PARAMS`, `DEFAULT_VIDEO_PARAMS` |
| Agent 视图 | `AgentHomeView`, `AgentDetailView`, `AgentResultDetailView` |

## 5. 依赖关系

- **依赖**：`components/ui/`、`components/chat/`、`components/agent/`、`components/auth/`、`contexts/`、`hooks/`、`lib/`
- **被依赖**：`app/page.tsx`（根页面直接渲染 Workspace）

## 6. 开发约定

- **视图路由**：通过 `viewMode` 状态管理，类型为联合类型 `'home' | 'chat' | 'history-all' | 'model-detail' | 'billing-usage' | 'billing-payments' | 'mcp-center' | 'agent-home' | 'agent-detail' | 'result-detail'`
- **导出**：全部使用 named export，禁止 default export（唯一的例外是 `invite-dialog-demo.tsx`）
- **Mock 辅助**：`getMockResponse()` 和 `generateConversationMessages()` 仅供原型阶段使用，接入真实 API 后移除
- **MCP 子组件**：预计后续拆分为独立 `components/mcp/` 目录
- **移动端**：NavPanel 在移动端以滑出面板方式呈现

## 7. 已知问题

- `workspace.tsx` 1424 行，过长，后续应拆分为多个子 hook 或子组件
- `agent-detail-view.tsx` 为空占位文件
- `sidebar.tsx` 与 `nav-panel.tsx` 功能重叠，属于新旧两版并存
- `invite-dialog.tsx` 与 `invite-dialog-refactor.tsx` 两版并存，需确认最终版本
- MCP 相关组件仍混在 workspace 目录中，未独立成 `components/mcp/`
