// MCP服务类型
export type MCPServiceType = 'HTTP' | 'stdio' | 'SSE'

// MCP服务状态（简化为只有两种）
export type MCPServiceStatus = 'enabled' | 'disabled'

// MCP服务分类
export type MCPCategory = 'all' | 'seo' | 'whois' | 'security' | 'enterprise' | 'lifestyle' | 'traffic' | 'other'

// MCP服务配置
export interface MCPServiceConfig {
  // HTTP/SSE 类型配置
  url?: string
  headers?: Record<string, string>
  
  // stdio 类型配置
  command?: 'npx' | 'uvx'
  args?: string[]
  env?: Record<string, string>
  
  // 通用配置
  longRunning?: boolean
  timeout?: number // 默认60秒
}

// MCP服务授权状态
export type MCPAuthStatus = 'authorized' | 'unauthorized' | 'checking'

// MCP服务完整定义（重构后）
export interface MCPService {
  id: string
  name: string              // 中文名称（可编辑）
  englishName: string       // 英文名称（新增，只读）
  description: string       // 介绍（从市场带入，只读）
  icon: string              // emoji或URL
  type: MCPServiceType      // 固定为'HTTP'，只读
  provider: string          // 后台使用，不展示
  status: MCPServiceStatus  // 简化为只有两种状态
  authStatus?: MCPAuthStatus // 授权状态（新增）
  config: MCPServiceConfig
  createdAt: Date
  updatedAt: Date
}

// 平台MCP服务（重构后）
export interface PlatformMCPService {
  id: string
  name: string              // 中文名称
  englishName: string       // 英文名称（新增）
  description: string
  icon: string
  provider: string          // 后台使用，不展示
  defaultUrl: string        // 默认URL（新增）
  category: MCPCategory     // 分类（新增）
  points: number            // 消耗智点（新增）
}

// MCP工具调用
export interface MCPToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  timestamp: Date
}

// MCP工具返回结果
export interface MCPToolResult {
  id: string
  toolCallId: string
  status: 'success' | 'error'
  data: unknown
  timestamp: Date
}

// MCP思考过程
export interface MCPThinkingProcess {
  id: string
  content: string
  timestamp: Date
}

// MCP对话消息扩展
export interface MCPMessageContent {
  thinkingProcess?: MCPThinkingProcess[]
  toolCalls?: MCPToolCall[]
  toolResults?: MCPToolResult[]
  organizedInfo?: string
  finalResponse: string
}

// 分类配置
export const categories = [
  { id: 'all', name: '全部' },
  { id: 'seo', name: 'SEO指标' },
  { id: 'whois', name: 'whois/备案' },
  { id: 'security', name: '安全检测' },
  { id: 'enterprise', name: '企业工商' },
  { id: 'lifestyle', name: '生活服务' },
  { id: 'traffic', name: '交通地理' },
  { id: 'other', name: '其他事务' },
] as const

// 平台MCP服务列表（MCP市场）
export const platformMCPServices: PlatformMCPService[] = [
  {
    id: 'ip-query',
    name: 'IP查询',
    englishName: 'get_ip_location',
    description: '查询IP地址的地理位置和网络信息',
    icon: '📍',
    provider: 'IP信息服务商',
    defaultUrl: 'https://api.ip-provider.com/v1/query',
    category: 'other',
    points: 5,
  },
  {
    id: 'ip-reverse-domain',
    name: 'IP反查域名',
    englishName: 'get_ip_reverse_domain',
    description: '通过IP地址反向查询关联的域名信息',
    icon: '🔍',
    provider: '域名服务商',
    defaultUrl: 'https://api.domain-provider.com/v1/reverse',
    category: 'whois',
    points: 8,
  },
  {
    id: 'whois-query',
    name: 'Whois查询',
    englishName: 'get_whois_info',
    description: '查询域名的注册信息和所有权详情',
    icon: '📋',
    provider: 'Whois服务商',
    defaultUrl: 'https://api.whois-provider.com/v1/query',
    category: 'whois',
    points: 5,
  },
  {
    id: 'icp-query',
    name: 'ICP备案查询',
    englishName: 'get_icp_info',
    description: '查询网站的ICP备案信息和资质',
    icon: '📄',
    provider: '备案查询服务商',
    defaultUrl: 'https://api.icp-provider.com/v1/query',
    category: 'whois',
    points: 10,
  },
  {
    id: 'whois-reverse',
    name: 'Whois反查',
    englishName: 'get_whois_reverse',
    description: '通过注册人信息反查关联域名',
    icon: '🔄',
    provider: 'Whois服务商',
    defaultUrl: 'https://api.whois-provider.com/v1/reverse',
    category: 'whois',
    points: 15,
  },
  {
    id: 'whois-history',
    name: 'Whois历史信息',
    englishName: 'get_whois_history',
    description: '查询域名的历史注册记录变更',
    icon: '📜',
    provider: 'Whois服务商',
    defaultUrl: 'https://api.whois-provider.com/v1/history',
    category: 'whois',
    points: 12,
  },
  {
    id: 'company-fuzzy-query',
    name: '企业工商信息模糊查询',
    englishName: 'search_company_info',
    description: '通过关键词模糊查询企业工商信息',
    icon: '🏢',
    provider: '工商信息服务商',
    defaultUrl: 'https://api.company-provider.com/v1/query',
    category: 'enterprise',
    points: 20,
  },
  {
    id: 'dns-query',
    name: 'DNS查询',
    englishName: 'get_dns_records',
    description: '查询域名的DNS解析记录',
    icon: '🌐',
    provider: 'DNS服务商',
    defaultUrl: 'https://api.dns-provider.com/v1/query',
    category: 'other',
    points: 5,
  },
  {
    id: 'ssl-query',
    name: 'SSL证书查询',
    englishName: 'get_ssl_info',
    description: '查询域名的SSL证书信息',
    icon: '🔒',
    provider: 'SSL服务商',
    defaultUrl: 'https://api.ssl-provider.com/v1/query',
    category: 'security',
    points: 8,
  },
  {
    id: 'subdomain-query',
    name: '子域名查询',
    englishName: 'get_subdomains',
    description: '查询域名的子域名列表',
    icon: '🌳',
    provider: '子域名服务商',
    defaultUrl: 'https://api.subdomain-provider.com/v1/query',
    category: 'whois',
    points: 15,
  },
  {
    id: 'port-scan',
    name: '端口扫描',
    englishName: 'scan_ports',
    description: '扫描目标IP的开放端口',
    icon: '🔌',
    provider: '端口扫描服务商',
    defaultUrl: 'https://api.port-provider.com/v1/scan',
    category: 'security',
    points: 25,
  },
  {
    id: 'cdn-query',
    name: 'CDN查询',
    englishName: 'get_cdn_info',
    description: '查询域名使用的CDN服务商',
    icon: '⚡',
    provider: 'CDN服务商',
    defaultUrl: 'https://api.cdn-provider.com/v1/query',
    category: 'other',
    points: 8,
  },
  {
    id: 'website-analyzer',
    name: '网站综合分析',
    englishName: 'analyze_website',
    description: '全面分析网站性能、SEO、安全性和用户体验，提供详细的优化建议和改进方案。支持检测页面加载速度、移动端适配、关键词密度、外链质量、SSL证书状态等多项指标，帮助您全面提升网站质量。',
    icon: '📊',
    provider: '综合分析服务商',
    defaultUrl: 'https://api.analyzer-provider.com/v1/analyze',
    category: 'seo',
    points: 30,
  },
]

// Mock用户配置的MCP服务（我的MCP）
export const mockUserMCPServices: MCPService[] = [
  {
    id: 'user-ip-query-1',
    name: 'IP查询',
    englishName: 'get_ip_location',
    description: '查询IP地址的地理位置和网络信息',
    icon: '📍',
    type: 'HTTP',
    provider: 'IP信息服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.ip-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'user-whois-1',
    name: 'Whois查询',
    englishName: 'get_whois_info',
    description: '查询域名的注册信息和所有权详情',
    icon: '📋',
    type: 'HTTP',
    provider: 'Whois服务商',
    status: 'disabled',
    authStatus: 'unauthorized',
    config: {
      url: 'https://api.whois-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 120,
      longRunning: true,
    },
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: 'user-icp-1',
    name: 'ICP备案查询',
    englishName: 'get_icp_info',
    description: '查询网站的ICP备案信息和资质',
    icon: '📄',
    type: 'HTTP',
    provider: '备案查询服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.icp-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08'),
  },
  {
    id: 'user-ip-reverse-1',
    name: 'IP反查域名',
    englishName: 'get_ip_reverse_domain',
    description: '通过IP地址反向查询关联的域名信息',
    icon: '🔍',
    type: 'HTTP',
    provider: '域名服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.domain-provider.com/v1/reverse',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: 'user-whois-reverse-1',
    name: 'Whois反查',
    englishName: 'get_whois_reverse',
    description: '通过注册人信息反查关联域名',
    icon: '🔄',
    type: 'HTTP',
    provider: 'Whois服务商',
    status: 'disabled',
    authStatus: 'unauthorized',
    config: {
      url: 'https://api.whois-provider.com/v1/reverse',
      headers: { 'Content-Type': 'application/json' },
      timeout: 120,
      longRunning: true,
    },
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
  },
  {
    id: 'user-whois-history-1',
    name: 'Whois历史信息',
    englishName: 'get_whois_history',
    description: '查询域名的历史注册记录变更',
    icon: '📜',
    type: 'HTTP',
    provider: 'Whois服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.whois-provider.com/v1/history',
      headers: { 'Content-Type': 'application/json' },
      timeout: 90,
    },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'user-company-1',
    name: '企业工商信息查询',
    englishName: 'search_company_info',
    description: '通过关键词模糊查询企业工商信息',
    icon: '🏢',
    type: 'HTTP',
    provider: '工商信息服务商',
    status: 'disabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.company-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: 'user-dns-1',
    name: 'DNS查询',
    englishName: 'get_dns_records',
    description: '查询域名的DNS解析记录',
    icon: '🌐',
    type: 'HTTP',
    provider: 'DNS服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.dns-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2024-12-25'),
    updatedAt: new Date('2024-12-25'),
  },
  {
    id: 'user-ssl-1',
    name: 'SSL证书查询',
    englishName: 'get_ssl_info',
    description: '查询域名的SSL证书信息',
    icon: '🔒',
    type: 'HTTP',
    provider: 'SSL服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.ssl-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 'user-subdomain-1',
    name: '子域名查询',
    englishName: 'get_subdomains',
    description: '查询域名的子域名列表',
    icon: '🌳',
    type: 'HTTP',
    provider: '子域名服务商',
    status: 'disabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.subdomain-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 180,
      longRunning: true,
    },
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
  },
  {
    id: 'user-port-1',
    name: '端口扫描',
    englishName: 'scan_ports',
    description: '扫描目标IP的开放端口',
    icon: '🔌',
    type: 'HTTP',
    provider: '端口扫描服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.port-provider.com/v1/scan',
      headers: { 'Content-Type': 'application/json' },
      timeout: 300,
      longRunning: true,
    },
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'user-cdn-1',
    name: 'CDN查询',
    englishName: 'get_cdn_info',
    description: '查询域名使用的CDN服务商',
    icon: '⚡',
    type: 'HTTP',
    provider: 'CDN服务商',
    status: 'disabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.cdn-provider.com/v1/query',
      headers: { 'Content-Type': 'application/json' },
      timeout: 60,
    },
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'user-website-analyzer-1',
    name: '网站综合分析',
    englishName: 'analyze_website',
    description: '全面分析网站性能、SEO、安全性和用户体验，提供详细的优化建议和改进方案。支持检测页面加载速度、移动端适配、关键词密度、外链质量、SSL证书状态等多项指标，帮助您全面提升网站质量。',
    icon: '📊',
    type: 'HTTP',
    provider: '综合分析服务商',
    status: 'enabled',
    authStatus: 'authorized',
    config: {
      url: 'https://api.analyzer-provider.com/v1/analyze',
      headers: { 'Content-Type': 'application/json' },
      timeout: 120,
      longRunning: true,
    },
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
]

// Mock MCP对话消息数据
export const mockMCPMessages: Record<string, MCPMessageContent> = {
  'mcp-conversation-1': {
    thinkingProcess: [
      {
        id: 'thinking-1',
        content: '用户想查询IP地址的信息，我需要使用IP查询工具来获取地理位置和网络信息。首先分析用户输入的IP地址格式是否正确...',
        timestamp: new Date('2025-01-15T10:30:00'),
      },
      {
        id: 'thinking-2',
        content: 'IP地址格式验证通过，现在调用IP查询MCP工具获取详细信息...',
        timestamp: new Date('2025-01-15T10:30:05'),
      },
    ],
    toolCalls: [
      {
        id: 'tool-call-1',
        name: 'ip_query',
        arguments: { ip: '192.168.1.1' },
        timestamp: new Date('2025-01-15T10:30:10'),
      },
    ],
    toolResults: [
      {
        id: 'tool-result-1',
        toolCallId: 'tool-call-1',
        status: 'success',
        data: {
          ip: '192.168.1.1',
          country: '中国',
          region: '广东省',
          city: '深圳市',
          isp: '电信',
          timezone: 'Asia/Shanghai',
        },
        timestamp: new Date('2025-01-15T10:30:15'),
      },
    ],
    organizedInfo: 'IP地址 192.168.1.1 位于中国广东省深圳市，运营商为电信，时区为 Asia/Shanghai。',
    finalResponse: '根据查询结果，该IP地址（192.168.1.1）位于中国广东省深圳市，由电信运营商提供服务。该地区的时区为 Asia/Shanghai（北京时间）。如果您需要更详细的网络信息或其他相关数据，请告诉我。',
  },
  'mcp-conversation-2': {
    thinkingProcess: [
      {
        id: 'thinking-1',
        content: '用户想查询域名的Whois信息，我需要使用Whois查询工具。首先确认域名格式...',
        timestamp: new Date('2025-01-15T11:00:00'),
      },
    ],
    toolCalls: [
      {
        id: 'tool-call-1',
        name: 'whois_query',
        arguments: { domain: 'example.com' },
        timestamp: new Date('2025-01-15T11:00:05'),
      },
    ],
    toolResults: [
      {
        id: 'tool-result-1',
        toolCallId: 'tool-call-1',
        status: 'success',
        data: {
          domain: 'example.com',
          registrar: 'Example Registrar Inc.',
          creationDate: '1995-08-14',
          expirationDate: '2025-08-13',
          status: 'active',
          nameservers: ['ns1.example.com', 'ns2.example.com'],
        },
        timestamp: new Date('2025-01-15T11:00:10'),
      },
    ],
    organizedInfo: '域名 example.com 由 Example Registrar Inc. 注册，创建于1995年8月14日，将于2025年8月13日到期。',
    finalResponse: '域名 example.com 的注册信息如下：\n- 注册商：Example Registrar Inc.\n- 创建日期：1995年8月14日\n- 到期日期：2025年8月13日\n- 状态：活跃\n- DNS服务器：ns1.example.com, ns2.example.com\n\n该域名历史悠久，已注册近30年。',
  },
}

// 服务类型显示名称映射
export const serviceTypeLabels: Record<MCPServiceType, string> = {
  HTTP: '流式',
  stdio: 'STDIO',
  SSE: 'SSE',
}

// 服务类型完整名称映射（用于表单选项）
export const serviceTypeFullLabels: Record<MCPServiceType, string> = {
  HTTP: '可流式传输的HTTP（Streamable HTTP）',
  stdio: '标准输入/输出（stdio）',
  SSE: '服务器发送事件（SSE）',
}

// 获取服务名称前2字作为图标
export function getServiceIcon(name: string): string {
  if (name.length <= 2) return name
  return name.substring(0, 2)
}