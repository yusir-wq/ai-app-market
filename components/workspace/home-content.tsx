'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ModelListRow } from './model-list-row'
import { MCPServiceSelector } from './mcp-service-selector'
import { mockModels, type Model } from '@/lib/mock-data'
import { useAuth } from '@/contexts/auth-context'
import { ArrowUp, Globe, Brain, Paperclip, AtSign, MessageSquare, Image, Video, Sparkles } from 'lucide-react'

interface HomeContentProps {
  onSendMessage: (message: string, modelIds: string[]) => void
  onSelectModel: (model: Model) => void
  onViewCategory: (category: string) => void
  onViewAllHistory: () => void
  onToggleSearch: () => void
  onToggleThinking: () => void
  enableSearch: boolean
  enableThinking: boolean
}

export function HomeContent({
  onSendMessage,
  onSelectModel,
  onViewCategory,
  onViewAllHistory,
  onToggleSearch,
  onToggleThinking,
  enableSearch,
  enableThinking,
}: HomeContentProps) {
  const { isLoggedIn, setShowLoginModal } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const LINE_HEIGHT = 24 // 单行高度 px（text-sm leading-relaxed）
  const MAX_LINES = 6

  const chatModels = useMemo(() => mockModels.filter(m => m.type === 'chat'), [])
  const imageModels = useMemo(() => mockModels.filter(m => m.type === 'image'), [])
  const videoModels = useMemo(() => mockModels.filter(m => m.type === 'video'), [])

  // 自动调整 textarea 高度
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const newHeight = Math.min(el.scrollHeight, LINE_HEIGHT * MAX_LINES)
    el.style.height = `${newHeight}px`
  }, [])

  useEffect(() => {
    autoResize()
  }, [inputValue, autoResize])

  const handleSend = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    if (!inputValue.trim()) return
    onSendMessage(inputValue.trim(), chatModels.map(m => m.id))
    setInputValue('')
  }

  return (
    <div className="flex-1 flex flex-col items-center min-w-0 overflow-y-auto bg-background">
      <div className="flex flex-col items-center w-full max-w-[720px] mx-auto px-4 md:px-6 pt-[150px] pb-[150px]">
        {/* 品牌标题 */}
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10 shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">AI 应用广场</h1>
        </div>

        {/* 中心输入区 */}
        <div className="w-full rounded-lg border border-border shadow-sm p-4 mb-6 shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入问题，选择模型开始对话..."
            rows={1}
            className="w-full border-0 shadow-none resize-none focus-visible:ring-0 focus:outline-none p-0 text-sm leading-relaxed bg-transparent overflow-y-auto"
            style={{ minHeight: `${LINE_HEIGHT}px`, maxHeight: `${LINE_HEIGHT * MAX_LINES}px` }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1">
              {/* 上传附件 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>上传附件</p>
                </TooltipContent>
              </Tooltip>
              <input ref={fileInputRef} type="file" multiple className="hidden" />

              {/* 提及模型 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8"
                  >
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>提及模型</p>
                </TooltipContent>
              </Tooltip>

              {/* MCP服务 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <MCPServiceSelector iconOnly onNavigate={onViewAllHistory} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>MCP服务</p>
                </TooltipContent>
              </Tooltip>

              {/* 分隔 */}
              <div className="w-px h-4 bg-border/50 mx-1" />

              {/* 联网搜索 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={enableSearch ? 'default' : 'ghost'}
                    size="icon-sm"
                    className="h-8 w-8"
                    onClick={onToggleSearch}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>联网搜索</p>
                </TooltipContent>
              </Tooltip>

              {/* 深度思考 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={enableThinking ? 'default' : 'ghost'}
                    size="icon-sm"
                    className="h-8 w-8"
                    onClick={onToggleThinking}
                  >
                    <Brain className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>深度思考</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    className="h-8 w-8 rounded-full"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>发送对话</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* 模型列表 - 3行 */}
        <div className="w-full space-y-6 shrink-0">
          <ModelListRow
            title="聊天模型"
            icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
            models={chatModels}
            onSelectModel={onSelectModel}
            onViewAll={() => onViewCategory('chat')}
            compact
          />
          <ModelListRow
            title="图片模型"
            icon={<Image className="h-4 w-4 text-green-500" />}
            models={imageModels}
            onSelectModel={onSelectModel}
            onViewAll={() => onViewCategory('image')}
            compact
          />
          <ModelListRow
            title="视频模型"
            icon={<Video className="h-4 w-4 text-purple-500" />}
            models={videoModels}
            onSelectModel={onSelectModel}
            onViewAll={() => onViewCategory('video')}
            compact
          />
        </div>
      </div>
    </div>
  )
}
