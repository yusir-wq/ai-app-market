# AI应用广场 - 设计系统规范（V1.3开发必须遵循）

> 本文档汇总了项目现有的设计规范、组件使用模式和样式约定。后续开发V1.3智能体功能时，必须严格遵循本规范，确保视觉一致性。

---

## 一、基础配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| UI框架 | shadcn/ui (new-york风格) | 基于Radix UI的无头组件 |
| CSS框架 | Tailwind CSS v4.2.0 | `@import 'tailwindcss'` 方式 |
| 动画库 | tw-animate-css | 用于组件动画 |
| 基础色 | neutral | 中性灰基底 |
| 图标库 | lucide-react v0.564.0 | 统一使用Lucide图标 |
| 字体 | Inter (正文) + JetBrains Mono (代码) | 已配置CSS变量 |

### 1.1 路径别名

```typescript
// tsconfig 中配置的路径别名
@/components    → components/
@/components/ui → components/ui/       // shadcn组件
@/lib           → lib/
@/lib/utils     → lib/utils.ts         // cn()工具
@/hooks         → hooks/
```

### 1.2 工具函数

```typescript
// 必须使用此函数合并Tailwind类名
import { cn } from '@/lib/utils'

// 使用方式
cn('base-class', condition && 'conditional-class', 'hover:bg-accent')
```

---

## 二、颜色系统（CSS Variables）

### 2.1 语义化颜色令牌

| 令牌 | 浅色值 | 深色值 | 用途 |
|------|--------|--------|------|
| `--background` | `#FFFFFF` | `#09090B` | 页面背景 |
| `--foreground` | `#09090B` | `#FAFAFA` | 主文字色 |
| `--primary` | `#575CE9` | `#7B7DF7` | 品牌主色（紫蓝） |
| `--primary-foreground` | `#FAFAFA` | `#09090B` | 主色上的文字 |
| `--secondary` | `#F7F8FB` | `#27272A` | 次要背景 |
| `--secondary-foreground` | `#18181B` | `#FAFAFA` | 次要文字 |
| `--muted` | `#F7F8FB` | `#27272A` | 静音背景 |
| `--muted-foreground` | `#71717A` | `#A1A1AA` | 辅助/描述文字 |
| `--accent` | `#F4F4F8` | `#27272A` | 强调背景（hover等） |
| `--accent-foreground` | `#18181B` | `#FAFAFA` | 强调文字 |
| `--destructive` | `#EF4444` | `#7F1D1D` | 错误/危险 |
| `--border` | `#E4E4E7` | `#27272A` | 边框 |
| `--input` | `#E4E4E7` | `#27272A` | 输入框边框 |
| `--ring` | `#575CE9` | `#7B7DF7` | 焦点环 |
| `--brand` | `#575CE9` | `#7B7DF7` | 品牌色别名 |

### 2.2 使用方式

```tsx
// ✅ 正确 - 使用语义化变量
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">

// ❌ 错误 - 硬编码颜色
<div className="bg-white text-black">
  <button className="bg-blue-500">
```

---

## 三、排版系统

### 3.1 字体

| 用途 | 字体栈 | CSS变量 |
|------|--------|---------|
| 正文/UI | Inter, system-ui, sans-serif | `--font-sans` |
| 代码/等宽 | JetBrains Mono, Fira Code, monospace | `--font-mono` |

### 3.2 字号层级

| 层级 | 尺寸 | Tailwind | 用途 |
|------|------|----------|------|
| 页面标题 | 2.25rem (36px) | `text-4xl` | 首页品牌标题 |
| 区域标题 | 1.875rem (30px) | `text-3xl` | 大区块标题 |
| 卡片标题 | 1.5rem (24px) | `text-2xl` | 卡片/弹窗标题 |
| 大正文 | 1.25rem (20px) | `text-xl` | 重要描述 |
| 正文 | 1rem (16px) | `text-base` | 标准正文 |
| 小正文 | 0.875rem (14px) | `text-sm` | 列表/卡片内容 |
| 辅助文字 | 0.75rem (12px) | `text-xs` | 标签/时间戳/注释 |

### 3.3 字体特征

```css
body {
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}
```

---

## 四、间距系统（8px Grid）

| 令牌 | 值 | Tailwind | 用途 |
|------|-----|----------|------|
| `--spacing-0_5` | 4px | `p-1` / `gap-1` | 极小间距 |
| `--spacing-1` | 8px | `p-2` / `gap-2` | 基础单位 |
| `--spacing-1_5` | 12px | `p-3` / `gap-3` | 卡片内边距 |
| `--spacing-2` | 16px | `p-4` / `gap-4` | 标准间距 |
| `--spacing-3` | 24px | `p-6` / `gap-6` | 区块间距 |
| `--spacing-4` | 32px | `p-8` / `gap-8` | 大区块 |
| `--spacing-5` | 40px | — | 特大区块 |
| `--spacing-6` | 48px | — | 页面级间距 |

**核心规则：所有间距必须是4px的倍数。**

---

## 五、圆角系统

| 令牌 | 值 | Tailwind | 用途 |
|------|-----|----------|------|
| `--radius-sm` | 0.375rem (6px) | `rounded-sm` | 小按钮/标签 |
| `--radius-md` | 0.5rem (8px) | `rounded-md` | 标准按钮/输入框 |
| `--radius-lg` | 0.75rem (12px) | `rounded-lg` | 卡片/弹窗 |
| `--radius-xl` | 1rem (16px) | `rounded-xl` | 大卡片/容器 |

---

## 六、阴影系统

| 令牌 | 值 | Tailwind | 用途 |
|------|-----|----------|------|
| `--shadow-xs` | 0 1px 2px rgb(0 0 0 / 0.05) | `shadow-xs` | 微阴影 |
| `--shadow-sm` | 0 1px 3px rgb(0 0 0 / 0.1) | `shadow-sm` | 卡片默认 |
| `--shadow-md` | 0 4px 6px rgb(0 0 0 / 0.1) | `shadow-md` | 悬浮面板 |
| `--shadow-lg` | 0 10px 15px rgb(0 0 0 / 0.1) | `shadow-lg` | 弹窗/抽屉 |
| `--shadow-xl` | 0 20px 25px rgb(0 0 0 / 0.1) | `shadow-xl` | 模态框 |

---

## 七、过渡动画

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--transition-fast` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | 快速反馈（hover等） |
| `--transition-base` | 200ms cubic-bezier(0.4, 0, 0.2, 1) | 标准过渡 |
| `--transition-slow` | 300ms cubic-bezier(0.4, 0, 0.2, 1) | 缓慢过渡（展开/收起） |

---

## 八、shadcn/ui 组件使用规范

### 8.1 Button（按钮）

```tsx
import { Button } from '@/components/ui/button'

// 变体
<Button variant="default">主要按钮</Button>        // 主色背景
<Button variant="secondary">次要按钮</Button>      // 灰色背景
<Button variant="outline">描边按钮</Button>        // 边框样式
<Button variant="ghost">幽灵按钮</Button>          // 无背景hover
<Button variant="destructive">危险按钮</Button>    // 红色
<Button variant="link">链接样式</Button>           // 文字链接

// 尺寸
<Button size="default">默认</Button>   // h-10
<Button size="sm">小</Button>          // h-9
<Button size="lg">大</Button>          // h-11
<Button size="icon">图标</Button>      // size-10

// 禁用
<Button disabled>禁用</Button>
```

### 8.2 Card（卡片）

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述文字</CardDescription>
  </CardHeader>
  <CardContent>内容区</CardContent>
  <CardFooter>底部操作</CardFooter>
</Card>
```

### 8.3 Badge（标签）

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="outline">描边</Badge>
<Badge variant="destructive">危险</Badge>
```

### 8.4 表单组件

```tsx
// 输入框
import { Input } from '@/components/ui/input'
<Input placeholder="请输入" />

// 文本域
import { Textarea } from '@/components/ui/textarea'
<Textarea placeholder="请输入内容" />

// 标签
import { Label } from '@/components/ui/label'
<Label htmlFor="email">邮箱</Label>

// 选择器
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 复选框
import { Checkbox } from '@/components/ui/checkbox'

// 单选
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// 开关
import { Switch } from '@/components/ui/switch'
```

### 8.5 弹窗/抽屉

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
```

### 8.6 反馈组件

```tsx
// Toast通知（已在layout.tsx全局配置）
import { toast } from 'sonner'
toast.success('操作成功')
toast.error('操作失败')

// 骨架屏
import { Skeleton } from '@/components/ui/skeleton'
<Skeleton className="h-4 w-[200px]" />
```

---

## 九、已有组件模式（供复用）

### 9.1 模型卡片模式（ModelCard / MCPServiceCard）

```tsx
// 统一卡片结构
div.p-3.rounded-lg.cursor-pointer.transition-colors.hover:bg-accent
  div.flex.items-start.gap-3
    div.w-10.h-10.rounded-lg.bg-muted.flex.items-center.justify-center  // 图标区
    div.flex-1.min-w-0
      div.flex.items-center.gap-2
        span.font-medium.text-sm.text-foreground.truncate               // 标题
        Badge                                                          // 状态标签
      p.text-xs.text-muted-foreground.line-clamp-1.mt-0.5              // 描述
```

### 9.2 首页布局模式

```
页面结构（来自home-content.tsx）：
- 顶部品牌区：Logo + 标题（居中）
- 推荐栏：横向排列的pill按钮
- 输入区：大输入框（max-w-3xl）
- 模型列表：分类标题 + 横向滚动卡片
```

### 9.3 表单校验模式

项目已安装：
- `react-hook-form` v7.54.1 — 表单状态管理
- `@hookform/resolvers` v3.9.1 — 校验resolver
- `zod` v3.24.1 — 校验schema

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().min(2, '名称至少需要2个字符'),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

---

## 十、V1.3智能体页面开发规范

### 10.1 智能体详情页统一结构

```tsx
// 必须遵循此结构，保持与现有页面风格一致
<div className="flex-1 flex flex-col items-center min-w-0 overflow-y-auto bg-background">
  <div className="flex flex-col items-center w-full max-w-[720px] mx-auto px-4 md:px-6 pt-6 pb-10">
    
    {/* 头部：返回 + 标题 */}
    <div className="w-full flex items-center gap-2 mb-6">
      <Button variant="ghost" size="icon">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-bold text-foreground">智能体名称</h1>
    </div>

    {/* 场景卡片区 */}
    <div className="w-full mb-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">🎯 适用场景</h2>
      <div className="grid grid-cols-3 gap-3">
        {/* 场景卡片 - 使用Card组件 */}
      </div>
    </div>

    {/* 上传/输入区 */}
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        {/* 拖拽上传或文本输入 */}
      </CardContent>
    </Card>

    {/* 参数设置区 */}
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        {/* 动态表单 */}
      </CardContent>
    </Card>

    {/* 操作按钮 */}
    <Button className="w-full" size="lg">
      <Play className="h-4 w-4 mr-2" />
      开始处理
    </Button>

    {/* 结果预览区 */}
    <Card className="w-full mt-6">
      <CardContent className="pt-6">
        {/* 结果展示 + 下载 */}
      </CardContent>
    </Card>
  </div>
</div>
```

### 10.2 Mock数据规范

```typescript
// 在 lib/mock-data.ts 中添加智能体类型
export interface Agent {
  id: string
  name: string
  category: 'video' | 'audio' | 'copywriting' | 'image'
  description: string
  icon: string        // Lucide图标名称或emoji
  scenes: {          // 应用场景
    icon: string
    title: string
    description: string
  }[]
  inputType: 'file' | 'text' | 'both'
  acceptedFiles?: string[]  // 如 ['.mp4', '.mov']
  parameters: AgentParameter[]
}

export interface AgentParameter {
  id: string
  type: 'select' | 'switch' | 'slider' | 'text'
  label: string
  defaultValue: any
  options?: { label: string; value: any }[]
}
```

### 10.3 表单校验规范

每个智能体的表单必须配置zod schema校验：

```typescript
const agentSchema = z.object({
  // 文件上传校验
  file: z.instanceof(File).optional()
    .refine(file => !file || file.size <= 100 * 1024 * 1024, '文件大小不能超过100MB'),
  
  // 文本输入校验
  text: z.string()
    .min(1, '请输入内容')
    .max(5000, '内容不能超过5000字'),
  
  // 参数校验
  language: z.enum(['zh', 'en', 'ja']),
  quality: z.enum(['low', 'medium', 'high']),
})
```

---

## 十一、禁止事项

| ❌ 禁止 | ✅ 正确替代 |
|--------|-----------|
| `text-[15px]` | `text-sm` (14px) 或 `text-base` (16px) |
| `gap-[18px]` | `gap-4` (16px) 或 `gap-6` (24px) |
| `rounded-[10px]` | `rounded-lg` (12px) |
| `p-[14px]` | `p-3` (12px) 或 `p-4` (16px) |
| `bg-white` | `bg-background` |
| `text-black` | `text-foreground` |
| 直接使用hex颜色 | 使用语义化CSS变量 |
| 自定义复杂动画 | 使用 `transition-base` 变量 |

---

## 十二、文件命名规范

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| 组件 | PascalCase | `AgentShell.tsx`, `VideoUploader.tsx` |
| 工具函数 | camelCase | `useAgentForm.ts`, `validateFile.ts` |
| 类型定义 | PascalCase + 后缀 | `agent-types.ts` |
| Mock数据 | kebab-case | `agent-mock-data.ts` |
| 样式文件 | 与组件同名 | `AgentShell.module.css` (尽量避免) |

---

> **重要提示：** 所有新增的智能体页面必须使用 `bg-background` 作为页面背景、`text-foreground` 作为文字色，不得硬编码颜色值。所有间距必须是4px倍数，圆角使用系统令牌。
