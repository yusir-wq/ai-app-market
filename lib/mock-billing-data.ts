// 消费记录类型定义
export interface UsageRecord {
  id: string
  conversationName: string
  modelName: string
  modelType: 'chat' | 'image' | 'video'
  status: 'success' | 'failed' | 'generating'
  inputTokens: number
  outputTokens: number
  cost: number
  startTime: string
  endTime: string
}

// 支付记录类型定义
export interface PaymentRecord {
  id: string
  orderNo: string
  amount: number
  payTime: string
  payMethod: 'alipay' | 'wechat'
}

// 消费统计数据
export interface UsageStats {
  totalCost: number
  totalCalls: number
  successCalls: number
  failedCalls: number
}

// 消费统计 Mock 数据
export const mockUsageStats: UsageStats = {
  totalCost: 1286.5,
  totalCalls: 3256,
  successCalls: 3189,
  failedCalls: 67,
}

// 消费记录 Mock 数据
export const mockUsageRecords: UsageRecord[] = [
  {
    id: 'usage-001',
    conversationName: '帮我写一个快速排序算法并分析时间复杂度',
    modelName: 'DeepSeek V4 Pro',
    modelType: 'chat',
    status: 'success',
    inputTokens: 1024,
    outputTokens: 2048,
    cost: 0.12,
    startTime: '2025-05-25 09:15:32',
    endTime: '2025-05-25 09:15:45',
  },
  {
    id: 'usage-002',
    conversationName: '生成一张赛博朋克风格的科技感海报用于产品发布会',
    modelName: 'GPT-Image-2',
    modelType: 'image',
    status: 'success',
    inputTokens: 256,
    outputTokens: 0,
    cost: 0.35,
    startTime: '2025-05-25 09:20:10',
    endTime: '2025-05-25 09:21:03',
  },
  {
    id: 'usage-003',
    conversationName: '制作一个15秒的短视频用于抖音推广宣传',
    modelName: 'Gemini 3 Flash',
    modelType: 'video',
    status: 'generating',
    inputTokens: 512,
    outputTokens: 0,
    cost: 1.28,
    startTime: '2025-05-25 09:25:00',
    endTime: '2025-05-25 09:25:00',
  },
  {
    id: 'usage-004',
    conversationName: '解释什么是机器学习以及深度学习的基本原理和应用场景',
    modelName: 'MiniMax-M2.5',
    modelType: 'chat',
    status: 'success',
    inputTokens: 2048,
    outputTokens: 4096,
    cost: 0.28,
    startTime: '2025-05-25 10:05:22',
    endTime: '2025-05-25 10:05:50',
  },
  {
    id: 'usage-005',
    conversationName: '调试代码问题并优化性能瓶颈',
    modelName: 'GLM-5-Turbo',
    modelType: 'chat',
    status: 'failed',
    inputTokens: 512,
    outputTokens: 0,
    cost: 0.02,
    startTime: '2025-05-25 10:30:15',
    endTime: '2025-05-25 10:30:18',
  },
  {
    id: 'usage-006',
    conversationName: '设计一个极简风格的科技公司品牌logo',
    modelName: 'Qwen-Image-Max',
    modelType: 'image',
    status: 'success',
    inputTokens: 384,
    outputTokens: 0,
    cost: 0.42,
    startTime: '2025-05-24 14:12:30',
    endTime: '2025-05-24 14:13:45',
  },
  {
    id: 'usage-007',
    conversationName: '翻译这段英文技术文档并解释专业术语含义',
    modelName: 'Claude Haiku 4.5',
    modelType: 'chat',
    status: 'success',
    inputTokens: 768,
    outputTokens: 1536,
    cost: 0.08,
    startTime: '2025-05-24 16:45:00',
    endTime: '2025-05-24 16:45:12',
  },
  {
    id: 'usage-008',
    conversationName: '创建抽象艺术风格的背景图片用于网站设计',
    modelName: 'GPT-Image-2',
    modelType: 'image',
    status: 'failed',
    inputTokens: 128,
    outputTokens: 0,
    cost: 0.01,
    startTime: '2025-05-24 17:20:05',
    endTime: '2025-05-24 17:20:08',
  },
  {
    id: 'usage-009',
    conversationName: '分析销售数据趋势并预测下季度业绩走向',
    modelName: 'DeepSeek V4 Pro',
    modelType: 'chat',
    status: 'success',
    inputTokens: 3072,
    outputTokens: 6144,
    cost: 0.56,
    startTime: '2025-05-24 19:30:00',
    endTime: '2025-05-24 19:30:35',
  },
  {
    id: 'usage-010',
    conversationName: '生成产品展示视频脚本和分镜描述',
    modelName: 'Gemini 3 Flash',
    modelType: 'video',
    status: 'success',
    inputTokens: 256,
    outputTokens: 0,
    cost: 2.15,
    startTime: '2025-05-23 11:00:00',
    endTime: '2025-05-23 11:02:30',
  },
  {
    id: 'usage-011',
    conversationName: '总结这篇文档要点并提取关键行动项',
    modelName: 'MiniMax-M2.5',
    modelType: 'chat',
    status: 'success',
    inputTokens: 1536,
    outputTokens: 3072,
    cost: 0.22,
    startTime: '2025-05-23 13:15:20',
    endTime: '2025-05-23 13:15:42',
  },
  {
    id: 'usage-012',
    conversationName: '写一个正式的商务邮件模板用于客户沟通',
    modelName: 'GLM-5-Turbo',
    modelType: 'chat',
    status: 'success',
    inputTokens: 2048,
    outputTokens: 4096,
    cost: 0.32,
    startTime: '2025-05-23 15:40:10',
    endTime: '2025-05-23 15:40:38',
  },
]

// 支付记录 Mock 数据
export const mockPaymentRecords: PaymentRecord[] = [
  {
    id: 'pay-001',
    orderNo: 'ORD20250525001',
    amount: 100.0,
    payTime: '2025-05-25 08:30:00',
    payMethod: 'alipay',
  },
  {
    id: 'pay-002',
    orderNo: 'ORD20250520001',
    amount: 200.0,
    payTime: '2025-05-20 14:22:15',
    payMethod: 'wechat',
  },
  {
    id: 'pay-003',
    orderNo: 'ORD20250515001',
    amount: 500.0,
    payTime: '2025-05-15 10:05:30',
    payMethod: 'alipay',
  },
  {
    id: 'pay-004',
    orderNo: 'ORD20250510001',
    amount: 50.0,
    payTime: '2025-05-10 16:45:00',
    payMethod: 'wechat',
  },
  {
    id: 'pay-005',
    orderNo: 'ORD20250505001',
    amount: 300.0,
    payTime: '2025-05-05 09:12:40',
    payMethod: 'alipay',
  },
  {
    id: 'pay-006',
    orderNo: 'ORD20250428001',
    amount: 100.0,
    payTime: '2025-04-28 11:30:20',
    payMethod: 'wechat',
  },
  {
    id: 'pay-007',
    orderNo: 'ORD20250420001',
    amount: 1000.0,
    payTime: '2025-04-20 15:00:00',
    payMethod: 'alipay',
  },
  {
    id: 'pay-008',
    orderNo: 'ORD20250415001',
    amount: 150.0,
    payTime: '2025-04-15 08:50:10',
    payMethod: 'wechat',
  },
]

// 模型名称列表（用于筛选下拉框）
export const modelNames: string[] = [
  'DeepSeek V4 Pro',
  'MiniMax-M2.5',
  'GPT-Image-2',
  'Qwen-Image-Max',
  'GLM-5-Turbo',
  'Claude Haiku 4.5',
  'Gemini 3 Flash',
]
