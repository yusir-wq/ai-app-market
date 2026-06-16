'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ModelMentionPopover } from './model-mention-popover'
import { MCPServiceSelector } from './mcp-service-selector'
import { AttachmentPreview, type UploadedFile, buildUploadedFiles } from './attachment-preview'
import { ModelParamPopover } from './model-param-popover'
import { mockModels, type Model } from '@/lib/mock-data'
import { useAuth } from '@/contexts/auth-context'
import { ArrowUp, Paperclip, Sparkles, X, Upload, Info } from 'lucide-react'
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
  onNavigate?: (page: string) => void
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
  const [uploadedReferences, setUploadedReferences] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const refFileInputRef = useRef<HTMLInputElement>(null)

  const isImageModel = model?.type === 'image'
  const isVideoModel = model?.type === 'video'
  const hasReference = isImageModel || isVideoModel
  const requiresReference = model?.requiresReference || false

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

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploadedReferences(prev => [...prev, '/placeholder.jpg'])
    e.target.value = ''
  }

  const removeUploadedReference = (index: number) => {
    setUploadedReferences(prev => prev.filter((_, i) => i !== index))
  }

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
      className="w-full rounded-lg border border-border shadow-sm"
      style={{ backgroundColor: '#F7F8FB' }}
    >
      {/* 需要参考警告 */}
      {hasReference && requiresReference && uploadedReferences.length === 0 && (
        <div className="px-4 pt-4">
          <div className="p-3 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {model?.name} 需要上传参考
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  该模型必须上传参考素材才能生成。支持
                  {model?.supportedReferences?.join('、') || '内容'}
                  参考。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`p-4 ${hasReference ? 'flex items-start gap-3' : ''}`}>
        {/* 参考上传区 - 左侧（图片/视频模型） */}
        {hasReference && (
          <div className="shrink-0 flex items-start gap-2">
            {uploadedReferences.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {uploadedReferences.map((ref, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      #{idx + 1}
                    </div>
                    <button
                      onClick={() => removeUploadedReference(idx)}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-foreground/70 text-background flex items-center justify-center text-[10px]"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => refFileInputRef.current?.click()}
              className="w-12 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent flex flex-col items-center justify-center gap-0.5 transition-colors shrink-0"
            >
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground leading-none">参考</span>
            </button>
          </div>
        )}

        {/* 文本输入区 */}
        <div className={hasReference ? 'flex-1 min-w-0' : ''}>
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

          {/* 上传文件预览 - 仅非参考模式 */}
          {!hasReference && (
            <AttachmentPreview files={uploadedFiles} onRemove={handleRemoveFile} />
          )}

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
        </div>

        {/* 支持标签 - 图片/视频模型右侧 */}
        {hasReference && uploadedReferences.length > 0 && model?.supportedReferences && (
          <div className="shrink-0 flex gap-1 pt-0.5">
            {model.supportedReferences.map(ref => (
              <Badge key={ref} variant="outline" className="text-[10px] h-5">
                {ref === 'content' ? '内容参考' : ref === 'style' ? '风格参考' : '角色参考'}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 隐藏的参考上传 input */}
      {hasReference && (
        <input
          ref={refFileInputRef}
          type="file"
          accept={isImageModel ? 'image/*' : 'video/*'}
          multiple
          className="hidden"
          onChange={handleRefUpload}
        />
      )}

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
        <div className="flex items-center gap-1">
          {/* 图片/视频模型：参数设置 + @提及 */}
          {hasReference ? (
            <>
              <ModelParamPopover modelType={model!.type as 'image' | 'video'} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <ModelMentionPopover
                      selectedModels={selectedMentionModels}
                      onToggleModel={handleToggleMentionModel}
                      filterType={model!.type as 'image' | 'video'}
                      maxModels={1}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>提及模型</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <ModelMentionPopover
                      selectedModels={selectedMentionModels}
                      onToggleModel={handleToggleMentionModel}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>提及模型</p>
                </TooltipContent>
              </Tooltip>

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

              <div className="w-px h-4 bg-border/50 mx-1" />

              <ModelParamPopover
                modelType="chat"
                enableSearch={enableSearch}
                enableThinking={enableThinking}
                onToggleSearch={onToggleSearch}
                onToggleThinking={onToggleThinking}
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!hasReference && modelCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground cursor-help">
                  单次预计消耗 ≈ {totalCost} 智点
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>具体消耗以实际使用为准</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                className="h-8 w-8 rounded-full"
                onClick={handleSend}
                disabled={!inputValue.trim() && uploadedFiles.length === 0 && uploadedReferences.length === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{hasReference ? '开始生成' : '发送对话'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
