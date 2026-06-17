'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThinkingProcess } from './thinking-process'
import { SearchResultsDrawer } from './search-results-drawer'
import { ImagePreviewDialog } from '@/components/chat/image-preview-dialog'
import { MarkdownContent } from '@/components/chat/markdown-content'
import { MCPMessageView } from '@/components/workspace/mcp-message-view'
import { cn } from '@/lib/utils'
import { type Model, type Message, mockSearchResults, mockThinkingContent } from '@/lib/mock-data'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Globe, Brain, Copy, RotateCcw, Reply, Check, ArrowUpRight, Sparkles, Eye, Download, Image, Zap, RotateCw, Trash2, Puzzle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

interface ModelResponseCardProps {
  model: Model
  message: Message
  onlineSearch?: boolean
  deepThinking?: boolean
  onReply?: (model: Model) => void
  onRegenerate?: (model: Model) => void
  isLastInGroup?: boolean
}

function getCapabilityWarnings(model: Model, onlineSearch?: boolean, deepThinking?: boolean, isMCPEnabled?: boolean): string[] {
  const warnings: string[] = []
  if (model.type !== 'chat') {
    if (onlineSearch) warnings.push('联网模式')
    if (deepThinking) warnings.push('深度思考')
    if (isMCPEnabled) warnings.push('调用MCP')
  } else if (model.disabledReason) {
    if (onlineSearch) warnings.push('联网模式')
    if (deepThinking) warnings.push('深度思考')
    // deepseek-chat 永久不支持图片理解
    if (model.id === 'deepseek-chat') {
      warnings.push('图片理解')
    }
  }
  return warnings
}

export function ModelResponseCard({
  model,
  message,
  onlineSearch = false,
  deepThinking = false,
  onReply,
  onRegenerate,
  isLastInGroup = false,
}: ModelResponseCardProps) {
  const [copied, setCopied] = useState(false)
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false)
  const [hoveredImgIdx, setHoveredImgIdx] = useState<number | null>(null)
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [hoveredVidIdx, setHoveredVidIdx] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [contentOverflows, setContentOverflows] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // 检测内容是否超过 350px
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    // 用 scrollHeight 检测真实高度
    setContentOverflows(el.scrollHeight > 350)
  }, [message.content, message.contentType])

  const searchResults = mockSearchResults[model.id] || []
  const thinkingContent = (() => {
    const base = mockThinkingContent[model.id] || ''
    // MCP 思考过程合并
    if (message.contentType === 'mcp' && message.mcpContent) {
      const parts: string[] = []
      if (message.mcpContent.thinkingProcess?.length) {
        parts.push(message.mcpContent.thinkingProcess.map(t => t.content).join('\n'))
      }
      if (message.mcpContent.organizedInfo) {
        parts.push(message.mcpContent.organizedInfo)
      }
      if (parts.length > 0) return parts.join('\n\n')
    }
    return base
  })()
  const hasThinking = !!(deepThinking && thinkingContent) || (message.contentType === 'mcp' && message.mcpContent && (message.mcpContent.thinkingProcess?.length || message.mcpContent.organizedInfo))
  // Claude Haiku 4.5 不支持深度思考，隐藏折叠面板
  const shouldShowThinking = hasThinking && model.id !== 'claude-haiku-45'

  const warnings = getCapabilityWarnings(model, onlineSearch, deepThinking, message.isMCPEnabled)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* 模型卡片头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="text-lg flex-shrink-0">{model.logo}</div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground truncate block">{model.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {onlineSearch && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5 gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                    <Globe className="h-2.5 w-2.5" />
                    联网
                  </Badge>
                )}
                {deepThinking && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5 gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                    <Brain className="h-2.5 w-2.5" />
                    深度思考
                  </Badge>
                )}
                {(message.isMCPEnabled || message.contentType === 'mcp') && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5 gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    <Puzzle className="h-2.5 w-2.5" />
                    MCP
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* 状态标签 */}
            {message.status && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] h-4 px-1.5",
                  message.status === 'success'
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                    : message.status === 'error'
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                )}
              >
                {message.status === 'success' ? '完成' : message.status === 'error' ? '失败' : '发送中'}
              </Badge>
            )}
            {/* 智点消耗 */}
            {message.costPoints !== undefined && message.costPoints > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
                {message.costPoints}
              </span>
            )}
          </div>
        </div>

        {/* 模型卡片内容 */}
        <div className="px-4 py-3">
          {/* 能力限制提示 */}
          {warnings.length > 0 && (
            <div className="flex items-start gap-2 mb-3 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                因模型能力限制，本次回复不支持
                {warnings.map((w, i) => (
                  <span key={w}>
                    {i > 0 && i === warnings.length - 1 ? ' / ' : i > 0 ? '、' : ''}
                    <span className="font-semibold">{w}</span>
                  </span>
                ))}
              </span>
            </div>
          )}
          {/* 深度思考过程 */}
          {shouldShowThinking && (
            <ThinkingProcess content={thinkingContent} />
          )}

          {/* 图片内容 */}
          {message.contentType === 'image' && message.images && message.images.length > 0 && (
            <div className="space-y-2">
              <div className={`grid ${message.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                {message.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg bg-muted cursor-pointer group/img"
                    onMouseEnter={() => setHoveredImgIdx(idx)}
                    onMouseLeave={() => setHoveredImgIdx(null)}
                    onClick={() => {
                      if (img !== 'expired' && !message.isExpired) setPreviewImg(img)
                    }}
                  >
                    {img === 'expired' || message.isExpired ? (
                      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground border border-dashed border-muted-foreground/30 rounded-lg">
                        图片已失效
                      </div>
                    ) : (
                      <>
                        <img src={img} alt={`生成图片 ${idx + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                        <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${hoveredImgIdx === idx ? 'opacity-40' : 'opacity-0'}`} />
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hoveredImgIdx === idx ? 'opacity-100' : 'opacity-0'}`}>
                          <TooltipProvider>
                            <div className="flex gap-2 flex-wrap justify-center p-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setPreviewImg(img) }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">查看图片</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const link = document.createElement('a')
                                      link.href = img
                                      link.download = `image-${Date.now()}.jpg`
                                      link.click()
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">下载原图</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(img) }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">复制链接</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation() }}
                                  >
                                    <Image className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">作为参考图</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation() }}
                                  >
                                    <Zap className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">使用提示词</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation(); onRegenerate?.(model) }}
                                  >
                                    <RotateCw className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">再次生成</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                    onClick={(e) => { e.stopPropagation() }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">删除</TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {/* 有效期提示 */}
              <p className="text-xs text-muted-foreground">
                图片地址有效期为24小时，请及时
                <button
                  onClick={() => {
                    message.images?.forEach((img, i) => {
                      if (img !== 'expired') {
                        const link = document.createElement('a')
                        link.href = img
                        link.download = `image-${Date.now()}-${i}.jpg`
                        link.click()
                      }
                    })
                  }}
                  className="ml-1 mr-1 text-foreground hover:text-primary underline transition-colors"
                >
                  【下载图片】
                </button>
                到本地。
              </p>
            </div>
          )}

          {/* 视频内容 */}
          {message.contentType === 'video' && message.videos && message.videos.length > 0 && (
            <div className="space-y-2">
              {message.videos.map((vid, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg overflow-hidden border border-border bg-muted group/vid"
                  onMouseEnter={() => setHoveredVidIdx(idx)}
                  onMouseLeave={() => setHoveredVidIdx(null)}
                >
                  {vid === 'expired' || message.isExpired ? (
                    <div className="flex items-center justify-center h-32 text-xs text-muted-foreground border border-dashed border-muted-foreground/30 rounded-lg">
                      视频已失效
                    </div>
                  ) : (
                    <>
                      <video
                        src={vid}
                        controls
                        className="w-full h-auto max-h-80"
                        preload="metadata"
                      />
                      <div className={`absolute inset-0 bg-black transition-opacity duration-200 pointer-events-none ${hoveredVidIdx === idx ? 'opacity-40' : 'opacity-0'}`} />
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${hoveredVidIdx === idx ? 'opacity-100' : 'opacity-0'}`}>
                        <TooltipProvider>
                          <div className="flex gap-2 flex-wrap justify-center p-2 pointer-events-auto">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const link = document.createElement('a')
                                    link.href = vid
                                    link.download = `video-${Date.now()}.mp4`
                                    link.click()
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">下载视频</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(vid) }}
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">复制链接</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                  onClick={(e) => { e.stopPropagation() }}
                                >
                                  <Zap className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">使用提示词</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                  onClick={(e) => { e.stopPropagation(); onRegenerate?.(model) }}
                                >
                                  <RotateCw className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">再次生成</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                                  onClick={(e) => { e.stopPropagation() }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">删除</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {(message.duration || message.resolution) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {message.duration && <span>时长: {message.duration}</span>}
                  {message.resolution && <span>分辨率: {message.resolution}</span>}
                </div>
              )}
              {/* 有效期提示 */}
              <p className="text-xs text-muted-foreground">
                视频地址有效期为24小时，请及时
                <button
                  onClick={() => {
                    message.videos?.forEach((v, i) => {
                      if (v !== 'expired') {
                        const link = document.createElement('a')
                        link.href = v
                        link.download = `video-${Date.now()}-${i}.mp4`
                        link.click()
                      }
                    })
                  }}
                  className="ml-1 mr-1 text-foreground hover:text-primary underline transition-colors"
                >
                  【下载视频】
                </button>
                到本地。
              </p>
            </div>
          )}

          {/* MCP 工具调用过程 */}
          {message.contentType === 'mcp' && message.mcpContent && (
            <MCPMessageView content={message.mcpContent} />
          )}

          {/* 文本回复内容 */}
          {message.contentType !== 'image' && message.contentType !== 'video' && message.contentType !== 'mcp' && (
            <div
              ref={contentRef}
              className={cn(
                'text-sm text-foreground leading-relaxed relative',
                !expanded && contentOverflows && 'max-h-[350px] overflow-hidden'
              )}
            >
              {message.contentType === 'markdown' ? (
                <MarkdownContent content={message.content || ''} />
              ) : (
                <p>{message.content}</p>
              )}
              {/* 折叠渐变遮罩 */}
              {!expanded && contentOverflows && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
              )}
            </div>
          )}

          {/* 引用来源 */}
          {onlineSearch && searchResults.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
              onClick={() => setSearchDrawerOpen(true)}
            >
              引用来源
              <span className="font-medium text-primary">({searchResults.length})</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* 操作栏 */}
        <div className="flex items-center gap-1 px-3 py-2 border-t border-border bg-secondary/20">
          {contentOverflows && message.contentType !== 'image' && message.contentType !== 'video' && message.contentType !== 'mcp' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  展开
                </>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => onRegenerate(model)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="flex-1" />
          {/* 回复按钮 - 仅当有多模型且非最后一组时显示 */}
          {onReply && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => onReply(model)}
            >
              <Reply className="h-3 w-3" />
              回复
            </Button>
          )}
        </div>
      </div>

      {/* 搜索结果抽屉 */}
      <SearchResultsDrawer
        open={searchDrawerOpen}
        onOpenChange={setSearchDrawerOpen}
        results={searchResults}
      />

      {/* 图片预览弹窗 */}
      <ImagePreviewDialog
        open={!!previewImg}
        image={previewImg}
        onOpenChange={(open) => { if (!open) setPreviewImg(null) }}
        onDownload={() => {
          if (previewImg) {
            const link = document.createElement('a')
            link.href = previewImg
            link.download = `image-${Date.now()}.jpg`
            link.click()
          }
        }}
        onCopyLink={() => {
          if (previewImg) navigator.clipboard.writeText(previewImg)
        }}
        onRegenerate={() => onRegenerate?.(model)}
      />
    </>
  )
}