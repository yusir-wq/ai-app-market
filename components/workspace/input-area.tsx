'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ModelMentionPopover } from './model-mention-popover'
import { MCPServiceSelector } from './mcp-service-selector'
import { AttachmentPreview, type UploadedFile, buildUploadedFiles } from './attachment-preview'
import { ModelParamPopover } from './model-param-popover'
import { type Model } from '@/lib/mock-data'
import { ArrowUp, Paperclip, Upload, X, Info } from 'lucide-react'

interface InputAreaProps {
  model: Model | null
  selectedModels?: Model[]
  replyModel?: Model | null
  onSendMessage: (message: string) => void
  inputValue: string
  onInputChange: (value: string) => void
  onNavigate: (page: string) => void
  enableSearch?: boolean
  enableThinking?: boolean
  onToggleSearch?: () => void
  onToggleThinking?: () => void
}

export function InputArea({
  model,
  selectedModels = [],
  replyModel = null,
  onSendMessage,
  inputValue,
  onInputChange,
  onNavigate,
  enableSearch = false,
  enableThinking = false,
  onToggleSearch,
  onToggleThinking,
}: InputAreaProps) {
  const [uploadedReferences, setUploadedReferences] = useState<string[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<UploadedFile[]>([])
  const [selectedMentionModels, setSelectedMentionModels] = useState<Model[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const LINE_HEIGHT = 24
  const MAX_LINES = 6

  const activeModel = replyModel || model
  const isImageModel = activeModel?.type === 'image'
  const isVideoModel = activeModel?.type === 'video'
  const hasReference = isImageModel || isVideoModel
  const requiresReference = activeModel?.requiresReference || false

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
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    onInputChange('')
    setUploadedReferences([])
    setUploadedAttachments([])
    setSelectedMentionModels([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploadedReferences(prev => [...prev, '/placeholder.jpg'])
    e.target.value = ''
  }

  const removeUploadedReference = (index: number) => {
    setUploadedReferences(prev => prev.filter((_, i) => i !== index))
  }

  // 切换 @提及 模型
  const handleToggleMentionModel = useCallback((model: Model) => {
    setSelectedMentionModels(prev => {
      const isSelected = prev.some(m => m.id === model.id)
      if (isSelected) return prev.filter(m => m.id !== model.id)
      // 图片/视频模型：单选替换
      if (model.type === 'image' || model.type === 'video') {
        return [model]
      }
      return [...prev, model]
    })
  }, [])

  // 移除单个 @提及 模型（通过 pill 的 X 按钮）
  const handleRemoveMentionModel = useCallback((modelId: string) => {
    setSelectedMentionModels(prev => prev.filter(m => m.id !== modelId))
  }, [])

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newFiles = buildUploadedFiles(files)
    setUploadedAttachments(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  const handleRemoveAttachment = useCallback((id: string) => {
    setUploadedAttachments(prev => prev.filter(f => f.id !== id))
  }, [])

  const placeholder = isImageModel
    ? '描述你想要生成的图片...'
    : isVideoModel
    ? '描述你想要生成的视频内容...'
    : replyModel
    ? `向 ${replyModel.name} 发送消息...`
    : selectedModels.length > 1
    ? `向 ${selectedModels.length} 个模型发送消息...`
    : `向 ${activeModel?.name || 'AI'} 发送消息...`

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-4">
      <div className="rounded-lg border border-border shadow-sm" style={{ backgroundColor: '#F7F8FB' }}>
        {/* 参考上传区 - 图片/视频模型 */}
        {hasReference && (
          <>
            {requiresReference && uploadedReferences.length === 0 && (
              <div className="px-4 pt-4">
                <div className="p-3 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        {activeModel?.name} 需要上传参考
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        该模型必须上传参考素材才能生成。支持
                        {activeModel?.supportedReferences?.join('、') || '内容'}
                        参考。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 文本输入区 */}
        <div className={`p-4 ${hasReference ? 'flex items-start gap-3' : ''}`}>
          {/* 参考上传区 - 左侧 */}
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
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent flex flex-col items-center justify-center gap-0.5 transition-colors shrink-0"
              >
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground leading-none">参考</span>
              </button>
            </div>
          )}

          <div className={hasReference ? 'flex-1 min-w-0' : ''}>
          {/* @提及 模型 Pills */}
          {selectedMentionModels.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-hide flex-nowrap">
              {selectedMentionModels.map(mentionModel => (
                <div
                  key={mentionModel.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary whitespace-nowrap shrink-0"
                >
                  <span>{mentionModel.logo}</span>
                  <span>{mentionModel.name}</span>
                  <button
                    onClick={() => handleRemoveMentionModel(mentionModel.id)}
                    className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 上传文件预览（非参考模式） */}
          {!hasReference && (
            <AttachmentPreview files={uploadedAttachments} onRemove={handleRemoveAttachment} />
          )}

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
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

          {/* 图片/视频模型支持标签 */}
          {hasReference && uploadedReferences.length > 0 && activeModel?.supportedReferences && (
            <div className="shrink-0 flex gap-1 pt-0.5">
              {activeModel.supportedReferences.map(ref => (
                <Badge key={ref} variant="outline" className="text-[10px] h-5">
                  {ref === 'content' ? '内容参考' : ref === 'style' ? '风格参考' : '角色参考'}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={isImageModel ? 'image/*' : 'video/*'}
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
          <div className="flex items-center gap-1">
            {/* 上传附件 */}
            {!hasReference && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
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
                  onChange={handleAttachmentUpload}
                />
              </>
            )}

            {/* 提及模型 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  {hasReference && activeModel ? (
                    <ModelMentionPopover
                      selectedModels={selectedMentionModels}
                      onToggleModel={handleToggleMentionModel}
                      filterType={activeModel.type as 'image' | 'video'}
                      maxModels={1}
                    />
                  ) : (
                    <ModelMentionPopover
                      selectedModels={selectedMentionModels}
                      onToggleModel={handleToggleMentionModel}
                    />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>提及模型</p>
              </TooltipContent>
            </Tooltip>

            {/* MCP服务 - 仅聊天模型 */}
            {!hasReference && (
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
            )}

            {/* 图片/视频模型参数设置 */}
            {hasReference && activeModel && (
              <ModelParamPopover modelType={activeModel.type as 'image' | 'video'} />
            )}

            {/* 分隔 + 参数设置 - 仅聊天模型 */}
            {!hasReference && (
              <>
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
            {/* @提及模型消耗 */}
            {selectedMentionModels.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground mr-2 cursor-help">
                    单次预计消耗≈{selectedMentionModels.reduce((sum, m) => sum + m.costPoints, 0)}智点
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
                  disabled={!inputValue.trim() && uploadedReferences.length === 0 && uploadedAttachments.length === 0}
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
    </div>
  )
}
