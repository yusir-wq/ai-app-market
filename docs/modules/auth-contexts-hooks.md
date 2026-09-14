# Auth + Contexts + Hooks 模块

## 1. 模块职责

- **Auth**：提供登录弹窗和充值弹窗两个 UI 组件
- **Contexts**：管理认证状态（AuthContext）和 MCP 服务状态（MCPContext）的全局上下文
- **Hooks**：响应式检测（useIsMobile）和 Toast 状态管理（useToast）

## 2. 目录结构

```
components/auth/
├── login-modal.tsx              # 登录弹窗
└── recharge-modal.tsx           # 充值弹窗

contexts/
├── auth-context.tsx             # 认证上下文
└── mcp-context.tsx              # MCP 服务上下文

hooks/
├── use-mobile.ts                # 响应式检测 Hook
└── use-toast.ts                 # Toast 状态管理 Hook
```

## 3. 文件说明

### Auth

| 文件 | 职责 |
|------|------|
| `login-modal.tsx` | 手机号 + 验证码登录弹窗，发送验证码倒计时，模拟登录成功 |
| `recharge-modal.tsx` | 智点充值弹窗，预设套餐 + 自定义金额，支付宝/微信支付选择 |

### Contexts

| 文件 | 职责 |
|------|------|
| `auth-context.tsx` | 认证上下文，管理 `isLoggedIn`、`user`（用户名/手机号）、`balance`，提供 `login()`、`logout()`、`updateBalance()` |
| `mcp-context.tsx` | MCP 上下文，管理用户 MCP 服务列表、选中服务列表、快速创建/配置弹窗开关 |

### Hooks

| 文件 | 职责 |
|------|------|
| `use-mobile.ts` | 通过 `matchMedia('(max-width: 767px)')` 判断是否移动端，返回 `isMobile` 布尔值 |
| `use-toast.ts` | Toast reducer（ADD/UPDATE/DISMISS/REMOVE），管理 toast 列表、限制数量、自动移除 |

## 4. 对外提供的能力

### Auth
| 导出名称 | 说明 |
|----------|------|
| `LoginModal` | 登录弹窗组件（受控：open + onOpenChange） |
| `RechargeModal` | 充值弹窗组件（受控：open + onOpenChange） |

### Contexts
| 导出名称 | 说明 |
|----------|------|
| `AuthProvider` | 认证上下文 Provider，包裹于 app/layout.tsx 根布局 |
| `useAuth` | 消费认证状态的 Hook，返回 `{ user, isLoggedIn, balance, login, logout, updateBalance }` |
| `MCPProvider` | MCP 上下文 Provider，包裹于 app/page.tsx 首页入口 |
| `useMCP` | 消费 MCP 状态的 Hook |

### Hooks
| 导出名称 | 说明 |
|----------|------|
| `useIsMobile` | 移动端检测 Hook |
| `useToast` / `toast` | Toast 管理 Hook 和 toast 函数 |

## 5. 依赖关系

### Auth
- **依赖**：`components/ui/`（Dialog、Button、Input、Label），`contexts/auth-context.tsx`
- **被依赖**：`components/workspace/workspace.tsx`

### Contexts
- **依赖**：`lib/mcp-data.ts`（MCPContext 引用类型定义和 mock 数据）
- **被依赖**：`app/layout.tsx`（AuthProvider）、`app/page.tsx`（MCPProvider）、所有需要认证/MCP 状态的组件

### Hooks
- **依赖**：无外部模块依赖（use-toast 依赖 React，use-mobile 依赖浏览器 API）
- **被依赖**：各业务组件

## 6. 开发约定

- **认证**：当前阶段仅为 UI Mock，`login()` 直接设置登录状态，无真实验证码发送
- **Provider 层级**：`AuthProvider` 在 layout.tsx（最外层），`MCPProvider` 在 page.tsx（次外层）
- **useAuth 消费**：通过 `const { isLoggedIn, user } = useAuth()` 方式获取
- **useMCP 消费**：通过 `const { userServices, selectedServices } = useMCP()` 方式获取

## 7. 已知问题

- `components/ui/use-mobile.tsx` 与 `hooks/use-mobile.ts` 疑似重复文件
- `components/ui/use-toast.ts` 与 `hooks/use-toast.ts` 疑似重复文件
- 认证无后端对接，`login()` 和 `logout()` 为纯前端模拟
- `RechargeModal` 无真正的支付集成
