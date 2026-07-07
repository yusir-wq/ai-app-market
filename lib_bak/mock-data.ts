// Mock 模型数据
export interface Model {
  id: string
  name: string
  type: 'chat' | 'image' | 'video'
  description: string
  logo: string
  addedAt: Date
}

// 历史对话类型
export interface ChatHistory {
  id: string
  title: string
  modelId: string
  createdAt: Date
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
  },
  {
    id: 'minimax-m25',
    name: 'MiniMax-M2.5',
    type: 'chat',
    description: '高性能对话模型，擅长创意写作和情感理解',
    logo: '💬',
    addedAt: new Date('2024-12-10'),
  },
  {
    id: 'gpt-image-2',
    name: 'GPT-Image-2',
    type: 'image',
    description: '先进的文生图模型，支持高质量图片生成和编辑',
    logo: '🎨',
    addedAt: new Date('2024-12-08'),
  },
  {
    id: 'qwen-image-max',
    name: 'Qwen-Image-Max',
    type: 'image',
    description: '通义千问图像模型，支持中文场景理解和创意生成',
    logo: '🖼️',
    addedAt: new Date('2024-12-05'),
  },
  {
    id: 'glm-5-turbo',
    name: 'GLM-5-Turbo',
    type: 'chat',
    description: '智谱AI旗舰模型，中文能力卓越，推理速度快',
    logo: '⚡',
    addedAt: new Date('2024-12-01'),
  },
  {
    id: 'claude-haiku-45',
    name: 'Claude Haiku 4.5',
    type: 'chat',
    description: 'Anthropic轻量级模型，响应快速，适合日常对话',
    logo: '🌸',
    addedAt: new Date('2024-11-28'),
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    type: 'video',
    description: 'Google多模态模型，支持视频理解和生成',
    logo: '✨',
    addedAt: new Date('2024-11-25'),
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
    { id: '1', title: '帮我写一个React组件', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-18 14:30') },
    { id: '2', title: '解释一下量子计算的基本原理和量子纠缠现象', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-17 10:20') },
    { id: '3', title: '如何优化数据库查询性能', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-16 16:45') },
    { id: '4', title: '用Python实现快速排序算法并分析时间复杂度', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-15 09:00') },
    { id: '5', title: '分析这段代码的复杂度', modelId: 'deepseek-v4-pro', createdAt: new Date('2024-12-14 20:15') },
  ],
  'minimax-m25': [
    { id: '6', title: '写一篇关于人工智能的科幻小说开头', modelId: 'minimax-m25', createdAt: new Date('2024-12-18 11:00') },
    { id: '7', title: '帮我续写这个故事的结局', modelId: 'minimax-m25', createdAt: new Date('2024-12-17 15:30') },
    { id: '8', title: '创作一首现代诗歌', modelId: 'minimax-m25', createdAt: new Date('2024-12-16 08:45') },
  ],
  'gpt-image-2': [
    { id: '9', title: '生成一张赛博朋克风格的城市夜景图', modelId: 'gpt-image-2', createdAt: new Date('2024-12-18 16:20') },
    { id: '10', title: '设计一个极简风格的科技公司Logo', modelId: 'gpt-image-2', createdAt: new Date('2024-12-17 12:00') },
    { id: '11', title: '创作一幅水墨山水画', modelId: 'gpt-image-2', createdAt: new Date('2024-12-16 19:30') },
    { id: '12', title: '生成产品宣传海报', modelId: 'gpt-image-2', createdAt: new Date('2024-12-15 14:15') },
    { id: '13', title: '设计APP启动页插画', modelId: 'gpt-image-2', createdAt: new Date('2024-12-14 10:00') },
    { id: '14', title: '创作3D渲染风格的未来城市场景', modelId: 'gpt-image-2', createdAt: new Date('2024-12-13 17:45') },
  ],
  'qwen-image-max': [
    { id: '15', title: '生成中国风插画素材用于电商网站', modelId: 'qwen-image-max', createdAt: new Date('2024-12-18 09:30') },
    { id: '16', title: '设计电商商品主图', modelId: 'qwen-image-max', createdAt: new Date('2024-12-17 14:00') },
  ],
  'glm-5-turbo': [
    { id: '17', title: '翻译这篇技术文档并解释关键术语', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-18 13:00') },
    { id: '18', title: '帮我总结会议纪要并提取行动项', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-17 09:45') },
    { id: '19', title: '生成周报模板', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-16 17:30') },
    { id: '20', title: '优化这段文案的表达使其更具吸引力', modelId: 'glm-5-turbo', createdAt: new Date('2024-12-15 11:20') },
  ],
  'claude-haiku-45': [
    { id: '21', title: '回答一个关于存在主义的哲学问题', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-18 10:15') },
    { id: '22', title: '讨论人工智能伦理和隐私保护的重要性', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-17 16:00') },
    { id: '23', title: '分析这本书的主题和象征意义', modelId: 'claude-haiku-45', createdAt: new Date('2024-12-16 12:30') },
  ],
  'gemini-3-flash': [
    { id: '24', title: '生成产品宣传视频脚本和分镜描述', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-18 15:00') },
    { id: '25', title: '创建短视频内容', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-17 11:30') },
    { id: '26', title: '生成教程演示视频', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-16 14:45') },
    { id: '27', title: '制作动画效果预览', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-15 10:00') },
    { id: '28', title: '生成社交媒体短片用于抖音推广', modelId: 'gemini-3-flash', createdAt: new Date('2024-12-14 16:30') },
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
