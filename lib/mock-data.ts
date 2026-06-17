// Mock 模型数据
export interface Model {
  id: string
  name: string
  type: 'chat' | 'image' | 'video'
  description: string
  logo: string
  addedAt: Date
  // V1.2 新增字段
  requiresReference: boolean
  costPoints: number
  supportedReferences?: ('content' | 'style' | 'character')[]
  // 渐变色（参考图风格）
  gradient: string
  // 禁用状态
  disabled?: boolean
  disabledReason?: string
}

// V1.2 对话类型
export interface Conversation {
  id: string
  title: string
  preview: string
  createdAt: Date
  modelIds: string[]
  messages: Message[]
}

// V1.2 搜索结果类型
export interface SearchResult {
  id: string
  siteName: string
  title: string
  snippet: string
  url: string
}

// V1.2 邀请记录类型
export interface InviteRecord {
  id: string
  invitedUserId: string
  invitedUserName: string
  registeredAt: Date
  rewardStatus: 'pending' | 'granted'
  rewardPoints: number
}

// 历史对话类型
export interface ChatHistory {
  id: string
  title: string
  modelId: string
  createdAt: Date
  summary?: string
}

export type ChatHistories = Record<string, ChatHistory[]>

export const mockModels: Model[] = [
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    type: 'chat',
    description: '强大的大型语言模型，支持多轮对话、代码生成和复杂推理任务',
    logo: '🔮',
    addedAt: new Date('2024-12-15'),
    requiresReference: false,
    costPoints: 10,
    gradient: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'deepseek-chat',
    name: 'deepseek-chat',
    type: 'chat',
    description: '擅长通用对话、知识问答和复杂代码生成，具有极高的性价比和响应速度。',
    logo: '💎',
    addedAt: new Date('2025-06-01'),
    requiresReference: false,
    costPoints: 5,
    gradient: 'from-gray-400 to-gray-500',
    disabledReason: '此模型不支持图片理解',
  },
  {
    id: 'minimax-m25',
    name: 'MiniMax-M2.5',
    type: 'chat',
    description: '高性能对话模型，擅长创意写作和情感理解',
    logo: '💬',
    addedAt: new Date('2024-12-10'),
    requiresReference: false,
    costPoints: 8,
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    id: 'gpt-image-2',
    name: 'GPT-Image-2',
    type: 'image',
    description: '先进的文生图模型，支持高质量图片生成和编辑',
    logo: '🎨',
    addedAt: new Date('2024-12-08'),
    requiresReference: false,
    costPoints: 50,
    supportedReferences: ['content', 'style'],
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'qwen-image-max',
    name: 'Qwen-Image-Max',
    type: 'image',
    description: '通义千问图像模型，支持中文场景理解和创意生成',
    logo: '🖼️',
    addedAt: new Date('2024-12-05'),
    requiresReference: false,
    costPoints: 80,
    supportedReferences: ['content', 'style', 'character'],
    gradient: 'from-blue-400 to-violet-500',
  },
  {
    id: 'glm-5-turbo',
    name: 'GLM-5-Turbo',
    type: 'chat',
    description: '智谱AI旗舰模型，中文能力卓越，推理速度快',
    logo: '⚡',
    addedAt: new Date('2024-12-01'),
    requiresReference: false,
    costPoints: 5,
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    id: 'claude-haiku-45',
    name: 'Claude Haiku 4.5',
    type: 'chat',
    description: 'Anthropic轻量级模型，响应快速，适合日常对话',
    logo: '🌸',
    addedAt: new Date('2024-11-28'),
    requiresReference: false,
    costPoints: 6,
    gradient: 'from-pink-300 to-purple-400',
    disabledReason: '此模型不支持联网模式和深度思考',
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    type: 'video',
    description: 'Google多模态模型，支持视频理解和生成',
    logo: '✨',
    addedAt: new Date('2024-11-25'),
    requiresReference: false,
    costPoints: 100,
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'doubao-seedance-2-0-260128',
    name: 'doubao-seedance-2-0-260128',
    type: 'video',
    description: '豆包视频生成模型，支持高质量视频内容创作与编辑',
    logo: '🎬',
    addedAt: new Date('2025-06-01'),
    requiresReference: false,
    costPoints: 120,
    gradient: 'from-cyan-400 to-blue-500',
  },
]

// MCP消息内容类型
export interface MCPMessageContent {
  thinkingProcess?: { id: string; content: string; timestamp: Date }[]
  toolResults?: { id: string; toolCallId: string; status: 'success' | 'error'; data: unknown; timestamp: Date }[]
  organizedInfo?: string
  finalResponse: string
}

// Mock 聊天消息数据
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  contentType: 'text' | 'markdown' | 'code' | 'mcp'
  codeLanguage?: string
  timestamp: Date
  status?: 'sending' | 'success' | 'error'
  mcpContent?: MCPMessageContent
}

// V1.2 统一 Message 类型（兼容所有模型类型）
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content?: string
  contentType: 'text' | 'markdown' | 'code' | 'mcp' | 'image' | 'video'
  codeLanguage?: string
  timestamp: Date
  status?: 'sending' | 'success' | 'error'
  // MCP
  mcpContent?: MCPMessageContent
  // Image
  userPrompt?: string
  parameters?: any
  referenceImages?: string[]
  images?: string[]
  isExpired?: boolean
  referenceType?: 'content' | 'style' | 'character'
  // Video
  videos?: string[]
  duration?: string
  resolution?: string
  referenceAssets?: { images?: string[]; videos?: string[]; audios?: string[] }
  // V1.2 新增
  modelId?: string
  modelIds?: string[]
  onlineSearch?: boolean
  deepThinking?: boolean
  isMCPEnabled?: boolean
  thinkingContent?: string
  searchResults?: SearchResult[]
  responseTime?: number
  costPoints?: number
}

export const mockChatMessages: Record<string, ChatMessage[]> = {
  'deepseek-v4-pro': [
    {
      id: 'msg-1',
      role: 'user',
      content: '帮我写一个 React 组件用来展示用户列表，支持分页和搜索功能',
      contentType: 'text',
      timestamp: new Date('2024-12-18 14:00'),
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: `## React 用户列表组件

这是一个功能完整的用户列表组件，支持分页和搜索：

### 主要特性：
- **分页功能**：支持每页显示 10、20、50 条记录
- **实时搜索**：即时筛选用户名称和邮箱
- **排序**：支持按名称、邮箱、注册日期排序
- **响应式设计**：在移动设备和桌面上都能正常显示

### 示例用法：

\`\`\`jsx
import UserList from './UserList'

export default function App() {
  return <UserList initialPageSize={10} />
}
\`\`\`

### 类型定义：

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  registeredAt: Date
}

interface UserListProps {
  initialPageSize?: number
}
\`\`\`

### 核心实现逻辑：

1. **搜索状态管理**：使用 useState 管理搜索关键词
2. **分页计算**：根据当前页码和页面大小计算要显示的数据切片
3. **过滤逻辑**：结合搜索和排序条件过滤用户列表
4. **事件处理**：分页按钮和搜索输入的变更事件`,
      contentType: 'markdown',
      timestamp: new Date('2024-12-18 14:05'),
    },
    {
      id: 'msg-3',
      role: 'user',
      content: '能否给我完整的代码实现？',
      contentType: 'text',
      timestamp: new Date('2024-12-18 14:10'),
    },
    {
      id: 'msg-4',
      role: 'assistant',
      content: `\`\`\`javascript
import React, { useState, useMemo } from 'react'

export default function UserList({ initialPageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortBy, setSortBy] = useState('name')

  // Mock 用户数据
  const mockUsers = Array.from({ length: 150 }, (_, i) => ({
    id: \`user-\${i + 1}\`,
    name: \`用户 \${i + 1}\`,
    email: \`user\${i + 1}@example.com\`,
    registeredAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  }))

  // 过滤和排序
  const filteredUsers = useMemo(() => {
    let result = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'email') return a.email.localeCompare(b.email)
      if (sortBy === 'date') return b.registeredAt.getTime() - a.registeredAt.getTime()
      return 0
    })

    return result
  }, [searchQuery, sortBy])

  // 分页
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="搜索用户..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>注册日期</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.registeredAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        第 {currentPage} / {totalPages} 页 | 共 {filteredUsers.length} 条
      </div>
    </div>
  )
}
\`\`\``,
      contentType: 'code',
      codeLanguage: 'javascript',
      timestamp: new Date('2024-12-18 14:15'),
    },
  ],
  'claude-3-sonnet': [
    {
      id: 'msg-c1',
      role: 'user',
      content: 'How can I optimize my React component performance?',
      contentType: 'text',
      timestamp: new Date('2024-12-18 15:00'),
    },
    {
      id: 'msg-c2',
      role: 'assistant',
      content: `## React 性能优化指南

优化 React 组件性能的关键策略：

### 1. 使用 React.memo 减少不必要重新渲染
- 仅在 props 改变时重新渲染
- 适用于纯展示组件

### 2. useMemo 和 useCallback 的合理使用
- 缓存计算结果和回调函数
- 避免在渲染过程中创建新对象

### 3. 代码分割和懒加载
- 使用 React.lazy 进行动态导入
- 结合 Suspense 优化用户体验

### 4. 虚拟化长列表
- 使用 react-window 或 react-virtualized
- 只渲染可见的列表项

### 5. 避免在渲染时创建新函数
- 将函数定义在组件外
- 使用 useCallback 包装事件处理函数

### 6. 使用 Profiler API 测量性能
- 识别性能瓶颈
- 监控组件渲染时间`,
      contentType: 'markdown',
      timestamp: new Date('2024-12-18 15:05'),
    },
  ],
  'gpt-4-turbo': [
    {
      id: 'msg-g1',
      role: 'user',
      content: '请解释什么是闭包（Closure）',
      contentType: 'text',
      timestamp: new Date('2024-12-18 16:00'),
    },
    {
      id: 'msg-g2',
      role: 'assistant',
      content: `## JavaScript 闭包详解

�����包是 JavaScript 中一个重要概念。当一个函数能够访问其外层作用域中的变量时，就形成了闭包。

### 闭包的定义

闭包是函数和声明该函数的词法环境的组合。简单来说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。

### 基本示例

\`\`\`javascript
function outer() {
  const message = 'Hello, Closure!'
  
  function inner() {
    console.log(message)
  }
  
  return inner
}

const func = outer()
func() // 输出: Hello, Closure!
\`\`\`

### 闭包的用途

1. **数据私有化** - 创建私有变量，避免全局污染
2. **函数工厂** - 创建具有特定行为的函数
3. **回调函数** - 在异步操作中保留上下文
4. **模块模式** - 实现模块化代码结构

### 性能考虑

虽然闭包很强大，但滥用会导致内存泄漏。当闭包不再需要时，应该及时释放外层作用域的引用。`,
      contentType: 'markdown',
      timestamp: new Date('2024-12-18 16:05'),
    },
    {
      id: 'msg-g3',
      role: 'user',
      content: '能给个实际的闭包应用例子吗？',
      contentType: 'text',
      timestamp: new Date('2024-12-18 16:10'),
    },
    {
      id: 'msg-g4',
      role: 'assistant',
      content: `\`\`\`javascript
// 实际应用：计数器工厂
function createCounter(initialValue = 0) {
  let count = initialValue
  
  return {
    increment() {
      return ++count
    },
    decrement() {
      return --count
    },
    getCount() {
      return count
    }
  }
}

const counter1 = createCounter(0)
const counter2 = createCounter(10)

console.log(counter1.increment()) // 1
console.log(counter1.increment()) // 2
console.log(counter2.decrement()) // 9

// 实际应用：防抖函数
function debounce(func, delay) {
  let timeoutId
  
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

const searchHandler = debounce((query) => {
  console.log('Search:', query)
}, 500)

// 实际应用：事件委托
function createEventHandler() {
  const events = {}
  
  return {
    on(eventName, callback) {
      if (!events[eventName]) {
        events[eventName] = []
      }
      events[eventName].push(callback)
    },
    emit(eventName, data) {
      if (events[eventName]) {
        events[eventName].forEach(cb => cb(data))
      }
    }
  }
}

const emitter = createEventHandler()
emitter.on('login', (user) => console.log('User logged in:', user))
emitter.emit('login', { name: 'Alice' })
\`\`\``,
      contentType: 'code',
      codeLanguage: 'javascript',
      timestamp: new Date('2024-12-18 16:15'),
    },
  ],
}

// MiniMax-M2.5 MCP对话mock数据 - 展示WHOIS历史查询过程
export const mockMCPMessages: Record<string, ChatMessage[]> = {
  'minimax-m25': [
    {
      id: 'mcp-msg-1',
      role: 'user',
      content: '帮我查询一下 chinaz.com 的 Whois 历史信息',
      contentType: 'text',
      timestamp: new Date('2024-12-18 14:30'),
    },
    {
      id: 'mcp-msg-2',
      role: 'assistant',
      content: '已成功查询到 chinaz.com 的 Whois 历史信息！',
      contentType: 'mcp',
      timestamp: new Date('2024-12-18 14:30:05'),
      mcpContent: {
        thinkingProcess: [
          {
            id: 'think-1',
            content: '用户想要查询域名 chinaz.com 的 Whois 历史信息。这是一个需要调用外部工具的请求。\n\n我需要使用 whois历史信息 工具来获取这些信息。该工具可以帮助查询域名的历史Whois记录，包括注册信息、到期时间变更历史等。\n\n让我调用这个工具来获取相关信息。',
            timestamp: new Date('2024-12-18 14:30:02'),
          },
        ],
        toolResults: [
          {
            id: 'tool-result-1',
            toolCallId: 'tool-call-1',
            status: 'success',
            data: {
              StateCode: 1,
              Reason: '成功',
              TotalCount: 38,
              List: [
                {
                  Domain: 'chinaz.com',
                  Registrar: 'DNSPod, Inc.',
                  CreatedDate: '2005-04-05',
                  UpdatedDate: '2024-03-15',
                  ExpirationDate: '2032-04-05',
                  RegistrantName: '隗微',
                  RegistrantOrganization: '',
                  RegistrantCountry: 'CN',
                  RegistrantEmail: 'domain@dnspod.com',
                },
                {
                  Domain: 'chinaz.com',
                  Registrar: 'DNSPod, Inc.',
                  CreatedDate: '2005-04-05',
                  UpdatedDate: '2023-02-20',
                  ExpirationDate: '2024-04-05',
                  RegistrantName: '隗微',
                  RegistrantOrganization: '',
                  RegistrantCountry: 'CN',
                  RegistrantEmail: 'domain@dnspod.com',
                },
                {
                  Domain: 'chinaz.com',
                  Registrar: 'eName Technology Co.,Ltd.',
                  CreatedDate: '2005-04-05',
                  UpdatedDate: '2022-06-10',
                  ExpirationDate: '2023-04-05',
                  RegistrantName: '隗微',
                  RegistrantOrganization: '',
                  RegistrantCountry: 'CN',
                  RegistrantEmail: 'domain@dnspod.com',
                },
              ],
            },
            timestamp: new Date('2024-12-18 14:30:03'),
          },
        ],
        organizedInfo: `📊 **chinaz.com Whois 历史查询结果**

共查询到 **38** 条历史记录，以下是部分重要变更记录：

**📅 最新注册信息**
- 注册商: DNSPod, Inc.
- 创建日期: 2005-04-05
- 到期日期: 2032-04-05（已续费至 2032年）
- 注册人: 隗微
- 国家/地区: 中国

**🔄 主要变更记录**
1. **2022年6月**：注册商从 eName 转入 DNSPod
2. **2023年2月**：域名到期时间更新
3. **2024年3月**：最新一次信息更新

**📌 域名年龄**: 约 19 年（2005年注册）`,
        finalResponse: `已成功查询到 **chinaz.com** 的 Whois 历史信息！

根据查询结果，该域名共有 **38** 条历史变更记录，主要信息如下：

**基本信息**
- 注册时间：2005年4月5日
- 最新到期时间：2032年4月5日
- 注册商：DNSPod, Inc.（2022年6月从 eName 转入）
- 注册人：隗微（中国）

**历史变更**
该域名的注册商曾在2022年发生过变更，从 eName Technology Co.,Ltd. 转入 DNSPod, Inc.。此外，域名的到期时间在2023年2月进行过一次更新，最近一次信息更新是在2024年3月15日。

作为国内知名的站长工具平台，chinaz.com（站长之家）自2005年注册至今已有约19年的历史，是国内资历较老的互联网品牌之一。`,
      },
    },
  ],
}

export const mockChatHistories: Record<string, ChatHistory[]> = {
  'deepseek-v4-pro': [
    { id: '1', title: '帮我写一个React组件', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-18 14:30'), summary: '这是一个功能完整的用户列表组件，支持分页和搜索...' },
    { id: '2', title: '解释一下量子计算的基本原理和量子纠缠现象', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-17 10:20'), summary: '量子计算利用量子比特的叠加态和纠缠态进行并行计算...' },
    { id: '3', title: '如何优化数据库查询性能', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-16 16:45'), summary: '优化数据库查询可以从索引设计、查询重写、缓存策略等方面入手...' },
    { id: '4', title: '用Python实现快速排序算法并分析时间复杂度', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-15 09:00'), summary: '快速排序是一种分治算法，平均时间复杂度为O(n log n)...' },
    { id: '5', title: '分析这段代码的复杂度', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-14 20:15'), summary: '从时间复杂度和空间复杂度两个维度进行了详细分析...' },
  ],
  'minimax-m25': [
    { id: '6', title: '写一篇关于人工智能的科幻小说开头', modelId: 'minimax-m25', createdAt: new Date('2024-12-18 11:00'), summary: '公元2147年，人类与AI共存的世界已经形成了微妙的平衡...' },
    { id: '7', title: '帮我续写这个故事的结局', modelId: 'minimax-m25', createdAt: new Date('2024-12-17 15:30'), summary: '主角最终发现，真相远比想象中更加复杂和深刻...' },
    { id: '8', title: '创作一首现代诗歌', modelId: 'minimax-m25', createdAt: new Date('2024-12-16 08:45'), summary: '在城市的钢筋森林中，我寻找着属于自己的那一片天空...' },
  ],
  'gpt-image-2': [
    { id: '9', title: '生成一张赛博朋克风格的城市夜景图', modelId: 'gpt-image-2', createdAt: new Date('2024-12-18 16:20'), summary: '霓虹灯闪烁的未来城市，高楼林立，雨夜氛围浓郁...' },
    { id: '10', title: '设计一个极简风格的科技公司Logo', modelId: 'gpt-image-2', createdAt: new Date('2024-12-17 12:00'), summary: '以几何图形为基础，采用蓝紫渐变色，体现科技感...' },
    { id: '11', title: '创作一幅水墨山水画', modelId: 'gpt-image-2', createdAt: new Date('2024-12-16 19:30'), summary: '远山如黛，近水含烟，营造出静谧深远的意境...' },
    { id: '12', title: '生成产品宣传海报', modelId: 'gpt-image-2', createdAt: new Date('2024-12-15 14:15'), summary: '以产品为核心，搭配动感光效和现代排版设计...' },
    { id: '13', title: '设计APP启动页插画', modelId: 'gpt-image-2', createdAt: new Date('2024-12-14 10:00'), summary: '温暖的色调，简洁的构图，展现APP的核心功能...' },
    { id: '14', title: '创作3D渲染风格的未来城市场景', modelId: 'gpt-image-2', createdAt: new Date('2024-12-13 17:45'), summary: '高精度的3D城市渲染，展现未来建筑和交通系统...' },
  ],
  'qwen-image-max': [
    { id: '15', title: '生成中国风插画素材用于电商网站', modelId: 'qwen-image-max', createdAt: new Date('2024-12-18 09:30'), summary: '融合传统国风元素与现代设计语言，适用于电商banner...' },
    { id: '16', title: '设计电商商品主图', modelId: 'qwen-image-max', createdAt: new Date('2024-12-17 14:00'), summary: '突出产品质感，采用柔和的灯光和精致的构图...' },
  ],
  'glm-5-turbo': [
    { id: '17', title: '翻译这篇技术文档并解释关键术语', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-18 13:00'), summary: '已完成英译中，并对分布式系统相关的专业术语做了详细注释...' },
    { id: '18', title: '帮我总结会议纪要并提取行动项', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-17 09:45'), summary: '会议主要讨论了Q4产品路线图，提取了5个关键行动项...' },
    { id: '19', title: '生成周报模板', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-16 17:30'), summary: '创建了包含本周工作总结、数据分析和下周计划的模板...' },
    { id: '20', title: '优化这段文案的表达使其更具吸引力', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-15 11:20'), summary: '使用更具感染力的词汇和节奏感更强的句式进行了优化...' },
  ],
  'claude-haiku-45': [
    { id: '21', title: '回答一个关于存在主义的哲学问题', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-18 10:15'), summary: '从萨特、加缪和海德格尔的角度分析了存在先于本质...' },
    { id: '22', title: '讨论人工智能伦理和隐私保护的重要性', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-17 16:00'), summary: '从数据隐私、算法公平性和透明度三个维度进行了探讨...' },
    { id: '23', title: '分析这本书的主题和象征意义', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-16 12:30'), summary: '深入分析了作品中的核心隐喻和叙事结构...' },
  ],
  'gemini-3-flash': [
    { id: '24', title: '生成产品宣传视频脚本和分镜描述', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-18 15:00'), summary: '30秒产品宣传片脚本，包含8个分镜场景的详细描述...' },
    { id: '25', title: '创建短视频内容', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-17 11:30'), summary: '15秒社交媒体短视频，节奏紧凑，视觉冲击力强...' },
    { id: '26', title: '生成教程演示视频', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-16 14:45'), summary: '5分钟的软件操作教程，步骤清晰，配有字幕说明...' },
    { id: '27', title: '制作动画效果预览', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-15 10:00'), summary: 'Logo动画的3个不同风格方案预览...' },
    { id: '28', title: '生成社交媒体短片用于抖音推广', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-14 16:30'), summary: '15秒竖版短视频，突出产品核心卖点和使用场景...' },
  ],
}

// 模型能力标签
export const modelCapabilities: Record<string, string[]> = {
  'deepseek-v4-pro': ['多轮对话', '代码生成', '逻辑推理', '文档理解', '数学计算'],
  'minimax-m25': ['创意写作', '情感对话', '角色扮演', '故事续写', '诗歌创作'],
  'gpt-image-2': ['文生图', '图像编辑', '风格迁移', '高分辨率', '批量生成'],
  'qwen-image-max': ['中文理解', '场景生成', '插画创作', '商业设计', '艺术风格'],
  'glm-5-turbo': ['中文对话', '知识问答', '文本摘要', '翻译润色', '信息提取'],
  'claude-haiku-45': ['快速响应', '安全对话', '逻辑分析', '创意思考', '伦理探讨'],
  'gemini-3-flash': ['视频生成', '多模态理解', '动画制作', '内容创作', '场景合成'],
}

// 推荐 Prompt 示例
export const recommendedPrompts: Record<string, string[]> = {
  'deepseek-v4-pro': [
    '帮我写一个 TypeScript 函数来处理日期格式化',
    '解释一下 React 的虚拟 DOM 工作原理',
    '分析这段代码的时间复杂度和空间复杂度',
    '如何设计一个高可用的分布式系统',
  ],
  'minimax-m25': [
    '以第一人称视角写一个科幻短篇故事',
    '帮我续写这个悬疑故事的结局',
    '创作一首关于春天的现代诗',
    '模拟一个温暖治愈的对话场景',
  ],
  'gpt-image-2': [
    '生成一张赛博朋克风格的未来城市夜景',
    '设计一个简约现代的科技公司 Logo',
    '创作一���吉卜力风格的森林插画',
    '生成一张产品展示的电商主图',
  ],
  'qwen-image-max': [
    '绘制一幅中国风水墨山水画',
    '设计一张春节主题的海报',
    '创作一个可爱的国潮风格IP形象',
    '生成一张美食摄影风格的菜品图',
  ],
  'glm-5-turbo': [
    '帮我总结这篇文章的核心观点',
    '将这段英文技术文档翻译成中文',
    '优化这段营销文案的表达',
    '生成一份项目��报��板',
  ],
  'claude-haiku-45': [
    '从哲学角度分析人工智能的���质',
    '讨论科技发展与人文关怀的平衡',
    '分析这部电影的深层主题',
    '探讨创造力与效率的关系',
  ],
  'gemini-3-flash': [
    '生成一个 30 秒的产品宣传视频脚本',
    '创建一个动态的 Logo 动画效果',
    '制作一个教程演示的短视频',
    '生成一个社交媒体短片创意',
  ],
}

// 图片模型 mock 对话数据
export const mockImageMessages: Record<string, Message[]> = {
  'gpt-image-2': [
    {
      id: 'img-msg-1',
      role: 'user',
      contentType: 'image',
      userPrompt: '一个现代化的办公室，阳光从大窗户照进来，简洁的设计风格',
      parameters: {
        ratio: '16:9' as const,
        count: 2 as const,
        quality: 'high' as const,
        optimizePrompt: true,
      },
      timestamp: new Date('2024-12-18 10:00'),
    } as any,
    {
      id: 'img-msg-2',
      role: 'assistant',
      contentType: 'image',
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=512&h=320&fit=crop',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=512&h=320&fit=crop',
      ],
      timestamp: new Date('2024-12-18 10:05'),
    } as any,
    {
      id: 'img-msg-3',
      role: 'user',
      contentType: 'image',
      userPrompt: '将上面的图片改成暖色调，更温暖的氛围',
      parameters: {
        ratio: '16:9' as const,
        count: 1 as const,
        quality: 'high' as const,
        optimizePrompt: true,
      },
      referenceImages: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=512&h=320&fit=crop',
      ],
      timestamp: new Date('2024-12-18 10:10'),
    } as any,
    {
      id: 'img-msg-4',
      role: 'assistant',
      contentType: 'image',
      images: [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=512&h=320&fit=crop',
      ],
      timestamp: new Date('2024-12-18 10:15'),
    } as any,
    // 失效状态 mock 数据
    {
      id: 'img-msg-expired-1',
      role: 'user',
      contentType: 'image',
      userPrompt: '生成一个复古风格的海报',
      parameters: {
        ratio: '1:1' as const,
        count: 2 as const,
        quality: 'high' as const,
        optimizePrompt: true,
      },
      timestamp: new Date('2024-12-15 14:00'),
    } as any,
    {
      id: 'img-msg-expired-2',
      role: 'assistant',
      contentType: 'image',
      images: ['expired', 'expired'],
      isExpired: true,
      timestamp: new Date('2024-12-15 14:05'),
    } as any,
  ],
  'qwen-image-max': [
    {
      id: 'img-msg-q1',
      role: 'user',
      contentType: 'image',
      userPrompt: '中国风的水墨画，山水景色，意境深远',
      parameters: {
        ratio: '1:1' as const,
        count: 4 as const,
        quality: 'high' as const,
        optimizePrompt: true,
      },
      timestamp: new Date('2024-12-18 11:00'),
    } as any,
    {
      id: 'img-msg-q2',
      role: 'assistant',
      contentType: 'image',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256&h=256&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256&h=256&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256&h=256&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256&h=256&fit=crop',
      ],
      timestamp: new Date('2024-12-18 11:05'),
    } as any,
  ],
}

// 视频模型 mock 对话数据
export const mockVideoMessages: Record<string, Message[]> = {
  'gemini-3-flash': [
    {
      id: 'vid-msg-1',
      role: 'user',
      contentType: 'video',
      userPrompt: '一个现代化的办公室工作场景，员工认真工作的动画效果',
      parameters: {
        duration: 5 as const,
        ratio: '16:9' as const,
        resolution: '1080p' as const,
        count: 1 as const,
        mode: 'quality' as const,
      },
      referenceAssets: {},
      timestamp: new Date('2024-12-18 14:00'),
    } as any,
    {
      id: 'vid-msg-2',
      role: 'assistant',
      contentType: 'video',
      videos: [
        'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      ],
      duration: '0:05',
      resolution: '1080p',
      timestamp: new Date('2024-12-18 14:15'),
    } as any,
    {
      id: 'vid-msg-3',
      role: 'user',
      contentType: 'video',
      userPrompt: '将视频的场景改为户外，增加动态效果',
      parameters: {
        duration: 10 as const,
        ratio: '16:9' as const,
        resolution: '1080p' as const,
        count: 1 as const,
        mode: 'quality' as const,
      },
      referenceAssets: {
        videos: [
          'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
        ],
      },
      timestamp: new Date('2024-12-18 14:20'),
    } as any,
    {
      id: 'vid-msg-4',
      role: 'assistant',
      contentType: 'video',
      videos: [
        'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
      ],
      duration: '0:10',
      resolution: '1080p',
      timestamp: new Date('2024-12-18 14:35'),
    } as any,
    // 失效状态 mock 数据
    {
      id: 'vid-msg-expired-1',
      role: 'user',
      contentType: 'video',
      userPrompt: '生成一个科幻动画场景',
      parameters: {
        duration: 5 as const,
        ratio: '16:9' as const,
        resolution: '1080p' as const,
        count: 1 as const,
        mode: 'quality' as const,
      },
      referenceAssets: {},
      timestamp: new Date('2024-12-15 10:00'),
    } as any,
    {
      id: 'vid-msg-expired-2',
      role: 'assistant',
      contentType: 'video',
      videos: ['expired'],
      duration: '0:05',
      resolution: '1080p',
      isExpired: true,
      timestamp: new Date('2024-12-15 10:15'),
    } as any,
  ],
}

// 图片模型失效状态 mock 数据 - 添加到 mockImageMessages 中


// ========== V1.2 新增 Mock 数据 ==========

// Mock 对话数据
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: '帮我写一个React组件',
    preview: '这是一个功能完整的用户列表组件，支持分页和搜索...',
    createdAt: new Date('2024-12-18 14:30'),
    modelIds: ['deepseek-v4-pro'],
    messages: [],
  },
  {
    id: 'conv-2',
    title: '解释量子计算的基本原理',
    preview: '量子计算利用量子比特的叠加态和纠缠态进行并行计算...',
    createdAt: new Date('2024-12-17 10:20'),
    modelIds: ['deepseek-v4-pro', 'minimax-m25'],
    messages: [],
  },
  {
    id: 'conv-3',
    title: '优化数据库查询性能',
    preview: '优化数据库查询可以从索引设计、查询重写、缓存策略等方面入手...',
    createdAt: new Date('2024-12-16 16:45'),
    modelIds: ['glm-5-turbo'],
    messages: [],
  },
  {
    id: 'conv-4',
    title: '创作科幻小说开头',
    preview: '公元2147年，人类与AI共存的世界已经形成了微妙的平衡...',
    createdAt: new Date('2024-12-18 11:00'),
    modelIds: ['minimax-m25', 'claude-haiku-45'],
    messages: [],
  },
  {
    id: 'conv-5',
    title: '生成赛博朋克风格城市夜景',
    preview: '霓虹灯闪烁的未来城市，高楼林立，雨夜氛围浓郁...',
    createdAt: new Date('2024-12-18 16:20'),
    modelIds: ['gpt-image-2'],
    messages: [],
  },
  {
    id: 'conv-6',
    title: '设计科技公司Logo',
    preview: '以几何图形为基础，采用蓝紫渐变色，体现科技感...',
    createdAt: new Date('2024-12-17 12:00'),
    modelIds: ['gpt-image-2', 'qwen-image-max'],
    messages: [],
  },
  {
    id: 'conv-7',
    title: '翻译技术文档',
    preview: '已完成英译中，并对分布式系统相关的专业术语做了详细注释...',
    createdAt: new Date('2024-12-18 13:00'),
    modelIds: ['glm-5-turbo'],
    messages: [],
  },
  {
    id: 'conv-8',
    title: '生成产品宣传视频脚本',
    preview: '30秒产品宣传片脚本，包含8个分镜场景的详细描述...',
    createdAt: new Date('2024-12-18 15:00'),
    modelIds: ['gemini-3-flash'],
    messages: [],
  },
  {
    id: 'conv-9',
    title: '讨论AI伦理和隐私保护',
    preview: '从数据隐私、算法公平性和透明度三个维度进行了探讨...',
    createdAt: new Date('2024-12-17 16:00'),
    modelIds: ['claude-haiku-45', 'deepseek-v4-pro'],
    messages: [],
  },
  {
    id: 'conv-10',
    title: '生成中国风插画素材',
    preview: '融合传统国风元素与现代设计语言，适用于电商banner...',
    createdAt: new Date('2024-12-18 09:30'),
    modelIds: ['qwen-image-max'],
    messages: [],
  },
  // 图片已失效示例
  {
    id: 'conv-11',
    title: '生成产品宣传海报',
    preview: '以产品为核心，搭配动感光效和现代排版设计...',
    createdAt: new Date('2024-12-14 08:00'),
    modelIds: ['gpt-image-2'],
    messages: [
      {
        id: 'hist-conv-11-user',
        role: 'user',
        contentType: 'image',
        userPrompt: '生成一张产品宣传海报，简约风格，突出产品质感',
        parameters: { ratio: '1:1', count: 2, quality: 'high', optimizePrompt: true },
        referenceImages: ['https://placehold.co/120x120/e2e8f0/475569?text=Ref'],
        modelIds: ['gpt-image-2'],
        timestamp: new Date('2024-12-14 08:00'),
      },
      {
        id: 'hist-conv-11-ai',
        role: 'assistant',
        contentType: 'image',
        modelId: 'gpt-image-2',
        images: ['expired', 'expired'],
        isExpired: true,
        timestamp: new Date('2024-12-14 08:05'),
        costPoints: 50,
        status: 'success',
      },
    ] as any[],
  },
  // 视频已失效示例
  {
    id: 'conv-12',
    title: '生成产品宣传视频',
    preview: '30秒产品宣传片，科幻风格，快节奏剪辑...',
    createdAt: new Date('2024-12-13 10:00'),
    modelIds: ['gemini-3-flash'],
    messages: [
      {
        id: 'hist-conv-12-user',
        role: 'user',
        contentType: 'video',
        userPrompt: '生成一段30秒的产品宣传视频，科幻风格，快节奏剪辑',
        parameters: { duration: 30, ratio: '16:9', resolution: '1080p', count: 1, mode: 'quality' },
        referenceAssets: { images: ['https://placehold.co/120x120/e2e8f0/475569?text=Ref'] },
        modelIds: ['gemini-3-flash'],
        timestamp: new Date('2024-12-13 10:00'),
      },
      {
        id: 'hist-conv-12-ai',
        role: 'assistant',
        contentType: 'video',
        modelId: 'gemini-3-flash',
        videos: ['expired'],
        isExpired: true,
        duration: '0:30',
        resolution: '1080p',
        timestamp: new Date('2024-12-13 10:05'),
        costPoints: 200,
        status: 'success',
      },
    ] as any[],
  },
  // MCP 工具调用示例 - MiniMax-M2.5 Whois历史查询
  {
    id: 'conv-mcp-1',
    title: '帮我查询 chinaz.com 的 Whois 历史信息',
    preview: '用户想要查询域名 chinaz.com 的 Whois 历史信息...',
    createdAt: new Date('2024-12-18 14:30'),
    modelIds: ['minimax-m25'],
    messages: [
      {
        id: 'mcp-msg-1',
        role: 'user',
        content: '帮我查询一下 chinaz.com 的 Whois 历史信息',
        contentType: 'text',
        modelIds: ['minimax-m25'],
        timestamp: new Date('2024-12-18 14:30'),
      },
      {
        id: 'mcp-msg-2',
        role: 'assistant',
        content: '已成功查询到 chinaz.com 的 Whois 历史信息！',
        contentType: 'mcp',
        modelId: 'minimax-m25',
        timestamp: new Date('2024-12-18 14:30:05'),
        costPoints: 12,
        status: 'success',
        mcpContent: {
          thinkingProcess: [
            {
              id: 'think-1',
              content: '用户想要查询域名 chinaz.com 的 Whois 历史信息。这是一个需要调用外部工具的请求。\n\n我需要使用 whois历史信息 工具来获取这些信息。该工具可以帮助查询域名的历史Whois记录，包括注册信息、到期时间变更历史等。\n\n让我调用这个工具来获取相关信息。',
              timestamp: new Date('2024-12-18 14:30:02'),
            },
          ],
          toolResults: [
            {
              id: 'tool-result-1',
              toolCallId: 'tool-call-1',
              status: 'success',
              data: {
                StateCode: 1,
                Reason: '成功',
                TotalCount: 38,
                List: [
                  {
                    Domain: 'chinaz.com',
                    Registrar: 'DNSPod, Inc.',
                    CreatedDate: '2005-04-05',
                    UpdatedDate: '2024-03-15',
                    ExpirationDate: '2032-04-05',
                    RegistrantName: '隗微',
                    RegistrantOrganization: '',
                    RegistrantCountry: 'CN',
                    RegistrantEmail: 'domain@dnspod.com',
                  },
                  {
                    Domain: 'chinaz.com',
                    Registrar: 'DNSPod, Inc.',
                    CreatedDate: '2005-04-05',
                    UpdatedDate: '2023-02-20',
                    ExpirationDate: '2024-04-05',
                    RegistrantName: '隗微',
                    RegistrantOrganization: '',
                    RegistrantCountry: 'CN',
                    RegistrantEmail: 'domain@dnspod.com',
                  },
                  {
                    Domain: 'chinaz.com',
                    Registrar: 'eName Technology Co.,Ltd.',
                    CreatedDate: '2005-04-05',
                    UpdatedDate: '2022-06-10',
                    ExpirationDate: '2023-04-05',
                    RegistrantName: '隗微',
                    RegistrantOrganization: '',
                    RegistrantCountry: 'CN',
                    RegistrantEmail: 'domain@ename.com',
                  },
                ],
              },
              timestamp: new Date('2024-12-18 14:30:15'),
            },
          ],
          organizedInfo: `📊 **chinaz.com Whois 历史查询结果**\n\n共查询到 **38** 条历史记录，以下是部分重要变更记录：\n\n**📅 最新注册信息**\n- 注册商: DNSPod, Inc.\n- 创建日期: 2005-04-05\n- 到期日期: 2032-04-05（已续费至 2032年）\n- 注册人: 隗微\n- 国家/地区: 中国\n\n**🔄 主要变更记录**\n1. **2022年6月**：注册商从 eName 转入 DNSPod\n2. **2023年2月**：域名到期时间更新\n3. **2024年3月**：最新一次信息更新\n\n**📌 域名年龄**: 约 19 年（2005年注册）`,
          finalResponse: `已成功查询到 **chinaz.com** 的 Whois 历史信息！\n\n根据查询结果，该域名共有 **38** 条历史变更记录，主要信息如下：\n\n**基本信息**\n- 注册时间：2005年4月5日\n- 最新到期时间：2032年4月5日\n- 注册商：DNSPod, Inc.（2022年6月从 eName 转入）\n- 注册人：隗微（中国）\n\n**历史变更**\n该域名的注册商曾在2022年发生过变更，从 eName Technology Co.,Ltd. 转入 DNSPod, Inc.。此外，域名的到期时间在2023年2月进行过一次更新，最近一次信息更新是在2024年3月15日。\n\n作为国内知名的站长工具平台，chinaz.com（站长之家）自2005年注册至今已有约19年的历史，是国内资历较老的互联网品牌之一。`,
        },
      },
    ] as any[],
  },
]

// Mock 搜索结果
export const mockSearchResults: Record<string, SearchResult[]> = {
  'deepseek-v4-pro': [
    { id: 'sr-1', siteName: 'React 官方文档', title: 'React 组件最佳实践指南', snippet: '本文详细介绍 React 组件设计的最佳实践，包括组件拆分、状态管理、性能优化等方面的建议...', url: 'https://react.dev/docs/components' },
    { id: 'sr-2', siteName: '掘金', title: 'React 性能优化完全指南（2024版）', snippet: '汇总了 React 应用性能优化的各种技巧，从虚拟列表到代码分割，全面提升应用响应速度...', url: 'https://juejin.cn/post/react-perf' },
    { id: 'sr-3', siteName: 'GitHub', title: 'react-window - 虚拟化长列表库', snippet: 'react-window 是一个轻量级的 React 虚拟化库，用于高效渲染大型列表和表格数据...', url: 'https://github.com/bvaughn/react-window' },
  ],
  'minimax-m25': [
    { id: 'sr-4', siteName: '知乎', title: '量子计算入门：从零开始理解量子比特', snippet: '量子计算利用量子力学原理进行信息处理，量子比特可以同时处于0和1的叠加态...', url: 'https://zhuanlan.zhihu.com/quantum-intro' },
    { id: 'sr-5', siteName: 'Nature', title: 'Quantum Computing: Progress and Prospects', snippet: 'Recent advances in quantum computing hardware and algorithms show promising results...', url: 'https://nature.com/quantum-2024' },
    { id: 'sr-6', siteName: 'IBM Quantum', title: 'What is Quantum Computing?', snippet: 'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics...', url: 'https://ibm.com/quantum/what-is' },
    { id: 'sr-7', siteName: 'arXiv', title: 'A Survey on Quantum Machine Learning', snippet: 'This paper surveys the intersection of quantum computing and machine learning...', url: 'https://arxiv.org/abs/quantum-ml' },
  ],
  'glm-5-turbo': [
    { id: 'sr-8', siteName: 'MySQL 官方文档', title: 'MySQL 8.0 查询优化指南', snippet: '详细介绍 MySQL 查询优化器的内部原理以及如何通过索引优化、查询重写提升性能...', url: 'https://dev.mysql.com/doc/optimization' },
    { id: 'sr-9', siteName: 'Stack Overflow', title: 'Best practices for database query optimization', snippet: 'Community-driven discussion on database optimization techniques including indexing, caching...', url: 'https://stackoverflow.com/db-optimization' },
    { id: 'sr-10', siteName: '阿里云开发者社区', title: '数据库性能调优实战：从慢查询到秒级响应', snippet: '分享真实项目中数据库性能调优的全过程，包括慢查询分析、索引设计、SQL改写等...', url: 'https://developer.aliyun.com/db-tuning' },
  ],
}

// Mock 深度思考内容
export const mockThinkingContent: Record<string, string> = {
  'deepseek-v4-pro': `用户需要一个 React 用户列表组件，这是一个典型的前端组件开发问题。

分析需求：
1. 需要分页功能 → 涉及状态管理（currentPage, pageSize）
2. 需要搜索功能 → 需要过滤逻辑
3. 应该支持排序 → 可扩展的排序机制

设计思路：
- 使用 useState 管理分页和搜索状态
- 使用 useMemo 优化过滤和排序计算
- 分页逻辑：slice((currentPage - 1) * pageSize, currentPage * pageSize)
- 搜索逻辑：filter + toLowerCase 实现不区分大小写

综合考虑性能，对于大数据集可引入虚拟滚动。方案可行。`,

  'minimax-m25': `需要解释量子计算的基本原理，受众可能是初学者。

关键概念梳理：
1. 量子比特（qubit）vs 经典比特
2. 叠加态（superposition）
3. 纠缠态（entanglement）
4. 量子门操作

表达策略：
- 用比喻帮助理解（硬币旋转 vs 硬币正反面）
- 避免过多数学公式
- 突出量子计算的优势场景（因数分解、搜索算法）
- 简要提及当前技术瓶颈

思考角度：从经典计算的局限出发，引出量子计算如何突破这些局限。`,

  'glm-5-turbo': `数据库查询优化是一个系统性问题。

分析维度：
1. 索引优化 — 最直接有效的手段
   - 联合索引的最左前缀原则
   - 覆盖索引减少回表
2. 查询重写 — 避免低效写法
   - 避免 SELECT *
   - 合理使用 JOIN vs 子查询
3. 缓存策略 — 减少数据库压力
   - Redis 缓存热点数据
   - 读写分离
4. 架构层面 — 分库分表

综合来看，80% 的性能问题可以通过索引优化解决。`,

  'claude-haiku-45': `讨论 AI 伦理需要涵盖多个维度。

核心议题：
1. 数据隐私 — 训练数据的合法性和用户知情权
2. 算法公平性 — 避免偏见和歧视
3. 透明度 — 可解释 AI (XAI) 的重要性
4. 责任归属 — AI 决策的责任划分
5. 安全对齐 — 确保 AI 行为符合人类价值观

现实案例：
- 招聘算法中的性别偏见
- 面部识别在不同人群中的准确率差异
- 自动驾驶的伦理决策

建议从技术、法律、社会三个层面平衡推进。`,
}

// Mock 邀请记录
export const mockInviteRecords: InviteRecord[] = [
  {
    id: 'inv-1',
    invitedUserId: 'user_zhang',
    invitedUserName: '张小明',
    registeredAt: new Date('2024-12-18'),
    rewardStatus: 'granted',
    rewardPoints: 500,
  },
  {
    id: 'inv-2',
    invitedUserId: 'user_li',
    invitedUserName: '李华',
    registeredAt: new Date('2024-12-15'),
    rewardStatus: 'granted',
    rewardPoints: 500,
  },
  {
    id: 'inv-3',
    invitedUserId: 'user_wang',
    invitedUserName: '王芳',
    registeredAt: new Date('2024-12-10'),
    rewardStatus: 'granted',
    rewardPoints: 500,
  },
  {
    id: 'inv-4',
    invitedUserId: 'user_chen',
    invitedUserName: '陈伟',
    registeredAt: new Date('2024-12-05'),
    rewardStatus: 'pending',
    rewardPoints: 500,
  },
  {
    id: 'inv-5',
    invitedUserId: 'user_zhao',
    invitedUserName: '赵丽',
    registeredAt: new Date('2024-11-28'),
    rewardStatus: 'granted',
    rewardPoints: 500,
  },
]
