'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ModelMentionPopover } from './model-mention-popover'
import { MCPServiceSelector } from './mcp-service-selector'
import { AttachmentPreview, type UploadedFile, buildUploadedFiles } from './attachment-preview'
import { ModelParamPopover } from './model-param-popover'
import { mockModels, type Model } from '@/lib/mock-data'
import { useAuth } from '@/contexts/auth-context'
import { ArrowUp, Globe, Brain, Paperclip, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'

interface HomeInputAreaProps {
  /** 单模型上下文 - 控制 placeholder */
  model?: Model | null
  /** @提及为空时默认发送的模型 ID 列表 */
  defaultModelIds?: string[]
  /** 自定义 placeholder */
  placeholder?: string
  /** 发送回调 */
  onSend: (message: string, modelIds: string[]) => void
  enableSearch: boolean
  enableThinking: boolean
  onToggleSearch: () => void
  onToggleThinking: () => void
  onNavigate: (page: string) => void
}

const LINE_HEIGHT = 24
const MAX_LINES = 6
const COST_PER_MODEL = 10

export function HomeInputArea({
  model,
  defaultModelIds,
  placeholder,
  onSend,
  enableSearch,
  enableThinking,
  onToggleSearch,
  onToggleThinking,
  onNavigate,
}: HomeInputAreaProps) {
  const { isLoggedIn, setShowLoginModal } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [selectedMentionModels, setSelectedMentionModels] = useState<Model[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleToggleMentionModel = useCallback((m: Model) => {
    setSelectedMentionModels(prev => {
      const isSelected = prev.some(p => p.id === m.id)
      if (isSelected) return prev.filter(p => p.id !== m.id)
      if (m.type === 'image' || m.type === 'video') {
        if (prev.length > 0 && prev.some(p => p.type !== m.type)) {
          toast.info('图片、视频模型暂不支持多模型对话')
        }
        return [m]
      }
      if (prev.some(p => p.type === 'image' || p.type === 'video')) {
        toast.info('图片、视频模型暂不支持多模型对话')
      }
      const chatOnly = prev.filter(p => p.type === 'chat')
      return [...chatOnly, m]
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
      : defaultModelIds && defaultModelIds.length > 0
        ? defaultModelIds
        : mockModels.filter(m => m.type === 'chat').map(m => m.id)
    onSend(inputValue.trim(), targetModelIds)
    setInputValue('')
    setSelectedMentionModels([])
    setUploadedFiles([])
  }

  const effectivePlaceholder = placeholder || model
    ? `向 ${model?.name} 提问...`
    : '输入问题，选择模型开始对话...'

  const modelCount = selectedMentionModels.length
  const totalCost = modelCount * COST_PER_MODEL

  return (
    <div
      className="w-full rounded-lg border border-border shadow-sm p-4"
      style={{ backgroundColor: '#F7F8FB' }}
    >
      {/* @提及 模型 Pills */}
      {selectedMentionModels.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-hide flex-nowrap">
          {selectedMentionModels.map(m => (
            <div
              key={m.id}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary whitespace-nowrap shrink-0"
            >
              <span>{m.logo}</span>
              <span>{m.name}</span>
              <button
                onClick={() => handleRemoveMentionModel(m.id)}
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
        placeholder={effectivePlaceholder}
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
                <MCPServiceSelector iconOnly onNavigate={onNavigate} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>MCP服务</p>
            </TooltipContent>
          </Tooltip>

          {/* 图片/视频模型参数设置 */}
          {model && (model.type === 'image' || model.type === 'video') && (
            <ModelParamPopover modelType={model.type} />
          )}

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
  )
}
