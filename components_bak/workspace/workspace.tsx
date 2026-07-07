'use client'

import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { WorkspaceContent } from './workspace-content'
import { InputArea } from './input-area'
import { SessionToolbar } from './session-toolbar'
import { HistoryDrawer } from './history-drawer'
import { LoginModal } from '@/components/auth/login-modal'
import { RechargeModal } from '@/components/auth/recharge-modal'
import { BillingUsage } from './billing-usage'
import { BillingPayments } from './billing-payments'
import { MCPCenter } from './mcp-center'
import { MCPQuickCreateModal } from './mcp-quick-create-modal'
import { MCPQuickConfigModal } from './mcp-quick-config-modal'
import { MCPServiceDetailModal } from './mcp-service-detail-modal'
import { useAuth } from '@/contexts/auth-context'
import { MCPProvider, useMCP } from '@/contexts/mcp-context'
import { mockModels, mockChatMessages, mockImageMessages, mockVideoMessages, mockChatHistories, mockMCPMessages, type Model, type Message } from '@/lib/mock-data'

export function Workspace() {
  const { isLoggedIn, setShowLoginModal } = useAuth()
  const [selectedModel, setSelectedModel] = useState<Model | null>(mockModels[0])
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMCPMessages[mockModels[0].id] || mockChatMessages[mockModels[0].id] || [])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [chatHistories, setChatHistories] = useState(mockChatHistories)

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const handleBackToWorkspace = () => {
    setCurrentPage(null)
  }

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleNewChat = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setMessages([])
  }

  const handleSelectChat = (chatId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    console.log('Selected chat:', chatId)
  }

  const handleRenameChat = (chatId: string, newTitle: string) => {
    if (!selectedModel) return
    
    setChatHistories((prev) => {
      const modelHistories = prev[selectedModel.id] || []
      const updatedHistories = modelHistories.map((history) =>
        history.id === chatId ? { ...history, title: newTitle } : history
      )
      return {
        ...prev,
        [selectedModel.id]: updatedHistories,
      }
    })
  }

  const handleDeleteChat = (chatId: string) => {
    if (!selectedModel) return
    
    setChatHistories((prev) => {
      const modelHistories = prev[selectedModel.id] || []
      const updatedHistories = modelHistories.filter((history) => history.id !== chatId)
      return {
        ...prev,
        [selectedModel.id]: updatedHistories,
      }
    })
  }

  const handleSendMessage = (message: string, params?: any, referenceAssets?: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    if (!message.trim()) return
    
    const timestamp = new Date()
    
    if (selectedModel?.type === 'image') {
      const userMessage: Message = {
        id: `img-${Date.now()}`,
        role: 'user',
        contentType: 'image',
        userPrompt: message,
        parameters: params || {
          ratio: 'auto',
          count: 1,
          quality: 'auto',
          optimizePrompt: true,
        },
        referenceImages: referenceAssets || [],
        timestamp,
      } as any
      
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      setTimeout(() => {
        const imageCount = params?.count || 1
        const images = Array(imageCount)
          .fill(null)
          .map((_, i) => {
            const seeds = ['photo-1579783902614-e3fb5141b0cb', 'photo-1611339555312-e607c25352ca', 'photo-1497366216548-37526070297c', 'photo-1486406146926-c627a92ad1ab']
            const seed = seeds[i % seeds.length]
            const size = params?.ratio === '16:9' || params?.ratio === '9:16' ? 'w=512&h=320' : 'w=256&h=256'
            return `https://images.unsplash.com/${seed}?${size}&fit=crop`
          })

        const aiMessage: Message = {
          id: `img-${Date.now()}-ai`,
          role: 'assistant',
          contentType: 'image',
          images,
          timestamp: new Date(),
        } as any
        
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    } else if (selectedModel?.type === 'video') {
      const userMessage: Message = {
        id: `vid-${Date.now()}`,
        role: 'user',
        contentType: 'video',
        userPrompt: message,
        parameters: params || {
          duration: 5,
          ratio: '16:9',
          resolution: '1080p',
          count: 1,
          mode: 'quality',
        },
        referenceAssets: referenceAssets || {},
        timestamp,
      } as any
      
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      setTimeout(() => {
        const videoCount = params?.count || 1
        const videos = Array(videoCount)
          .fill(null)
          .map(() => 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4')

        const aiMessage: Message = {
          id: `vid-${Date.now()}-ai`,
          role: 'assistant',
          contentType: 'video',
          videos,
          duration: params?.duration ? `0:${String(params.duration).padStart(2, '0')}` : '0:05',
          resolution: params?.resolution || '1080p',
          timestamp: new Date(),
        } as any
        
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 2000)
    } else {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        contentType: 'text',
        timestamp,
      } as any
      
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: `这是对"${message}"的回复。我正在模拟流式输出效果。在实际应用中，这些内容会通过 API 逐字符流式接收，创建更加自然流畅的对话体验。`,
          contentType: 'text',
          timestamp: new Date(),
        } as any
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    }
  }

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model)
    if (model.type === 'image') {
      setMessages(mockImageMessages[model.id] || [])
    } else if (model.type === 'video') {
      setMessages(mockVideoMessages[model.id] || [])
    } else {
      // 对于 minimax-m25，使用 MCP 消息
      setMessages(mockMCPMessages[model.id] || mockChatMessages[model.id] || [])
    }
    setInputValue('')
  }

  // 如果在子页面，渲染对应页面
  if (currentPage === 'billing-usage') {
    return (
      <MCPProvider>
        <div className="h-screen flex flex-col bg-background">
          <Header onNavigate={handleNavigate} />
          <div className="flex-1 pt-[60px] overflow-y-auto">
            <BillingUsage onBack={handleBackToWorkspace} />
          </div>
          <LoginModal />
          <RechargeModal />
          <MCPQuickCreateModal />
          <MCPQuickConfigModal />
          <MCPServiceDetailModal />
        </div>
      </MCPProvider>
    )
  }

  if (currentPage === 'billing-payments') {
    return (
      <MCPProvider>
        <div className="h-screen flex flex-col bg-background">
          <Header onNavigate={handleNavigate} />
          <div className="flex-1 pt-[60px] overflow-y-auto">
            <BillingPayments onBack={handleBackToWorkspace} />
          </div>
          <LoginModal />
          <RechargeModal />
          <MCPQuickCreateModal />
          <MCPServiceDetailModal />
          <MCPQuickConfigModal />
        </div>
      </MCPProvider>
    )
  }

  if (currentPage === 'mcp-center') {
    return (
      <MCPProvider>
        <div className="h-screen flex flex-col bg-background">
          <Header onNavigate={handleNavigate} />
          <div className="flex-1 pt-[60px] overflow-y-auto">
            <MCPCenter onBack={handleBackToWorkspace} />
          </div>
          <LoginModal />
          <RechargeModal />
          <MCPQuickCreateModal />
          <MCPQuickConfigModal />
          <MCPServiceDetailModal />
        </div>
      </MCPProvider>
    )
  }

  // 默认工作台
  return (
    <MCPProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* 顶部导航栏 */}
        <Header onNavigate={handleNavigate} />

        {/* 主内容区域 */}
        <div className="flex flex-1 pt-[60px] overflow-hidden">
          {/* 左侧栏 */}
          <Sidebar
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* 右侧核心工作区 */}
          <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
            {/* 会话浮动按钮组 */}
            <SessionToolbar
              model={selectedModel}
              onNewChat={handleNewChat}
              onOpenHistory={() => setIsHistoryDrawerOpen(true)}
            />

            {/* 内容展示区 */}
            <div className="flex-1 overflow-y-auto">
              <WorkspaceContent
                model={selectedModel}
                messages={messages}
                isLoading={isLoading}
                onSelectPrompt={handleSelectPrompt}
              />
            </div>

            {/* 底部固定输入区 */}
            <div className="flex-shrink-0 border-t border-border bg-background">
              <InputArea 
                model={selectedModel} 
                onSendMessage={handleSendMessage}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>

        {/* 历史对话弹窗 */}
        <HistoryDrawer
          model={selectedModel}
          isOpen={isHistoryDrawerOpen}
          onClose={() => setIsHistoryDrawerOpen(false)}
          onSelectChat={handleSelectChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          histories={chatHistories}
        />

        {/* 登录弹窗 */}
        <LoginModal />

        {/* 充值弹窗 */}
        <RechargeModal />

        {/* MCP相关弹窗 */}
        <MCPQuickCreateModal />
        <MCPQuickConfigModal />
        <MCPServiceDetailModal />
      </div>
    </MCPProvider>
  )
}