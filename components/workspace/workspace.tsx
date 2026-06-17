'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NavPanel } from './nav-panel'
import { HomeContent } from './home-content'
import { WorkspaceContent } from './workspace-content'
import { InputArea } from './input-area'
import { HomeInputArea } from './home-input-area'
import { ModelResponseCard } from './model-response-card'
import { InviteDialog } from './invite-dialog'
import { NewUserBenefitToast } from './new-user-benefit-toast'
import { LoginModal } from '@/components/auth/login-modal'
import { RechargeModal } from '@/components/auth/recharge-modal'
import { BillingUsage } from './billing-usage'
import { BillingPayments } from './billing-payments'
import { MCPCenter } from './mcp-center'
import type { MCPCenterHandle } from './mcp-center'
import { MCPQuickCreateModal } from './mcp-quick-create-modal'
import { MCPQuickConfigModal } from './mcp-quick-config-modal'
import { MCPServiceDetailModal } from './mcp-service-detail-modal'
import { useAuth } from '@/contexts/auth-context'
import { useMCP } from '@/contexts/mcp-context'
import { mockMCPMessages } from '@/lib/mcp-data'
import {
  mockModels,
  mockConversations,
  modelCapabilities,
  recommendedPrompts,
  type Model,
  type Message,
  type Conversation,
} from '@/lib/mock-data'
import { Search, MoreHorizontal, Pencil, Trash2, Menu, ArrowLeft, ExternalLink } from 'lucide-react'

type ViewMode = 'home' | 'chat' | 'history-all' | 'model-detail' | 'billing-usage' | 'billing-payments' | 'mcp-center'

export function Workspace() {
  const { isLoggedIn, setShowLoginModal, setShowRechargeModal, user } = useAuth()
  const { mcpEnabled, selectedMCPServices } = useMCP()
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameChatId, setRenameChatId] = useState<string | null>(null)
  const [renameNewTitle, setRenameNewTitle] = useState('')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [showNewUserBenefitToast, setShowNewUserBenefitToast] = useState(false)
  const [benefitToastDismissedUserId, setBenefitToastDismissedUserId] = useState<string | null>(null)

  // V1.2 多模型状态
  const [selectedModels, setSelectedModels] = useState<Model[]>([])
  const [enableSearch, setEnableSearch] = useState(false)
  const [enableThinking, setEnableThinking] = useState(false)
  // 回复模式：单模型对话
  const [replyModel, setReplyModel] = useState<Model | null>(null)

  // 移动端导航面板状态
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // MCP页面状态
  const [mcpActiveTab, setMcpActiveTab] = useState<'my' | 'market'>('my')
  const mcpCenterRef = useRef<MCPCenterHandle>(null)

  // 智点
  const points = user ? Math.floor(user.balance * 1000) : 0

  // 通用导航条组件
  const renderNavBar = () => (
    <div className="hidden md:flex items-center shrink-0 h-14 px-4 border-b border-border bg-background">
      {/* 左侧 Logo + 名称 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">AI</span>
        </div>
        <span className="font-semibold text-sm text-foreground">AI应用广场</span>
      </div>
      {/* 右侧 */}
      <div className="flex items-center gap-4 ml-auto">
        {isLoggedIn && user ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">剩余智点:</span>
              <span className="font-medium text-foreground">{points.toLocaleString()}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowRechargeModal(true)}>
              充值
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.id.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">{user.id}</span>
            </div>
          </>
        ) : (
          <Button onClick={() => setShowLoginModal(true)}>
            登录
          </Button>
        )}
      </div>
    </div>
  )

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setShowNewUserBenefitToast(false)
      setBenefitToastDismissedUserId(null)
      return
    }

    if (benefitToastDismissedUserId !== user.id) {
      setShowNewUserBenefitToast(true)
    }
  }, [isLoggedIn, user?.id, benefitToastDismissedUserId])

  const handleCloseNewUserBenefitToast = useCallback(() => {
    setShowNewUserBenefitToast(false)
    if (user?.id) {
      setBenefitToastDismissedUserId(user.id)
    }
  }, [user?.id])

  // 新建对话
  const handleNewChat = useCallback(() => {
    setViewMode('home')
    setActiveConversationId(null)
    setMessages([])
    setInputValue('')
    setSelectedModels([])
    setReplyModel(null)
  }, [])

  // 从导航面板选择对话
  const handleSelectConversation = useCallback((convId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    const conv = conversations.find(c => c.id === convId)
    if (conv) {
      setActiveConversationId(convId)
      const modelIds = conv.modelIds
      setSelectedModels(mockModels.filter(m => modelIds.includes(m.id)))
      setViewMode('chat')
      setInputValue('')
      setReplyModel(null)

      // 如果对话有消息则使用，否则生成 mock 消息
      if (conv.messages && conv.messages.length > 0) {
        setMessages(conv.messages)
      } else {
        const mockMsgs = generateConversationMessages(conv)
        setMessages(mockMsgs)
        // 同时更新 conversation 中的数据
        setConversations(prev =>
          prev.map(c => c.id === convId ? { ...c, messages: mockMsgs } : c)
        )
      }
    }
  }, [isLoggedIn, setShowLoginModal, conversations])

  // 查看全部对话
  const handleViewAll = useCallback(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setViewMode('history-all')
  }, [isLoggedIn, setShowLoginModal])

  // 折叠导航面板
  const handleToggleNavCollapse = useCallback(() => {
    setIsNavCollapsed(prev => !prev)
  }, [])

  // 打开邀请弹窗
  const handleOpenInvite = useCallback(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setInviteDialogOpen(true)
  }, [isLoggedIn, setShowLoginModal])

  // V1.2 首页发送消息 - 支持多模型
  const handleHomeSendMessage = useCallback((message: string, modelIds: string[]) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    if (!message.trim() || modelIds.length === 0) return

    const models = modelIds.map(id => mockModels.find(m => m.id === id)!).filter(Boolean)
    if (models.length === 0) return

    // 图片/视频模型禁止多模型对话
    const hasNonChat = models.some(m => m.type === 'image' || m.type === 'video')
    const effectiveModels = hasNonChat ? models.filter(m => m.type !== 'chat').slice(0, 1) : models
    if (effectiveModels.length === 0) return
    const effectiveModelIds = effectiveModels.map(m => m.id)

    setSelectedModels(effectiveModels)
    setReplyModel(null)

    const timestamp = new Date()
    const isMCPActive = mcpEnabled && selectedMCPServices.length > 0
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      contentType: 'text',
      modelIds: effectiveModelIds,
      timestamp,
      onlineSearch: enableSearch,
      deepThinking: enableThinking,
      isMCPEnabled: isMCPActive,
    } as Message

    const newMessages = [userMessage]
    setMessages(newMessages)

    // 创建对话
    const convId = `conv-${Date.now()}`
    const newConv: Conversation = {
      id: convId,
      title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
      preview: message.slice(0, 50),
      createdAt: timestamp,
      modelIds: effectiveModelIds,
      messages: newMessages,
    }
    setActiveConversationId(convId)
    setConversations(prev => [newConv, ...prev])
    setViewMode('chat')
    setIsLoading(true)

    // 并行加载所有模型回复
    effectiveModels.forEach((model, index) => {
      const delay = 800 + index * 1200
      const responseTime = 800 + index * 1200 + Math.random() * 1500

      setTimeout(() => {
        const mcpContent = isMCPActive ? (mockMCPMessages['mcp-conversation-2'] || Object.values(mockMCPMessages)[0]) : undefined
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai-${model.id}`,
          role: 'assistant',
          content: isMCPActive ? (mcpContent?.finalResponse || getMockResponse(model, message)) : getMockResponse(model, message),
          contentType: isMCPActive ? 'mcp' : (effectiveModels.length > 1 ? 'text' : 'markdown'),
          modelId: model.id,
          onlineSearch: enableSearch,
          deepThinking: enableThinking,
          isMCPEnabled: isMCPActive,
          mcpContent: isMCPActive ? mcpContent : undefined,
          timestamp: new Date(),
          responseTime,
          costPoints: isMCPActive ? 12 : model.costPoints,
          status: 'success',
        } as Message

        setMessages(prev => {
          const updated = [...prev, aiMessage]
          // Update conversation
          setConversations(prevConvs =>
            prevConvs.map(c =>
              c.id === convId ? { ...c, messages: updated } : c
            )
          )
          // Check if all responded
          const respondedModels = updated.filter(m =>
            m.role === 'assistant' && effectiveModelIds.includes(m.modelId || '')
          )
          if (respondedModels.length >= effectiveModels.length) {
            setIsLoading(false)
          }
          return updated
        })
      }, delay)
    })
  }, [isLoggedIn, setShowLoginModal, enableSearch, enableThinking, mcpEnabled, selectedMCPServices])

  // V1.2 从首页模型列表跳转模型详情页
  const handleNavigateToModel = useCallback((model: Model) => {
    setSelectedModels([model])
    setReplyModel(null)
    setViewMode('model-detail')
  }, [])

  // V1.2 聊天页发送消息
  const handleChatSendMessage = useCallback((message: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    if (!message.trim()) return

    // 确定发送给哪些模型
    const targetModels = replyModel ? [replyModel] : selectedModels
    if (targetModels.length === 0) return

    const timestamp = new Date()
    const modelIds = targetModels.map(m => m.id)
    const firstModelType = targetModels[0]?.type

    if (firstModelType === 'image') {
      // 图片生成（单模型）
      handleImageSend(message, targetModels[0], timestamp, modelIds)
      return
    }

    if (firstModelType === 'video') {
      // 视频生成（单模型）
      handleVideoSend(message, targetModels[0], timestamp, modelIds)
      return
    }

    // 文本消息
    const isMCPActive = mcpEnabled && selectedMCPServices.length > 0
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      contentType: 'text',
      modelIds,
      onlineSearch: enableSearch,
      deepThinking: enableThinking,
      isMCPEnabled: isMCPActive,
      timestamp,
    } as Message

    setMessages(prev => {
      const updated = [...prev, userMessage]
      updateConversationMessages(updated)
      return updated
    })
    setInputValue('')
    setIsLoading(true)

    // 并行回复
    targetModels.forEach((model, index) => {
      const delay = 800 + index * 1200
      const responseTime = 800 + index * 1200 + Math.random() * 1500

      setTimeout(() => {
        const mcpContent = isMCPActive ? (mockMCPMessages['mcp-conversation-2'] || Object.values(mockMCPMessages)[0]) : undefined
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai-${model.id}`,
          role: 'assistant',
          content: isMCPActive ? (mcpContent?.finalResponse || getMockResponse(model, message)) : getMockResponse(model, message),
          contentType: isMCPActive ? 'mcp' : (targetModels.length > 1 ? 'text' : 'markdown'),
          modelId: model.id,
          onlineSearch: enableSearch,
          deepThinking: enableThinking,
          isMCPEnabled: isMCPActive,
          mcpContent: isMCPActive ? mcpContent : undefined,
          timestamp: new Date(),
          responseTime,
          costPoints: isMCPActive ? 12 : model.costPoints,
          status: 'success',
        } as Message

        setMessages(prev => {
          const updated = [...prev, aiMessage]
          updateConversationMessages(updated)
          const respondedModels = updated.filter(m =>
            m.role === 'assistant' && modelIds.includes(m.modelId || '')
          )
          if (respondedModels.length >= targetModels.length) {
            setIsLoading(false)
          }
          return updated
        })
      }, delay)
    })
  }, [isLoggedIn, setShowLoginModal, selectedModels, replyModel, enableSearch, enableThinking, mcpEnabled, selectedMCPServices])

  const handleImageSend = (message: string, model: Model, timestamp: Date, modelIds: string[]) => {
    const userMessage: Message = {
      id: `img-${Date.now()}`,
      role: 'user',
      contentType: 'image',
      userPrompt: message,
      parameters: { ratio: 'auto', count: 1, quality: 'auto', optimizePrompt: true },
      modelIds,
      timestamp,
    } as Message

    setMessages(prev => {
      const updated = [...prev, userMessage]
      updateConversationMessages(updated)
      return updated
    })
    setInputValue('')
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: `img-${Date.now()}-ai`,
        role: 'assistant',
        contentType: 'image',
        images: [
          'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=512&h=320&fit=crop',
        ],
        modelId: model.id,
        timestamp: new Date(),
        responseTime: 1500,
        costPoints: model.costPoints,
        status: 'success',
      } as Message

      setMessages(prev => {
        const updated = [...prev, aiMessage]
        updateConversationMessages(updated)
        setIsLoading(false)
        return updated
      })
    }, 1500)
  }

  const handleVideoSend = (message: string, model: Model, timestamp: Date, modelIds: string[]) => {
    const userMessage: Message = {
      id: `vid-${Date.now()}`,
      role: 'user',
      contentType: 'video',
      userPrompt: message,
      parameters: { duration: 5, ratio: '16:9', resolution: '1080p', count: 1, mode: 'quality' },
      modelIds,
      timestamp,
    } as Message

    setMessages(prev => {
      const updated = [...prev, userMessage]
      updateConversationMessages(updated)
      return updated
    })
    setInputValue('')
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: `vid-${Date.now()}-ai`,
        role: 'assistant',
        contentType: 'video',
        videos: ['https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4'],
        duration: '0:05',
        resolution: '1080p',
        modelId: model.id,
        timestamp: new Date(),
        responseTime: 2000,
        costPoints: model.costPoints,
        status: 'success',
      } as Message

      setMessages(prev => {
        const updated = [...prev, aiMessage]
        updateConversationMessages(updated)
        setIsLoading(false)
        return updated
      })
    }, 2000)
  }

  const updateConversationMessages = (msgs: Message[]) => {
    if (activeConversationId) {
      setConversations(prev =>
        prev.map(c => c.id === activeConversationId ? { ...c, messages: msgs } : c)
      )
    }
  }

  // V1.2 回复按钮 - 切换到单模型对话
  const handleReplyToModel = useCallback((model: Model) => {
    setReplyModel(model)
  }, [])

  // V1.2 重新生成
  const handleRegenerate = useCallback((model: Model) => {
    // 移除该模型的最后一条回复，重新发送
    setMessages(prev => {
      const filtered = prev.filter(m =>
        !(m.role === 'assistant' && m.modelId === model.id)
      )
      updateConversationMessages(filtered)
      return filtered
    })
    // 模拟重新生成
    setIsLoading(true)
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai-${model.id}-regenerated`,
        role: 'assistant',
        content: `[重新生成] 这是 ${model.name} 对您问题的全新回复。`,
        contentType: 'text',
        modelId: model.id,
        onlineSearch: enableSearch,
        deepThinking: enableThinking,
        timestamp: new Date(),
        responseTime: 1200,
        costPoints: model.costPoints,
        status: 'success',
      } as Message

      setMessages(prev => {
        const updated = [...prev, aiMessage]
        updateConversationMessages(updated)
        setIsLoading(false)
        return updated
      })
    }, 1200)
  }, [enableSearch, enableThinking])

  // 重命名对话
  const handleRenameChat = (chatId: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c)
    )
  }

  // 删除对话
  const handleDeleteChat = (chatId: string) => {
    setConversations(prev => prev.filter(c => c.id !== chatId))
    if (activeConversationId === chatId) {
      setActiveConversationId(null)
      setMessages([])
      setViewMode('home')
    }
  }

  // ===== 聊天内容区 =====
  const renderChatContent = () => {
    const userMessages = messages.filter(m => m.role === 'user')
    const assistantMessages = messages.filter(m => m.role === 'assistant')

    // 分组：每个 user message 及其对应的 assistant messages
    const messageGroups: { user: Message; assistants: Message[] }[] = []
    const assistantMap = new Map<string, Message[]>()
    assistantMessages.forEach(m => {
      // Group by approximate position
      const key = m.id.split('-ai-')[0] || m.id
      if (!assistantMap.has(key)) assistantMap.set(key, [])
      assistantMap.get(key)!.push(m)
    })

    userMessages.forEach((userMsg, idx) => {
      const assistants = assistantMessages.filter((_, aiIdx) => {
        // Simple grouping: assistants after this user message, before next user message
        const nextUserIdx = userMessages.indexOf(userMsg) + 1
        return assistantMessages.indexOf(assistantMessages[aiIdx]) < 0 // too complex
      }) || []

      messageGroups.push({
        user: userMsg,
        assistants: assistantMessages.slice(idx, idx + 1) // Simplified
      })
    })

    // Simpler approach: pair user with subsequent assistants
    const pairedMessages: { user: Message; assistants: Message[] }[] = []
    let currentUser: Message | null = null
    let currentAssistants: Message[] = []

    messages.forEach(m => {
      if (m.role === 'user') {
        if (currentUser) {
          pairedMessages.push({ user: currentUser, assistants: currentAssistants })
        }
        currentUser = m
        currentAssistants = []
      } else if (m.role === 'assistant') {
        currentAssistants.push(m)
      }
    })
    if (currentUser) {
      pairedMessages.push({ user: currentUser, assistants: currentAssistants })
    }

    // 获取模型映射
    const modelMap = new Map(mockModels.map(m => [m.id, m]))

    // 获取自适应网格列数：多模型根据实际数量+屏幕宽度，单模型永远1列
    const getGridCols = (count: number) => {
      if (count <= 1) return 'grid gap-4 grid-cols-1'
      if (count === 2) return 'grid gap-4 grid-cols-1 sm:grid-cols-2'
      if (count === 3) return 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      return 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 对话标题栏 */}
        <div className="flex items-center gap-3 pl-14 md:pl-5 pr-5 py-3 border-b border-border shrink-0">
          <div className="text-lg flex-shrink-0">{replyModel?.logo || selectedModels[0]?.logo || '💬'}</div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground truncate max-w-[400px]">
              {activeConversation?.title || '新对话'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedModels.length === 1 ? '1个模型' : `多模型对话 · ${selectedModels.length} 个模型`}
            </p>
          </div>
          {replyModel?.type === 'chat' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setReplyModel(null)}
            >
              切换回多模型
            </Button>
          )}
        </div>

        {/* 消息内容区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-6 space-y-8">
            {pairedMessages.length > 0 ? (
              pairedMessages.map((pair, idx) => {
                const nModels = pair.assistants.length || selectedModels.length

                return (
                  <div key={pair.user.id} className="space-y-4">
                    {/* 用户消息 */}
                    {pair.user.contentType === 'image' || pair.user.contentType === 'video' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] w-fit">
                          <p className="text-sm text-foreground mb-2">{pair.user.userPrompt}</p>
                          {pair.user.parameters && (
                            <div className="flex gap-2 flex-wrap mb-2">
                              {pair.user.contentType === 'image' && (
                                <>
                                  {pair.user.parameters.ratio && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.ratio}</Badge>
                                  )}
                                  {pair.user.parameters.count && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.count}张</Badge>
                                  )}
                                  {pair.user.parameters.quality && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.quality}</Badge>
                                  )}
                                </>
                              )}
                              {pair.user.contentType === 'video' && (
                                <>
                                  {pair.user.parameters.duration && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.duration}s</Badge>
                                  )}
                                  {pair.user.parameters.ratio && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.ratio}</Badge>
                                  )}
                                  {pair.user.parameters.resolution && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.resolution}</Badge>
                                  )}
                                  {pair.user.parameters.count && (
                                    <Badge variant="secondary" className="text-xs">{pair.user.parameters.count}个</Badge>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                          {pair.user.referenceImages && pair.user.referenceImages.length > 0 && (
                            <div className="flex gap-2">
                              {pair.user.referenceImages.map((img: string, refIdx: number) => (
                                <img key={refIdx} src={img} alt="ref" className="w-10 h-10 rounded object-cover" />
                              ))}
                            </div>
                          )}
                          {pair.user.referenceAssets && (
                            <div className="flex gap-2 mt-2">
                              {pair.user.referenceAssets.images?.map((img: string, refIdx: number) => (
                                <img key={`img-${refIdx}`} src={img} alt="ref" className="w-10 h-10 rounded object-cover" />
                              ))}
                              {pair.user.referenceAssets.videos?.map((_vid: string, refIdx: number) => (
                                <div key={`vid-${refIdx}`} className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-semibold">视</div>
                              ))}
                              {pair.user.referenceAssets.audios?.map((_aud: string, refIdx: number) => (
                                <div key={`aud-${refIdx}`} className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-semibold">音</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="max-w-[72%] rounded-lg bg-primary text-primary-foreground px-4 py-2.5">
                          <p className="text-sm whitespace-pre-wrap">{pair.user.content}</p>
                          {pair.user.modelIds && pair.user.modelIds.length > 0 && (
                            <p className="text-[10px] opacity-70 mt-1">
                              @ {pair.user.modelIds.map(id => mockModels.find(m => m.id === id)?.name).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 多模型加载提示 */}
                    {isLoading && selectedModels.length > 1 && pair.assistants.length < selectedModels.length && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1 mb-2">
                        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        正在调取多个模型回复...
                      </div>
                    )}

                    {/* AI 回复卡片网格 */}
                    {pair.assistants.length > 0 && (
                      <div className={getGridCols(nModels)}>
                        {pair.assistants.map((assistantMsg) => {
                          const model = modelMap.get(assistantMsg.modelId || '')
                          if (!model) return null
                          return (
                            <ModelResponseCard
                              key={assistantMsg.id}
                              model={model}
                              message={assistantMsg}
                              onlineSearch={assistantMsg.onlineSearch}
                              deepThinking={assistantMsg.deepThinking}
                              onReply={nModels > 1 && !replyModel ? handleReplyToModel : undefined}
                              onRegenerate={handleRegenerate}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Loading skeleton */}
                    {isLoading && pair.assistants.length === 0 && (
                      <div className={getGridCols(selectedModels.length)}>
                        {selectedModels.map(model => (
                          <div key={model.id} className="rounded-lg border border-border bg-card p-4 space-y-3 animate-pulse">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-muted" />
                              <div className="h-3 bg-muted rounded w-24" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-2 bg-muted rounded w-full" />
                              <div className="h-2 bg-muted rounded w-3/4" />
                              <div className="h-2 bg-muted rounded w-1/2" />
                            </div>
                            <div className="text-xs text-muted-foreground animate-pulse">思考中…</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <WorkspaceContent
                model={selectedModels[0] || null}
                messages={[]}
                isLoading={false}
              />
            )}
          </div>

        </div>

        {/* 底部输入区 - 对话 */}
        <div className="flex-shrink-0 border-t border-border bg-background">
          <InputArea
            model={replyModel || selectedModels[0] || null}
            selectedModels={selectedModels}
            replyModel={replyModel}
            onSendMessage={handleChatSendMessage}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onNavigate={(page) => setViewMode(page as ViewMode)}
            enableSearch={enableSearch}
            enableThinking={enableThinking}
            onToggleSearch={() => setEnableSearch(!enableSearch)}
            onToggleThinking={() => setEnableThinking(!enableThinking)}
          />
        </div>

        {/* 备案信息 */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 py-4">
          <span>闽ICP备08105208号-3</span>
          <span>闽公网安备35020302000061号</span>
        </div>
      </div>
    )
  }

  // ===== 历史全部页面 =====
  const renderHistoryAll = () => {
    const modelMap = new Map(mockModels.map(m => [m.id, m]))
    const sorted = [...conversations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const filtered = sorted.filter(h => {
      if (!historySearchQuery.trim()) return true
      const q = historySearchQuery.toLowerCase()
      return h.title.toLowerCase().includes(q) || h.preview.toLowerCase().includes(q)
    })

    const openRename = (id: string, title: string) => {
      setRenameChatId(id)
      setRenameNewTitle(title)
      setRenameDialogOpen(true)
    }

    const confirmRename = () => {
      if (renameChatId && renameNewTitle.trim()) {
        handleRenameChat(renameChatId, renameNewTitle.trim())
      }
      setRenameDialogOpen(false)
      setRenameChatId(null)
      setRenameNewTitle('')
    }

    const openDelete = (id: string) => {
      setDeleteChatId(id)
      setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
      if (deleteChatId) {
        handleDeleteChat(deleteChatId)
      }
      setDeleteDialogOpen(false)
      setDeleteChatId(null)
    }

    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 pl-12 md:pl-6 pr-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">全部对话</h2>
          <span className="text-xs text-muted-foreground">共 {filtered.length} 条</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索对话..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              {filtered.length > 0 ? (
                filtered.map((conv) => {
                  const firstModel = modelMap.get(conv.modelIds[0])
                  return (
                    <div
                      key={conv.id}
                      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => {
                        setHistorySearchQuery('')
                        handleSelectConversation(conv.id)
                      }}
                    >
                      <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${firstModel?.gradient || 'from-violet-500 to-indigo-600'} flex items-center justify-center text-white text-lg shadow-sm shrink-0`}>
                        {firstModel?.logo || '💬'}
                        {conv.modelIds.length > 1 && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                            {conv.modelIds.length}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.preview}</p>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {conv.createdAt.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem className="text-xs gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); openRename(conv.id, conv.title) }}>
                            <Pencil className="h-3.5 w-3.5" />重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-destructive gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); openDelete(conv.id) }}>
                            <Trash2 className="h-3.5 w-3.5" />删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  {historySearchQuery ? '未找到匹配的对话' : '暂无对话记录'}
                </div>
              )}
            </div>
          </div>

          {/* 备案信息 */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 pt-4">
            <span>闽ICP备08105208号-3</span>
            <span>闽公网安备35020302000061号</span>
          </div>
        </div>
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>重命名对话</DialogTitle></DialogHeader>
            <div className="py-4">
              <Input value={renameNewTitle} onChange={(e) => setRenameNewTitle(e.target.value)} placeholder="输入新名称" className="w-full" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') confirmRename() }} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>取消</Button>
              <Button onClick={confirmRename}>确认</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>删除对话</DialogTitle></DialogHeader>
            <div className="py-4"><p className="text-sm text-muted-foreground">确定要删除这个对话吗？此操作无法撤销。</p></div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
              <Button variant="destructive" onClick={confirmDelete}>删除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ===== 模型详情页 / 单模型对话启动器 =====
  const renderModelDetail = () => {
    if (selectedModels.length === 0) return null
    const model = selectedModels[0]
    const capabilities = modelCapabilities[model.id] || []
    const prompts = recommendedPrompts[model.id] || []

    const handleStartChat = (prompt?: string) => {
      setSelectedModels([model])
      setReplyModel(null)
      setViewMode('chat')
      const convId = `conv-${Date.now()}`
      const newConv: Conversation = {
        id: convId,
        title: prompt ? prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '') : `与 ${model.name} 的新对话`,
        preview: prompt || '',
        createdAt: new Date(),
        modelIds: [model.id],
        messages: [],
      }
      setActiveConversationId(convId)
      setConversations(prev => [newConv, ...prev])
      if (prompt) {
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: prompt,
            contentType: 'text',
            modelIds: [model.id],
            timestamp: new Date(),
          } as Message,
        ])
        setIsLoading(true)
        setTimeout(() => {
          const aiMessage: Message = {
            id: `msg-${Date.now()}-ai-${model.id}`,
            role: 'assistant',
            content: getMockResponse(model, prompt),
            contentType: 'markdown',
            modelId: model.id,
            timestamp: new Date(),
            responseTime: 1200,
            costPoints: model.costPoints,
            status: 'success',
          } as Message
          setMessages(prev => {
            const updated = [...prev, aiMessage]
            setConversations(prevConvs =>
              prevConvs.map(c => c.id === convId ? { ...c, messages: updated } : c)
            )
            setIsLoading(false)
            return updated
          })
        }, 1200)
      }
    }

    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center gap-3 pl-12 md:pl-6 pr-6 py-4 border-b border-border shrink-0">
          <div className="text-xl flex-shrink-0">{model.logo}</div>
          <h2 className="text-lg font-semibold text-foreground">{model.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 pt-12">
            {/* 模型头像和信息 */}
            <div className="text-center mb-8">
              <div className="text-5xl mx-auto mb-5">{model.logo}</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{model.name}</h2>
              <p className="text-sm text-muted-foreground mb-3 max-w-md mx-auto leading-relaxed">
                {model.description}
              </p>
              {/* 能力标签 */}
              {capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {capabilities.map((cap) => (
                    <Badge
                      key={cap}
                      variant="outline"
                      className="text-[10px] h-5 px-2 bg-secondary/50"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 预设提示词 */}
            {prompts.length > 0 && (
              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-3 text-center font-medium">尝试这些话题</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleStartChat(prompt)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/[0.03] transition-all text-sm text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 底部输入区 - 与首页共用组件 */}
        <div className="flex-shrink-0 border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <HomeInputArea
              model={model}
              defaultModelIds={[model.id]}
              onSend={(message) => handleStartChat(message)}
              enableSearch={enableSearch}
              enableThinking={enableThinking}
              onToggleSearch={() => setEnableSearch(!enableSearch)}
              onToggleThinking={() => setEnableThinking(!enableThinking)}
              onNavigate={(page) => setViewMode(page as ViewMode)}
            />
          </div>
        </div>

        {/* 备案信息 */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 py-4">
          <span>闽ICP备08105208号-3</span>
          <span>闽公网安备35020302000061号</span>
        </div>
      </div>
    )
  }

  // ===== 消费记录页 =====
  const renderBillingUsage = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {renderNavBar()}
      {/* 顶部栏 */}
      <div className="flex items-center shrink-0 h-14 pl-3 pr-4 md:px-4 border-b border-border relative">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('home')}
          className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          返回工作台
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-semibold text-foreground">
          消费记录
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <BillingUsage onBack={() => setViewMode('home')} />
        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-xs text-muted-foreground/60 py-6 px-4">
          <span>闽ICP备08105208号-3</span>
          <span>闽公网安备35020302000061号</span>
        </div>
      </div>
    </div>
  )

  // ===== 支付记录页 =====
  const renderBillingPayments = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {renderNavBar()}
      {/* 顶部栏 */}
      <div className="flex items-center shrink-0 h-14 pl-3 pr-4 md:px-4 border-b border-border relative">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('home')}
          className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          返回工作台
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-semibold text-foreground">
          支付记录
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <BillingPayments onBack={() => setViewMode('home')} />
        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-xs text-muted-foreground/60 py-6 px-4">
          <span>闽ICP备08105208号-3</span>
          <span>闽公网安备35020302000061号</span>
        </div>
      </div>
    </div>
  )

  // ===== MCP服务中心 =====
  const renderMCPCenter = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {renderNavBar()}
      {/* 顶部栏：返回工作台 + Tabs居中 + 右侧按钮 */}
      <div className="flex items-center shrink-0 h-14 pl-3 pr-4 md:px-4 border-b border-border gap-1 md:gap-2">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('home')}
          className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          返回工作台
        </button>
        {/* Tabs 居中 */}
        <div className="flex-1 flex justify-center min-w-0">
          <Tabs
            value={mcpActiveTab}
            onValueChange={(v) => setMcpActiveTab(v as 'my' | 'market')}
          >
            <TabsList>
              <TabsTrigger value="my" className="text-xs md:text-sm">我的MCP</TabsTrigger>
              <TabsTrigger value="market" className="text-xs md:text-sm">MCP市场</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* 右侧：提示文本 + 按钮（移动端隐藏） */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-sm text-orange-500 font-medium shrink-0">MCP免费体验名额正在发放中...</span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => mcpCenterRef.current?.openContactModal()}
          >
            联系MCP客服
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-700 hover:from-amber-100 hover:to-orange-100 hover:text-amber-800"
            asChild
          >
            <a
              href="https://www.chinaz.net/custom"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              企业级MCP定制
            </a>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MCPCenter
          ref={mcpCenterRef}
          activeTab={mcpActiveTab}
          onTabChange={setMcpActiveTab}
          onBack={() => setViewMode('home')}
        />
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 py-6">
          <span>闽ICP备08105208号-3</span>
          <span>闽公网安备35020302000061号</span>
        </div>
      </div>
    </div>
  )

  // ===== 移动端底部导航 =====


  // ===== 默认工作台 =====
  const isStandaloneView = viewMode === 'billing-usage' || viewMode === 'billing-payments' || viewMode === 'mcp-center'
  return (
    <div className="h-screen flex bg-background overflow-hidden">
        {!isStandaloneView && (
        <div className="hidden md:flex">
          <NavPanel
            isCollapsed={isNavCollapsed}
            onToggleCollapse={handleToggleNavCollapse}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onViewAll={handleViewAll}
            onOpenInvite={handleOpenInvite}
            onNavigate={(page) => setViewMode(page as ViewMode)}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
            conversations={conversations}
          />
        </div>
        )}

        {viewMode === 'home' && (
          <HomeContent
            onSendMessage={handleHomeSendMessage}
            onNavigateToModel={handleNavigateToModel}
            onToggleSearch={() => setEnableSearch(!enableSearch)}
            onToggleThinking={() => setEnableThinking(!enableThinking)}
            enableSearch={enableSearch}
            enableThinking={enableThinking}
          />
        )}

        {viewMode === 'chat' && selectedModels.length > 0 && renderChatContent()}
        {viewMode === 'history-all' && renderHistoryAll()}
        {viewMode === 'model-detail' && selectedModels.length > 0 && renderModelDetail()}
        {viewMode === 'billing-usage' && renderBillingUsage()}
        {viewMode === 'billing-payments' && renderBillingPayments()}
        {viewMode === 'mcp-center' && renderMCPCenter()}

        {!isStandaloneView && (
          <>
        {/* 移动端汉堡按钮 - 全局固定，浮动在所有视图左上角 */}
        <button
          className={`md:hidden fixed top-4 left-4 z-[60] w-9 h-9 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm border border-border shadow-sm hover:bg-accent transition-all duration-300 ${isMobileNavOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onClick={() => setIsMobileNavOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </button>
          </>
        )}

        {/* 移动端导航面板遮罩（所有视图通用） */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMobileNavOpen(false)}
        />
        <div
          className={`md:hidden fixed left-0 top-0 h-full z-50 transition-transform duration-300 shadow-lg ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <NavPanel
            isCollapsed={false}
            onToggleCollapse={() => setIsMobileNavOpen(false)}
            onNewChat={() => { setIsMobileNavOpen(false); handleNewChat() }}
            onSelectConversation={(convId) => { setIsMobileNavOpen(false); handleSelectConversation(convId) }}
            onViewAll={() => { setIsMobileNavOpen(false); handleViewAll() }}
            onOpenInvite={() => { setIsMobileNavOpen(false); handleOpenInvite() }}
            onNavigate={(page) => { setIsMobileNavOpen(false); setViewMode(page as ViewMode) }}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
            conversations={conversations}
          />
        </div>

        <LoginModal />
        <RechargeModal />
        <InviteDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} userId={user?.id} />
        <NewUserBenefitToast open={showNewUserBenefitToast} onClose={handleCloseNewUserBenefitToast} />
        <MCPQuickCreateModal />
        <MCPQuickConfigModal />
        <MCPServiceDetailModal />
      </div>
  )
}

// Mock AI 回复生成器
function getMockResponse(model: Model, userMessage: string): string {
  const shortMsg = userMessage.slice(0, 30)
  const responses: Record<string, (msg: string) => string> = {
    'deepseek-v4-pro': (msg) => `## 关于 "${msg}" 的分析\n\n基于深度推理模型的分析如下：\n\n### 核心要点\n1. 首先分析问题的关键需求\n2. 从多个维度进行逻辑推演\n3. 给出最优解决方案\n\n### 详细分析\n\nReact 是一个由 Meta 维护的用于构建用户界面的 JavaScript 库。自 2013 年开源以来，React 已经成为前端开发领域最受欢迎的框架之一。\n\n**虚拟 DOM 机制**\n\nReact 的核心创新在于其虚拟 DOM（Virtual DOM）机制。当状态发生变化时，React 不会直接操作真实的 DOM 树，而是先在内存中构建一个轻量级的虚拟 DOM 树，然后通过 Diff 算法计算新旧虚拟 DOM 之间的差异，最后批量更新真实 DOM。\n\n这种机制带来了两个显著优势：\n\n1. **性能优化**：批量更新避免了频繁的重排和重绘，显著提升页面渲染性能。\n2. **跨平台能力**：虚拟 DOM 是平台无关的 JavaScript 对象，使得 React Native 等框架可以将相同的组件模型渲染到 iOS、Android 等原生平台。\n\n**组件化架构**\n\nReact 采用组件化的开发模式。每个组件封装了自己的结构（JSX）、样式（CSS-in-JS 或 CSS Modules）和行为（Hooks/生命周期），可以像搭积木一样组合成复杂的用户界面。\n\n从 React 16.8 开始引入的 Hooks 彻底改变了组件的编写方式。开发者可以使用 useState、useEffect、useMemo 等 Hook 在函数组件中管理状态和副作用，代码更加简洁和可复用。\n\n**生态系统**\n\n围绕 React 建立的生态系统非常庞大，包括：\n- Next.js / Remix 等服务端渲染框架\n- Redux / Zustand / Jotai 等状态管理库\n- React Router 路由管理\n- React Query / SWR 数据请求\n- shadcn/ui / Ant Design 等 UI 组件库\n\n> 这是 DeepSeek V4 Pro 的典型回复风格，侧重逻辑推理和结构化输出。`,
    'minimax-m25': (msg) => `收到您的问题：「${msg}」\n\n让我从创意的角度来思考这个问题…\n\n这让我想到一个有趣的角度。从情感和故事性出发，我们可以这样来理解：每个问题背后都隐藏着一个等待被发现的叙事。\n\n### 创意思考方法论\n\n创意思考并非凭空而来的灵感闪现，而是一套可以学习和训练的系统化方法。以下是我总结的几个核心维度：\n\n**1. 发散思维（Divergent Thinking）**\n\n发散思维是创意的起点。面对一个问题，不要急于寻找唯一正确答案，而是尽可能多地生成不同的可能性。常见的发散思维技巧包括：\n- 头脑风暴（Brainstorming）：不加评判地快速生成大量想法\n- SCAMPER 法：替代、合并、调整、修改、他用、消除、重排\n- 随机词法：用一个随机词汇作为起点，强制建立关联\n\n**2. 跨界联想（Cross-domain Association）**\n\n许多突破性的创意来自于将不同领域的知识进行跨界组合。例如：\n- 仿生学：从自然界生物的结构和功能中获得工程设计灵感\n- 设计思维：将设计师的共情和迭代方法引入商业和管理\n- 游戏化：将游戏机制应用于教育、健康等非游戏场景\n\n**3. 约束驱动（Constraint-driven Creativity）**\n\n约束并非创意的敌人，恰恰相反，合理的约束常常能激发更有创造力的解决方案。Twitter 的 140 字限制催生了简洁有力的表达方式，俳句的 5-7-5 音节格式造就了独特的诗意美感。\n\n**4. 迭代精炼（Iterative Refinement）**\n\n伟大的创意很少一次性诞生。它们通常经历了一个\"粗糙原型 → 获得反馈 → 修改完善\"的迭代循环。这个过程需要勇气接受批评，也需要判断力分辨哪些反馈值得采纳。\n\n所以我的建议是，不妨换一个视角，把这个问题看作一次探索的起点。`,
    'glm-5-turbo': (msg) => `针对「${msg}」这个问题，我从以下角度进行分析：\n\n**技术层面**\n- 首先需要明确问题的技术边界\n- 然后选择合适的方法论\n- 最后给出可落地的方案\n\n**架构设计**\n\n一个优秀的软件架构应该遵循以下原则：\n\n1. **单一职责原则（SRP）**：每个模块只负责一个功能领域，降低耦合度。\n2. **开闭原则（OCP）**：对扩展开放，对修改关闭。通过抽象和多态实现功能扩展而不修改现有代码。\n3. **依赖倒置（DIP）**：高层模块不应依赖低层模块，二者都应依赖抽象。\n\n在实际项目中，我们推荐采用分层架构：\n- 表示层（Presentation Layer）：负责 UI 渲染和用户交互\n- 业务逻辑层（Business Logic Layer）：处理核心业务规则\n- 数据访问层（Data Access Layer）：封装数据库操作\n\n**数据流管理**\n\n对于复杂的单页应用，状态管理是一个关键挑战。推荐方案包括：\n- 小型项目：React Context + useReducer\n- 中型项目：Zustand 或 Jotai\n- 大型项目：Redux Toolkit + RTK Query\n\n**性能优化**\n\n常见的前端性能优化策略：\n- 代码分割（Code Splitting）：使用 React.lazy 和 Suspense\n- 虚拟列表（Virtual List）：使用 react-window 处理长列表\n- 缓存策略：Service Worker + HTTP 缓存 + 应用层缓存\n- 图片优化：WebP 格式、懒加载、CDN 分发\n\n**总结**\n\n综合来看，这个问题的关键在于找到效率与质量的最佳平衡点。技术选型不是追求最新最热，而是选择最适合当前团队能力和业务需求的方案。`,
    'claude-haiku-45': (msg) => `好的，让我来思考「${msg}」这个问题。\n\n从多个角度来看：\n\n1. **安全性考虑** — 我们需要确保方案符合伦理和安全标准\n2. **实用性评估** — 方案需要在实践中可操作\n3. **用户体验** — 最终产出应该对用户友好\n\n### 深入分析\n\n在人工智能快速发展的今天，我们需要在技术创新和责任伦理之间找到平衡点。以下是我的一些深入思考：\n\n**AI 治理框架**\n\n一个健全的 AI 治理框架应该包含以下层次：\n\n- 数据治理：确保训练数据的质量、多样性和隐私合规\n- 模型治理：建立模型评估、审计和可解释性标准\n- 应用治理：定义 AI 系统的使用边界和责任归属\n- 持续监控：部署后持续监测模型性能和偏差\n\n**实践建议**\n\n对于正在开发 AI 产品的团队，我建议：\n\n1. 从项目初期就嵌入伦理审查环节\n2. 建立多元化的评估指标体系\n3. 保持与用户的开放沟通渠道\n4. 定期进行红队测试和安全审计\n\n希望这些思考对你有所帮助！`,
  }

  const fn = responses[model.id]
  if (fn) return fn(userMessage)
  return `这是 ${model.name} 对"${shortMsg}..."的回复。`
}

// 根据 conversation 生成 mock 对话消息
function generateConversationMessages(conv: Conversation): Message[] {
  let models = mockModels.filter(m => conv.modelIds.includes(m.id))
  const userContent = conv.title
  const timestamp = new Date(conv.createdAt)

  // 图片/视频模型禁止多模型：只保留第一个非聊天模型，移除其他
  const nonChatModels = models.filter(m => m.type !== 'chat')
  if (nonChatModels.length > 0 && models.length > 1) {
    models = nonChatModels.slice(0, 1)
  }

  const firstModel = models[0]
  const effectiveModelIds = models.map(m => m.id)

  // 根据模型类型生成不同的用户消息
  const userMessage: Message = (() => {
    const base = {
      id: `hist-${conv.id}-user`,
      role: 'user' as const,
      modelIds: effectiveModelIds,
      timestamp,
    }
    if (firstModel?.type === 'image') {
      return {
        ...base,
        contentType: 'image',
        userPrompt: userContent,
        parameters: { ratio: '16:9', count: 2, quality: 'high', optimizePrompt: true },
        referenceImages: ['https://placehold.co/120x120/e2e8f0/475569?text=Ref'],
      } as Message
    }
    if (firstModel?.type === 'video') {
      return {
        ...base,
        contentType: 'video',
        userPrompt: userContent,
        parameters: { duration: 5, ratio: '16:9', resolution: '1080p', count: 1, mode: 'quality' },
        referenceAssets: { images: ['https://placehold.co/120x120/e2e8f0/475569?text=Ref'] },
      } as Message
    }
    return { ...base, content: userContent, contentType: 'text' } as Message
  })()

  const assistantMessages: Message[] = models.map((model, index) => {
    // 根据模型类型生成不同内容
    if (model.type === 'image') {
      return {
        id: `hist-${conv.id}-ai-${model.id}`,
        role: 'assistant',
        contentType: 'image',
        modelId: model.id,
        images: ['https://placehold.co/512x320/e2e8f0/475569?text=GPT-Image-2+Sample'],
        timestamp: new Date(timestamp.getTime() + 1000 + index * 500),
        responseTime: 1500,
        costPoints: model.costPoints,
        status: 'success',
      } as Message
    } else if (model.type === 'video') {
      return {
        id: `hist-${conv.id}-ai-${model.id}`,
        role: 'assistant',
        contentType: 'video',
        modelId: model.id,
        videos: ['https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4'],
        duration: '0:05',
        resolution: '1080p',
        timestamp: new Date(timestamp.getTime() + 1000 + index * 500),
        responseTime: 2000,
        costPoints: model.costPoints,
        status: 'success',
      } as Message
    } else {
      return {
        id: `hist-${conv.id}-ai-${model.id}`,
        role: 'assistant',
        content: getMockResponse(model, userContent),
        contentType: models.length > 1 ? 'text' : 'markdown',
        modelId: model.id,
        timestamp: new Date(timestamp.getTime() + 1000 + index * 500),
        responseTime: 800 + index * 1200 + Math.random() * 1500,
        costPoints: model.costPoints,
        status: 'success',
      } as Message
    }
  })

  return [userMessage, ...assistantMessages]
}