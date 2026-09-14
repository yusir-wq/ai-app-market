# Chat 聊天模块

## 1. 模块职责

提供聊天消息的渲染体系：用户消息气泡、AI 回复（Markdown/代码块/MCP 视图）、流式输出、图片/视频预览。

## 2. 目录结构

```
components/chat/
├── chat-messages.tsx           # 聊天消息列表容器
├── user-message.tsx            # 用户消息气泡
├── ai-message.tsx              # AI 回复消息气泡
├── streaming-message.tsx       # 流式输出模拟
├── markdown-content.tsx        # 轻量 Markdown 渲染器
├── code-block.tsx              # 代码块展示
├── image-preview-dialog.tsx    # 图片预览弹窗
├── video-card.tsx              # 视频卡片
└── video-preview-dialog.tsx    # 视频预览弹窗
```

## 3. 文件说明

| 文件 | 职责 |
|------|------|
| `chat-messages.tsx` | 消息列表容器，按角色渲染 UserMessage/AIMessage/StreamingMessage，支持图片/视频预览、MCP 消息视图 |
| `user-message.tsx` | 用户发送的单条消息气泡，支持复制文本内容和删除操作 |
| `ai-message.tsx` | AI 回复气泡，集成 MarkdownContent 渲染、CodeBlock 代码展示、MCPMessageView 折叠展示 |
| `streaming-message.tsx` | 模拟流式输出，逐字显示预设文本内容 |
| `markdown-content.tsx` | 自实现轻量 Markdown 渲染，支持标题、列表、加粗、链接、段落等基础语法 |
| `code-block.tsx` | 代码块组件，显示编程语言标签 + 一键复制按钮 |
| `image-preview-dialog.tsx` | 全屏图片预览弹窗，查看/下载/复制/重新生成操作 |
| `video-card.tsx` | 视频卡片内联展示，缩略图 + 时长 + 分辨率 + 播放/下载操作 |
| `video-preview-dialog.tsx` | 全屏视频预览弹窗，播放/暂停/全屏/下载/复制链接 |

## 4. 对外提供的能力

| 导出名称 | 说明 |
|----------|------|
| `ChatMessages` | 默认导出，消息列表容器 |
| `UserMessage` | 用户消息气泡 |
| `AIMessage` | AI 回复消息气泡 |
| `StreamingMessage` | 流式输出 |
| `MarkdownContent` | Markdown 渲染器 |
| `CodeBlock` | 代码块 |
| `ImagePreviewDialog` | 图片预览弹窗 |
| `VideoCard` | 视频卡片 |
| `VideoPreviewDialog` | 视频预览弹窗 |

## 5. 依赖关系

- **依赖**：`components/ui/`（Dialog、Button、Badge 等）、`components/workspace/mcp-message-view.tsx`（AIMessage 引用）、`lucide-react`
- **被依赖**：`components/workspace/workspace.tsx`、`components/workspace/workspace-content.tsx`

## 6. 开发约定

- **ChatMessages 为唯一入口**：其他模块不直接组合 UserMessage/AIMessage，通过 ChatMessages 容器统一渲染
- **Markdown 渲染**：当前为自实现轻量渲染器（`MarkdownContent`），不引入第三方 Markdown 库
- **流式模拟**：`StreamingMessage` 仅用于原型演示，接入真实 SSE 后将替换
- **视频/图片未真实生成**：`VideoCard`、`VideoPreviewDialog` 等展示占位内容或 mock 数据

## 7. 已知问题

- `MarkdownContent` 仅支持基础语法（h1-h3、列表、加粗、链接、段落），不支持表格、图片、代码高亮等
- `StreamingMessage` 为 setTimeout 模拟，不是真实流式 API
- `AIMessage` 跨目录引用 `components/workspace/mcp-message-view.tsx`，耦合度较高
