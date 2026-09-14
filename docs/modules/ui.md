# UI 基础组件模块

## 1. 模块职责

基于 shadcn/ui（new-york 风格）+ Radix UI 的通用 UI 组件库，提供 50+ 个无业务逻辑的基础组件。

## 2. 目录结构

```
components/ui/
├── 布局（5个）
│   ├── aspect-ratio.tsx      ├── card.tsx
│   ├── resizable.tsx         ├── scroll-area.tsx
│   └── separator.tsx
│
├── 表单（16个）
│   ├── button.tsx            ├── button-group.tsx
│   ├── input.tsx             ├── input-group.tsx
│   ├── input-otp.tsx         ├── textarea.tsx
│   ├── checkbox.tsx          ├── radio-group.tsx
│   ├── switch.tsx            ├── slider.tsx
│   ├── select.tsx            ├── label.tsx
│   ├── field.tsx             ├── form.tsx
│   ├── toggle.tsx            └── toggle-group.tsx
│
├── 浮层（9个）
│   ├── dialog.tsx            ├── alert-dialog.tsx
│   ├── drawer.tsx            ├── sheet.tsx
│   ├── popover.tsx           ├── hover-card.tsx
│   ├── tooltip.tsx           ├── dropdown-menu.tsx
│   └── context-menu.tsx
│
├── 导航（5个）
│   ├── breadcrumb.tsx        ├── command.tsx
│   ├── navigation-menu.tsx   ├── menubar.tsx
│   └── pagination.tsx
│
├── 数据展示（11个）
│   ├── avatar.tsx            ├── badge.tsx
│   ├── table.tsx             ├── carousel.tsx
│   ├── accordion.tsx         ├── collapsible.tsx
│   ├── tabs.tsx              ├── calendar.tsx
│   ├── chart.tsx             ├── progress.tsx
│   └── skeleton.tsx
│
├── 反馈（5个）
│   ├── alert.tsx             ├── toast.tsx
│   ├── toaster.tsx           ├── sonner.tsx
│   └── spinner.tsx
│
├── 通用（4个）
│   ├── sidebar.tsx           ├── kbd.tsx
│   ├── empty.tsx             └── item.tsx
│
└── Hooks（2个）
    ├── use-mobile.tsx
    └── use-toast.ts
```

## 3. 文件说明（按类别分组）

### 布局
| 文件 | 职责 |
|------|------|
| `aspect-ratio.tsx` | 固定宽高比容器 |
| `card.tsx` | 卡片容器（CardHeader/CardContent/CardFooter） |
| `resizable.tsx` | 可拖拽调整大小的面板组 |
| `scroll-area.tsx` | 自定义滚动条区域 |
| `separator.tsx` | 水平/垂直分割线 |

### 表单
| 文件 | 职责 |
|------|------|
| `button.tsx` | 按钮（variant/size/loading） |
| `button-group.tsx` | 按钮组容器 |
| `input.tsx` | 文本输入框 |
| `input-group.tsx` | 输入框组（前缀/后缀/文字） |
| `input-otp.tsx` | OTP 一次性验证码输入 |
| `textarea.tsx` | 多行文本输入 |
| `checkbox.tsx` | 复选框 |
| `radio-group.tsx` | 单选按钮组 |
| `switch.tsx` | 开关切换 |
| `slider.tsx` | 滑块选择器 |
| `select.tsx` | 下拉选择器 |
| `label.tsx` | 表单标签 |
| `field.tsx` | 表单控件字段容器 |
| `form.tsx` | react-hook-form + zod 集成表单 |
| `toggle.tsx` | 切换按钮 |
| `toggle-group.tsx` | 切换按钮组 |

### 浮层
| 文件 | 职责 |
|------|------|
| `dialog.tsx` | 模态对话框 |
| `alert-dialog.tsx` | 确认对话框 |
| `drawer.tsx` | 侧滑抽屉（底部方向） |
| `sheet.tsx` | 侧滑面板（四方向） |
| `popover.tsx` | 弹出气泡 |
| `hover-card.tsx` | 悬停卡片 |
| `tooltip.tsx` | 工具提示 |
| `dropdown-menu.tsx` | 下拉菜单 |
| `context-menu.tsx` | 右键菜单 |

### 导航
| 文件 | 职责 |
|------|------|
| `breadcrumb.tsx` | 面包屑导航 |
| `command.tsx` | 命令面板（搜索式菜单） |
| `navigation-menu.tsx` | 导航菜单 |
| `menubar.tsx` | 菜单栏 |
| `pagination.tsx` | 分页器 |

### 数据展示
| 文件 | 职责 |
|------|------|
| `avatar.tsx` | 头像（图片/文字/fallback） |
| `badge.tsx` | 徽章标签 |
| `table.tsx` | 数据表格 |
| `carousel.tsx` | 轮播 |
| `accordion.tsx` | 手风琴折叠面板 |
| `collapsible.tsx` | 基础折叠容器 |
| `tabs.tsx` | 标签页切换 |
| `calendar.tsx` | 日历选择器 |
| `chart.tsx` | recharts 图表包装器 |
| `progress.tsx` | 进度条 |
| `skeleton.tsx` | 骨架屏加载占位 |

### 反馈
| 文件 | 职责 |
|------|------|
| `alert.tsx` | 提示条（info/success/warning/error） |
| `toast.tsx` | Toast 单个通知组件 |
| `toaster.tsx` | Toast 通知容器 |
| `sonner.tsx` | Sonner toast 库封装 |
| `spinner.tsx` | 加载旋转动画 |

### 通用 / Hooks
| 文件 | 职责 |
|------|------|
| `sidebar.tsx` | shadcn 侧边栏（配合全局 CSS 令牌） |
| `kbd.tsx` | 键盘快捷键提示 |
| `empty.tsx` | 空状态占位 |
| `item.tsx` | 通用列表项（Select/Menu 的构建块） |
| `use-mobile.tsx` | 响应式检测 Hook（isMobile） |
| `use-toast.ts` | Toast 状态管理 Hook（reducer-based） |

## 4. 对外提供的能力

每文件导出同名 React 组件 + 相关子组件或类型。如 `button.tsx` 导出 `Button` + `buttonVariants`，`dialog.tsx` 导出 `Dialog` + `DialogTrigger` + `DialogContent` + `DialogHeader` + `DialogTitle` 等。

全部通过 `@/components/ui/xxx` 路径导入。

## 5. 依赖关系

- **依赖**：`radix-ui/*` 系列、`tailwind-merge`、`clsx`、`recharts`（chart.tsx）、`react-hook-form` + `zod`（form.tsx）、`sonner`（sonner.tsx）、`embla-carousel-react`（carousel.tsx）
- **被依赖**：被所有业务组件（workspace/agent/chat/auth）广泛依赖

## 6. 开发约定

- **生成方式**：新 UI 组件通过 `npx shadcn@latest add <name>` 添加，禁止手动从零编写
- **风格**：统一使用 new-york 风格（components.json 已配置）
- **颜色**：禁止硬编码，必须使用 CSS 变量令牌（`--primary`、`--background` 等）
- **导入路径**：从 `@/components/ui/<name>` 导入
- **样式覆盖**：通过 Tailwind className 传递，不直接修改组件源码

## 7. 已知问题

- `use-mobile.tsx` 和 `use-toast.ts` 属于 Hook，不应放在 ui 目录，后续移至 `hooks/`
- `sidebar.tsx` 依赖全局 CSS 令牌较多，迁移 shadcn 版本时需同步更新
