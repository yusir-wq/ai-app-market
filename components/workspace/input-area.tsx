'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { MCPServiceSelector } from './mcp-service-selector'
import { type Model } from '@/lib/mock-data'
import { ArrowUp, Paperclip, Image, Upload, X, Info, Globe, Brain, AtSign } from 'lucide-react'

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
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const LINE_HEIGHT = 24
  const MAX_LINES = 6

  const activeModel = replyModel || model
  const isImageModel = activeModel?.type === 'image'
  const isVideoModel = activeModel?.type === 'video'
  const hasReference = isImageModel || isVideoModel
  const requiresReference = activeModel?.requiresReference || false

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
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    onInputChange('')
    setUploadedImages([])
    setUploadedVideos([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    if (isImageModel) {
      setUploadedImages(prev => [...prev, '/placeholder.jpg'])
    } else if (isVideoModel) {
      setUploadedVideos(prev => [...prev, '/placeholder.jpg'])
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeUploadedVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index))
  }

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
        {/* 参考图上传区 - 图片/视频模型 */}
        {hasReference && (
          <div className="px-4 pt-4">
            {requiresReference && uploadedImages.length === 0 && (
              <div className="p-3 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 mb-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      {activeModel?.name} 需要上传参考图
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      该模型必须上传参考图片才能生成。支持
                      {activeModel?.supportedReferences?.join('、') || '内容'}
                      参考。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              {uploadedImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        #{idx + 1}
                      </div>
                      <button
                        onClick={() => removeUploadedImage(idx)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-foreground/70 text-background flex items-center justify-center text-[10px]"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent flex flex-col items-center justify-center gap-1 transition-colors shrink-0"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {requiresReference ? '上传参考图' : '添加参考图'}
                </span>
              </button>
              {uploadedImages.length > 0 && activeModel?.supportedReferences && (
                <div className="flex gap-1.5">
                  {activeModel.supportedReferences.map(ref => (
                    <Badge key={ref} variant="outline" className="text-[10px] h-5">
                      {ref === 'content' ? '内容参考' : ref === 'style' ? '风格参考' : '角色参考'}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {isVideoModel && (
              <div className="flex items-center gap-3 mb-3">
                {uploadedVideos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {uploadedVideos.map((vid, idx) => (
                      <div key={idx} className="relative w-20 h-14 rounded-lg overflow-hidden border border-border">
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                          视频 #{idx + 1}
                        </div>
                        <button
                          onClick={() => removeUploadedVideo(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-foreground/70 text-background flex items-center justify-center text-[10px]"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-14 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent flex flex-col items-center justify-center gap-0.5 transition-colors shrink-0"
                >
                  <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">上传视频</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={isImageModel ? 'image/*' : 'video/*'}
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        )}

        {/* 文本输入区 */}
        <div className="p-4">
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
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
              </>
            )}

            {/* 提及模型 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
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
                  <MCPServiceSelector iconOnly onNavigate={onNavigate} />
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
            {/* 模型信息 */}
            {activeModel && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
                <span>{activeModel.logo}</span>
                <span>{activeModel.name}</span>
              </div>
            )}
            {hasReference && activeModel && (
              <span className="text-xs text-muted-foreground mr-2">
                消耗 {activeModel.costPoints} 智点
              </span>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSend}
                  disabled={!inputValue.trim() && uploadedImages.length === 0}
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
