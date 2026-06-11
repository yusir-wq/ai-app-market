'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ModelListRow } from './model-list-row'
import { ModelMentionPopover } from './model-mention-popover'
import { ModelSearchDialog } from './model-search-dialog'
import { MCPServiceSelector } from './mcp-service-selector'
import { AttachmentPreview, type UploadedFile, buildUploadedFiles } from './attachment-preview'
import { mockModels, type Model } from '@/lib/mock-data'
import { useAuth } from '@/contexts/auth-context'
import { ArrowUp, Globe, Brain, Paperclip, MessageSquare, Image, Video, Sparkles, X, Search } from 'lucide-react'

const recommendedModelIds = ['deepseek-v4-pro', 'gpt-image-2', 'doubao-seedance-2-0-260128']

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
  const [selectedMentionModels, setSelectedMentionModels] = useState<Model[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const LINE_HEIGHT = 24
  const MAX_LINES = 6

  const chatModels = useMemo(() => mockModels.filter(m => m.type === 'chat'), [])
  const imageModels = useMemo(() => mockModels.filter(m => m.type === 'image'), [])
  const videoModels = useMemo(() => mockModels.filter(m => m.type === 'video'), [])
  const recommendedModels = useMemo(
    () => recommendedModelIds.map(id => mockModels.find(m => m.id === id)!).filter(Boolean),
    []
  )

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

  const handleToggleMentionModel = useCallback((model: Model) => {
    setSelectedMentionModels(prev => {
      const isSelected = prev.some(m => m.id === model.id)
      return isSelected
        ? prev.filter(m => m.id !== model.id)
        : [...prev, model]
    })
  }, [])

  const handleRemoveMentionModel = useCallback((modelId: string) => {
    setSelectedMentionModels(prev => prev.filter(m => m.id !== modelId))
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newFiles = buildUploadedFiles(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const handleSend = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    if (!inputValue.trim() && uploadedFiles.length === 0) return
    const targetModelIds = selectedMentionModels.length > 0
      ? selectedMentionModels.map(m => m.id)
      : chatModels.map(m => m.id)
    onSendMessage(inputValue.trim(), targetModelIds)
    setInputValue('')
    setSelectedMentionModels([])
    setUploadedFiles([])
  }

  const costPointsPerModel = 10
  const modelCount = selectedMentionModels.length
  const totalCost = modelCount * costPointsPerModel

  return (
    <div className="flex-1 flex flex-col items-center min-w-0 overflow-y-auto bg-background">
      <div className="flex flex-col items-center w-full max-w-[720px] mx-auto px-4 md:px-6 pt-[150px] pb-[150px]">
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10 shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">AI 应用广场</h1>
        </div>

        {/* 推荐模型栏 */}
        <div className="w-full flex items-center justify-center gap-2 mb-4 shrink-0">
          {recommendedModels.map(model => (
            <button
              key={model.id}
              onClick={() => onSelectModel(model)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/30 hover:bg-accent text-sm transition-colors cursor-pointer"
            >
              <span>{model.logo}</span>
              <span className="text-foreground">{model.name}</span>
            </button>
          ))}
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border hover:border-primary/30 hover:bg-accent transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="w-full rounded-lg border border-border shadow-sm p-4 mb-6 shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
          {/* @提及 模型 Pills */}
          {selectedMentionModels.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {selectedMentionModels.map(model => (
                <div
                  key={model.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                >
                  <span>{model.logo}</span>
                  <span>{model.name}</span>
                  <button
                    onClick={() => handleRemoveMentionModel(model.id)}
                    className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 上传文件预览 */}
          <AttachmentPreview files={uploadedFiles} onRemove={handleRemoveFile} />

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

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1">
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
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
                onChange={handleFileUpload}
              />

              <ModelMentionPopover
                selectedModels={selectedMentionModels}
                onToggleModel={handleToggleMentionModel}
              />

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

              <div className="w-px h-4 bg-border/50 mx-1" />

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
              {modelCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  {totalCost}
                </span>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    className="h-8 w-8 rounded-full"
                    onClick={handleSend}
                    disabled={!inputValue.trim() && uploadedFiles.length === 0}
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

      {/* 模型搜索弹窗 */}
      <ModelSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSelectModel={onSelectModel}
      />
    </div>
  )
}
