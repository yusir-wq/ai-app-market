# AI应用广场 V1.2 ↔ Poe.com UI 对比与修改方案

## 实测数据

通过 Playwright 对 localhost:3000 进行运行时 CSS 分析得到：

| 元素 | 当前值 | Poe.com 对标值 |
|------|--------|----------------|
| 侧边栏背景 | `#F7F8FB` (浅灰) | `#16161a` (始终暗色) |
| 侧边栏文字 | `#09090B` (深黑) | `#e4e4e7` (浅灰白) |
| 主体内容背景 | `#FFFFFF` | `#FFFFFF` |
| 品牌主色 | `#575CE9` (靛蓝) | 绿色系 (各自保留) |
| 输入框背景 | `#F7F8FB` | 浅灰/白 |
| 输入框圆角 | `12px` (rounded-lg) | 12-16px |
| 按钮圆角 | `8px` (rounded-md) | 8px |
| 发送按钮圆角 | `rounded-full` (极大值) | 8px |
| 字体 | Inter | 系统默认 |

**核心差异：Poe 的侧边栏始终为暗色 → 形成强烈的 "暗导航 + 亮内容" 视觉层次**

---

## 修改方案（按文件中具体改动列出）

### 改动 1：`app/globals.css` — 侧边栏常驻暗色

**当前代码（第 36-44 行）：**
```css
--sidebar: #F7F8FB;
--sidebar-foreground: #09090B;
--sidebar-accent: #F4F4F8;
--sidebar-accent-foreground: #09090B;
--sidebar-border: #E4E4E7;
```

**改为：**
```css
--sidebar: #16161a;
--sidebar-foreground: #e4e4e7;
--sidebar-accent: #27272a;
--sidebar-accent-foreground: #fafafa;
--sidebar-border: #2a2a30;
```

**理由：** Poe 侧边栏始终暗色，无论主区亮/暗模式。修改亮色模式的 sidebar tokens 为暗色值，暗色模式保持不变（`#18181B` 同样生效）。

---

### 改动 2：`components/workspace/nav-panel.tsx` — 适配暗色侧边栏

**第 240 行** — 品牌标题 logo 容器：
```tsx
// 当前
<div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
// 改为（暗色背景下品牌色更醒目）
<div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
// 保持不变即可，品牌色在暗色背景上效果更好
```

**第 244 行** — App 名称：
```tsx
// 当前
<h1 className="font-semibold text-sm text-sidebar-foreground flex-1">AI应用广场</h1>
// 已自动适配，因为 text-sidebar-foreground 跟随 sidebar token 变化
```

**第 259 行** — "新建对话" 按钮：
```tsx
// 当前
className="w-full gap-2"
// 改为（暗色背景上品牌按钮更醒目，增加圆角）
className="w-full gap-2 rounded-xl"
```

**第 269-274 行** — "搜索对话" 按钮：
```tsx
// 当前
variant="outline"
className="w-full justify-start gap-2 text-muted-foreground hover:text-sidebar-foreground border-sidebar-border"
// 改为（暗色侧边栏中 out-of-place 样式适配）
variant="ghost"
className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
```

**第 283 行** — "最近对话" 标签：
```tsx
// 当前
<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
// 改为
<p className="text-[11px] font-medium text-sidebar-foreground/50 uppercase tracking-wider">
```

**第 298 行** — 对话列表项图标背景：
```tsx
// 当前
<div className="w-7 h-7 rounded-lg bg-background border border-border flex...">
// 改为（暗色侧边栏中图标容器适配）
<div className="w-7 h-7 rounded-lg bg-sidebar-accent border border-sidebar-border flex...">
```

**第 386-394 行** — "查看全部" 按钮：
```tsx
// text-muted-foreground → text-sidebar-foreground/50
className="w-full justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground"
```

---

### 改动 3：`components/workspace/home-content.tsx` — 输入区优化

**第 69-74 行** — 标题 icon 容器适配暗色：
```tsx
// 当前
<div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
// 改为（暗色背景图标更醒目）
<div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sidebar flex items-center justify-center">
```

**第 77 行** — 输入框容器：
```tsx
// 当前
<div className="w-full rounded-lg border border-border shadow-sm p-4 mb-6 shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
// 改为（增大圆角、弱化边框）
<div className="w-full rounded-xl border border-border/60 shadow-xs p-4 mb-6 shrink-0 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all" style={{ backgroundColor: '#F7F8FB' }}>
```

**第 96-97 行** — 工具栏间距：
```tsx
// 当前
<div className="flex items-center gap-1">
// 改为
<div className="flex items-center gap-0.5">
```

**第 151-158 行** — 发送按钮：
```tsx
// 当前
<Button size="icon-sm" className="h-8 w-8 rounded-full" ...>
// 改为
<Button size="icon-sm" className="h-8 w-8 rounded-lg" ...>
```

**第 66 行** — 首页顶部间距：
```tsx
// 当前
pt-[150px] pb-[150px]
// 改为
pt-[80px] pb-[60px]
```

---

### 改动 4：`components/chat/user-message.tsx` — 用户气泡

需要先读取文件确认具体样式。改动方向：
- 背景色从 `bg-primary` 改为 `bg-sidebar`（深灰底白字，与暗色侧边栏呼应）
- 文字色改为 `text-sidebar-foreground`

---

### 改动 5：`components/workspace/model-response-card.tsx` — 模型响应卡片

需要先读取文件确认。改动方向：
- 边框从 `border-border` → `border-border/50`
- 卡片阴影从默认 → `shadow-xs`
- 卡片间 `gap-3` 统一

---

### 改动 6：全局样式 `app/globals.css` — 追加细滚动条

在文件末尾追加：
```css
/* Thin scrollbar (Poe-style) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: hsl(0 0% 80%);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(0 0% 65%);
}
.dark ::-webkit-scrollbar-thumb {
  background: hsl(0 0% 30%);
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: hsl(0 0% 45%);
}
```

---

## 不修改的内容

| 项目 | 原因 |
|------|------|
| 品牌主色 `#575CE9` | V1.2 品牌识别 |
| 多模型并行响应 | V1.2 核心差异化功能 |
| MCP 服务中心 | 差异化优势 |
| 对话历史逻辑 | 仅改视觉层 |
| 登录/认证流程 | 仅改视觉层 |
| 文案/语言（中文） | 保持不变 |
| 暗色模式切换 | 仅改亮色模式 sidebar token |

---

## 实施顺序

1. **改动 1**（`globals.css` sidebar tokens）→ 影响面最大，先改
2. **改动 2**（`nav-panel.tsx` 细节适配）→ 依赖改动 1
3. **改动 3**（`home-content.tsx` 输入区 + 首页间距）
4. **改动 6**（滚动条样式）
5. **改动 4 + 5**（消息气泡 + 响应卡片，需先读取文件确认）
6. 验证：亮/暗模式 + 移动端
