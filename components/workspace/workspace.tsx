'use client'

import { useState, useCallback } from 'react'
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
import { NavPanel } from './nav-panel'
import { HomeContent } from './home-content'
import { WorkspaceContent } from './workspace-content'
import { InputArea } from './input-area'
import { ModelResponseCard } from './model-response-card'
import { InviteDialog } from './invite-dialog'
import { LoginModal } from '@/components/auth/login-modal'
import { RechargeModal } from '@/components/auth/recharge-modal'
import { BillingUsage } from './billing-usage'
import { BillingPayments } from './billing-payments'
import { CategoryPage } from './category-page'
import { MCPCenter } from './mcp-center'
import { MCPQuickCreateModal } from './mcp-quick-create-modal'
import { MCPQuickConfigModal } from './mcp-quick-config-modal'
import { MCPServiceDetailModal } from './mcp-service-detail-modal'
import { useAuth } from '@/contexts/auth-context'
import { MCPProvider } from '@/contexts/mcp-context'
import {
  mockModels,
  mockConversations,
  modelCapabilities,
  recommendedPrompts,
  type Model,
  type Message,
  type Conversation,
} from '@/lib/mock-data'
import { Search, MoreHorizontal, Pencil, Trash2, Plus, MessageSquare, UserPlus, Sparkles, ArrowUp, Globe, Brain } from 'lucide-react'

type ViewMode = 'home' | 'chat' | 'history-all' | 'category' | 'model-detail' | 'billing-usage' | 'billing-payments' | 'mcp-center'

export function Workspace() {
  const { isLoggedIn, setShowLoginModal, user } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('chat')
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameChatId, setRenameChatId] = useState<string | null>(null)
  const [renameNewTitle, setRenameNewTitle] = useState('')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  // V1.2 多模型状态
  const [selectedModels, setSelectedModels] = useState<Model[]>([])
  const [enableSearch, setEnableSearch] = useState(false)
  const [enableThinking, setEnableThinking] = useState(false)
  // 回复模式：单模型对话
  const [replyModel, setReplyModel] = useState<Model | null>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

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

  // 查看分类
  const handleViewCategory = useCallback((category: string) => {
    setCategoryFilter(category)
    setViewMode('category')
  }, [])

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

    setSelectedModels(models)
    setReplyModel(null)

    const timestamp = new Date()
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      contentType: 'text',
      modelIds,
      timestamp,
      onlineSearch: enableSearch,
      deepThinking: enableThinking,
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
      modelIds,
      messages: newMessages,
    }
    setActiveConversationId(convId)
    setConversations(prev => [newConv, ...prev])
    setViewMode('chat')
    setIsLoading(true)

    // 并行加载所有模型回复
    models.forEach((model, index) => {
      const delay = 800 + index * 1200
      const responseTime = 800 + index * 1200 + Math.random() * 1500

      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai-${model.id}`,
          role: 'assistant',
          content: getMockResponse(model, message),
          contentType: models.length > 1 ? 'text' : 'markdown',
          modelId: model.id,
          onlineSearch: enableSearch,
          deepThinking: enableThinking,
          timestamp: new Date(),
          responseTime,
          costPoints: model.costPoints,
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
            m.role === 'assistant' && modelIds.includes(m.modelId || '')
          )
          if (respondedModels.length >= models.length) {
            setIsLoading(false)
          }
          return updated
        })
      }, delay)
    })
  }, [isLoggedIn, setShowLoginModal, enableSearch, enableThinking])

  // V1.2 从首页选择模型
  const handleSelectModelFromHome = useCallback((model: Model) => {
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
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      contentType: 'text',
      modelIds,
      onlineSearch: enableSearch,
      deepThinking: enableThinking,
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
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai-${model.id}`,
          role: 'assistant',
          content: getMockResponse(model, message),
          contentType: targetModels.length > 1 ? 'text' : 'markdown',
          modelId: model.id,
          onlineSearch: enableSearch,
          deepThinking: enableThinking,
          timestamp: new Date(),
          responseTime,
          costPoints: model.costPoints,
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
  }, [isLoggedIn, setShowLoginModal, selectedModels, replyModel, enableSearch, enableThinking])

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

    return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 对话标题栏 */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0">
          {replyModel ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-base">
                {replyModel.logo}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">{replyModel.name}</h2>
                <p className="text-xs text-muted-foreground">单模型对话模式</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setReplyModel(null)}
              >
                切换回多模型
              </Button>
            </>
          ) : (
            <>
              <div className="flex -space-x-2">
                {selectedModels.slice(0, 4).map(m => (
                  <div
                    key={m.id}
                    className="w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-sm"
                  >
                    {m.logo}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground">
                  {selectedModels.map(m => m.name).join('、')}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedModels.length === 1 ? '1个模型' : `多模型对话 · ${selectedModels.length} 个模型`}
                </p>
              </div>
            </>
          )}
          {/* 联网搜索/深度思考开关 */}
          <div className="flex items-center gap-1">
            <Button
              variant={enableSearch ? 'default' : 'ghost'}
              size="icon-sm"
              className="h-8 w-8"
              onClick={() => setEnableSearch(!enableSearch)}
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant={enableThinking ? 'default' : 'ghost'}
              size="icon-sm"
              className="h-8 w-8"
              onClick={() => setEnableThinking(!enableThinking)}
            >
              <Brain className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 消息内容区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
            {pairedMessages.length > 0 ? (
              pairedMessages.map((pair, idx) => {
                const nModels = pair.assistants.length || selectedModels.length
                const gridCols = Math.min(nModels, 4)

                return (
                  <div key={pair.user.id} className="space-y-4">
                    {/* 用户消息 */}
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

                    {/* AI 回复卡片网格 */}
                    {pair.assistants.length > 0 && (
                      <div
                        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
                        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                      >
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
                      <div
                        className="grid gap-4 grid-cols-1 sm:grid-cols-2"
                        style={{ gridTemplateColumns: `repeat(${Math.min(selectedModels.length, 4)}, 1fr)` }}
                      >
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

        {/* 底部输入区 */}
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
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
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
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                        {firstModel?.logo || '💬'}
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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

  // ===== 分类页 =====
  const renderCategoryPage = () => (
    <CategoryPage
      initialTab={categoryFilter}
      onSelectModel={(model) => {
        setSelectedModels([model])
        setReplyModel(null)
        setViewMode('chat')
        setMessages([])
        const convId = `conv-${Date.now()}`
        const newConv: Conversation = {
          id: convId,
          title: `与 ${model.name} 的新对话`,
          preview: '',
          createdAt: new Date(),
          modelIds: [model.id],
          messages: [],
        }
        setActiveConversationId(convId)
        setConversations(prev => [newConv, ...prev])
      }}
    />
  )

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
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
            {model.logo}
          </div>
          <h2 className="text-lg font-semibold text-foreground">{model.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 pt-12">
            {/* 模型头像和信息 */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl mx-auto mb-5">
                {model.logo}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{model.name}</h2>
              <p className="text-sm text-muted-foreground mb-3 max-w-md mx-auto leading-relaxed">
                {model.description}
              </p>
              {/* 类型标签 */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge variant="secondary" className="text-[10px]">
                  {model.type === 'chat' ? '聊天' : model.type === 'image' ? '图片' : '视频'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  单次消耗 <span className="font-medium text-foreground">{model.costPoints}</span> 智点
                </span>
              </div>
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
                <div className="space-y-2">
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

        {/* 底部输入区 - 自由输入 */}
        <div className="flex-shrink-0 border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="bg-card rounded-lg border border-border shadow-sm p-3 flex items-end gap-2" style={{ backgroundColor: '#F7F8FB' }}>
              <textarea
                className="flex-1 border-0 shadow-none resize-none focus-visible:ring-0 focus:outline-none p-0 text-sm leading-relaxed bg-transparent overflow-y-auto py-1"
                style={{ minHeight: '24px', maxHeight: '144px' }}
                placeholder={`向 ${model.name} 提问...`}
                rows={1}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement
                  el.style.height = 'auto'
                  el.style.height = `${Math.min(el.scrollHeight, 144)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    const text = (e.target as HTMLTextAreaElement).value.trim()
                    if (text) {
                      handleStartChat(text)
                      ;(e.target as HTMLTextAreaElement).value = ''
                    }
                  }
                }}
              />
              <Button
                size="icon-sm"
                className="h-8 w-8 rounded-full shrink-0"
                onClick={(e) => {
                  const textarea = (e.target as HTMLElement).parentElement?.querySelector('textarea')
                  if (textarea) {
                    const text = textarea.value.trim()
                    if (text) {
                      handleStartChat(text)
                      textarea.value = ''
                    }
                  }
                }}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== 消费记录页 =====
  const renderBillingUsage = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <BillingUsage onBack={() => {}} />
      </div>
    </div>
  )

  // ===== 支付记录页 =====
  const renderBillingPayments = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <BillingPayments onBack={() => {}} />
      </div>
    </div>
  )

  // ===== MCP服务中心 =====
  const renderMCPCenter = () => (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MCPCenter onBack={() => {}} />
      </div>
    </div>
  )

  // ===== 移动端底部导航 =====


  // ===== 默认工作台 =====
  return (
    <MCPProvider>
      <div className="h-screen flex bg-background overflow-hidden pb-14 md:pb-0">
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

        {viewMode === 'home' && (
          <HomeContent
            onSendMessage={handleHomeSendMessage}
            onSelectModel={handleSelectModelFromHome}
            onViewCategory={handleViewCategory}
            onViewAllHistory={handleViewAll}
            onToggleSearch={() => setEnableSearch(!enableSearch)}
            onToggleThinking={() => setEnableThinking(!enableThinking)}
            enableSearch={enableSearch}
            enableThinking={enableThinking}
          />
        )}

        {viewMode === 'chat' && selectedModels.length > 0 && renderChatContent()}
        {viewMode === 'history-all' && renderHistoryAll()}
        {viewMode === 'category' && renderCategoryPage()}
        {viewMode === 'model-detail' && selectedModels.length > 0 && renderModelDetail()}
        {viewMode === 'billing-usage' && renderBillingUsage()}
        {viewMode === 'billing-payments' && renderBillingPayments()}
        {viewMode === 'mcp-center' && renderMCPCenter()}

        {/* 移动端底部导航 */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background border-t border-border flex items-center justify-around z-50">
          <button onClick={() => setViewMode('home')} className="flex flex-col items-center gap-0.5">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">首页</span>
          </button>
          <button onClick={handleNewChat} className="flex flex-col items-center gap-0.5">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">新建</span>
          </button>
          <button onClick={handleViewAll} className="flex flex-col items-center gap-0.5">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">对话</span>
          </button>
          <button onClick={handleOpenInvite} className="flex flex-col items-center gap-0.5">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">邀请</span>
          </button>
        </div>

        <LoginModal />
        <RechargeModal />
        <InviteDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} userId={user?.id} />
        <MCPQuickCreateModal />
        <MCPQuickConfigModal />
        <MCPServiceDetailModal />
      </div>
    </MCPProvider>
  )
}

// Mock AI 回复生成器
function getMockResponse(model: Model, userMessage: string): string {
  const responses: Record<string, (msg: string) => string> = {
    'deepseek-v4-pro': (msg) => `## 关于 "${msg}" 的分析\n\n基于深度推理模型的分析如下：\n\n### 核心要点\n1. 首先分析问题的关键需求\n2. 从多个维度进行逻辑推演\n3. 给出最优解决方案\n\n> 这是 DeepSeek V4 Pro 的典型回复风格，侧重逻辑推理和结构化输出。`,
    'minimax-m25': (msg) => `收到您的问题：「${msg}」\n\n让我从创意的角度来思考这个问题…\n\n这让我想到一个有趣的角度。从情感和故事性出发，我们可以这样来理解：每个问题背后都隐藏着一个等待被发现的叙事。\n\n所以我的建议是，不妨换一个视角，把这个问题看作一次探索的起点。`,
    'glm-5-turbo': (msg) => `针对「${msg}」这个问题，我从以下角度进行分析：\n\n**技术层面**\n- 首先需要明确问题的技术边界\n- 然后选择合适的方法论\n- 最后给出可落地的方案\n\n**总结**\n综合来看，这个问题的关键在于找到效率与质量的最佳平衡点。`,
    'claude-haiku-45': (msg) => `好的，让我来思考「${msg}」这个问题。\n\n从多个角度来看：\n\n1. **安全性考虑** — 我们需要确保方案符合伦理和安全标准\n2. **实用性评估** — 方案需要在实践中可操作\n3. **用户体验** — 最终产出应该对用户友好\n\n希望这些思考对你有所帮助！`,
  }

  const fn = responses[model.id]
  if (fn) return fn(userMessage)
  return `这是 ${model.name} 对"${userMessage.slice(0, 30)}..."的回复。`
}

// 根据 conversation 生成 mock 对话消息
function generateConversationMessages(conv: Conversation): Message[] {
  const models = mockModels.filter(m => conv.modelIds.includes(m.id))
  const userContent = conv.title
  const timestamp = new Date(conv.createdAt)

  const userMessage: Message = {
    id: `hist-${conv.id}-user`,
    role: 'user',
    content: userContent,
    contentType: 'text',
    modelIds: conv.modelIds,
    timestamp,
  } as Message

  const assistantMessages: Message[] = models.map((model, index) => {
    // 根据模型类型生成不同内容
    if (model.type === 'image') {
      return {
        id: `hist-${conv.id}-ai-${model.id}`,
        role: 'assistant',
        contentType: 'image',
        modelId: model.id,
        images: ['https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=512&h=320&fit=crop'],
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