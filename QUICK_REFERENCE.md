# 快速参考指南

## 📍 主要页面URL

| 页面 | URL | 说明 |
|------|-----|------|
| 工作台 | `/` | AI模型聚合工作台 |
| 个人中心 | `/profile` | 用户数据管理中心 |
| 我的作品 | `/profile` | 作品展示（默认Tab） |
| 消费记录 | `/profile` | 消费流水 |
| 支付记录 | `/profile` | 充值记录 |

---

## 🎯 关键交互

### 工作台工作流

```
1. 左侧栏选择模型
   ↓
2. 顶部工具栏操作
   ├── 新建对话按钮 → 开启新对话
   └── 历史对话按钮 → 打开历史对话弹窗
      ↓
      选择历史对话项 → 加载对话
   ↓
3. 中间区域展示模型信息/对话内容
   ↓
4. 底部输入区发送消息
```

### 个人中心工作流

```
Header 用户区域 (点击头像) 
   ↓
进入 /profile
   ↓
左侧 Tabs 选择
   ├── 我的作品 → 网格展示作品
   ├── 消费记录 → 表格展示消费
   └── 支付记录 → 表格展示充值
```

---

## 🛠 核心组件

### 工作台组件

| 组件 | 文件 | 职责 |
|------|------|------|
| Workspace | workspace.tsx | 主容器，状态管理 |
| Header | header.tsx | 顶部导航，用户菜单 |
| Sidebar | sidebar.tsx | 左侧模型浏览 |
| SessionToolbar | session-toolbar.tsx | 新建/历史对话按钮 |
| HistoryDrawer | history-drawer.tsx | 下拉弹窗对话列表 |
| WorkspaceContent | workspace-content.tsx | 内容展示区 |
| InputArea | input-area.tsx | 输入框 |

### 个人中心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| ProfilePage | profile-page.tsx | 布局和导航 |
| MyWorks | my-works.tsx | 作品网格 |
| ConsumptionRecords | consumption-records.tsx | 消费表格 |
| PaymentRecords | payment-records.tsx | 支付表格 |

---

## 📊 Mock 数据来源

所有 Mock 数据存储在 `lib/mock-data.ts` 中：

```typescript
// 模型数据
mockModels[] // 7个模型

// 对话历史
mockChatHistories{} // 按模型ID分组

// 模型能力标签
modelCapabilities{}

// 推荐Prompt
recommendedPrompts{}

// 个人中心数据（各组件内部定义）
mockWorks[] // 6个作品
mockRecords[] // 8条消费记录
mockPayments[] // 6条支付记录
```

---

## 🎨 样式约定

### 色彩使用

- `bg-background` - 页面背景
- `bg-muted/30` - 浅色背景
- `text-foreground` - 主文本
- `text-muted-foreground` - 辅助文本
- `border-border` - 边框
- `bg-accent` - 强调色

### 间距规范

- `p-3` - 组件内间距
- `p-4` - 内容区间距
- `p-6` - 大区域间距
- `p-8` - 页面边距
- `gap-2` / `gap-3` / `gap-4` - 项目间距

### 圆角规范

- `rounded-lg` - 组件圆角
- `rounded-xl` - 大组件圆角
- `rounded-2xl` - 特殊组件圆角

---

## 🔄 后续扩展建议

### 1. 集成真实数据
```typescript
// 替换 Mock 数据
- 从 API 获取模型列表
- 从数据库加载用户作品
- 实现真实消费/支付记录
```

### 2. 功能完善
```typescript
// 实现占位的交互逻辑
- 新建对话：创建新的对话会话
- 历史对话：加载选中对话的消息
- 作品管理：实现下载/删除功能
- 表格分页：处理大量数据
```

### 3. 性能优化
```typescript
// 优化渲染性能
- 使用虚拟滚动显示大列表
- 实现图片懒加载
- 使用 React Query 缓存数据
```

---

## 📝 命名规范

### 文件命名
- 组件文件：PascalCase.tsx
- 工具文件：kebab-case.ts
- 页面文件：page.tsx / layout.tsx

### 函数命名
- React 组件：PascalCase
- 事件处理：handle{Action}
- 状态 setter：set{StateName}

### Props 命名
- 事件回调：on{Event}
- 数据属性：按实际内容命名

---

## 🐛 调试技巧

### 工作台调试
```bash
# 检查是否有编译错误
npm run build

# 查看控制台日志
console.log('[v0] 调试信息')

# 快速重启服务
npm run dev
```

### 页面测试
```bash
# 工作台
http://localhost:3000

# 个人中心
http://localhost:3000/profile
```

---

## 📌 重要注意事项

1. **不修改生产数据**
   - 当前所有数据为 Mock，可以自由修改
   - 真实上线前需要替换为数据库查询

2. **保持架构简洁**
   - 避免在单个组件中堆积过多逻辑
   - 复杂逻辑提取为自定义 Hook

3. **遵循设计规范**
   - 使用现有的 UI 组件库
   - 保持色彩和排版的一致性

4. **性能考虑**
   - 表格/列表使用分页而非一次加载
   - 大量图片使用懒加载

---

**版本：** 1.0  
**最后更新：** 2024-12-18  
**维护人：** v0 Development Team
