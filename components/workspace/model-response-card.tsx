'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThinkingProcess } from './thinking-process'
import { SearchResultsDrawer } from './search-results-drawer'
import { MarkdownContent } from '@/components/chat/markdown-content'
import { cn } from '@/lib/utils'
import { type Model, type Message, mockSearchResults, mockThinkingContent } from '@/lib/mock-data'
import { Globe, Brain, Copy, RotateCcw, Reply, Check, ArrowUpRight, Sparkles } from 'lucide-react'

interface ModelResponseCardProps {
  model: Model
  message: Message
  onlineSearch?: boolean
  deepThinking?: boolean
  onReply?: (model: Model) => void
  onRegenerate?: (model: Model) => void
  isLastInGroup?: boolean
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

  const searchResults = mockSearchResults[model.id] || []
  const thinkingContent = mockThinkingContent[model.id] || ''

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* 模型卡片头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center text-sm">
              {model.logo}
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">{model.name}</span>
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
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          {/* 深度思考过程 */}
          {deepThinking && thinkingContent && (
            <ThinkingProcess content={thinkingContent} />
          )}

          {/* 图片内容 */}
          {message.contentType === 'image' && message.images && message.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {message.images.map((img, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  {img === 'expired' || message.isExpired ? (
                    <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                      图片已过期
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`生成图片 ${idx + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 视频内容 */}
          {message.contentType === 'video' && message.videos && message.videos.length > 0 && (
            <div className="space-y-2">
              {message.videos.map((vid, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  {vid === 'expired' || message.isExpired ? (
                    <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                      视频已过期
                    </div>
                  ) : (
                    <video
                      src={vid}
                      controls
                      className="w-full h-auto max-h-80"
                      preload="metadata"
                    />
                  )}
                </div>
              ))}
              {(message.duration || message.resolution) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {message.duration && <span>时长: {message.duration}</span>}
                  {message.resolution && <span>分辨率: {message.resolution}</span>}
                </div>
              )}
            </div>
          )}

          {/* 文本回复内容 */}
          {message.contentType !== 'image' && message.contentType !== 'video' && (
            <div className="text-sm text-foreground leading-relaxed">
              {message.contentType === 'markdown' ? (
                <MarkdownContent content={message.content || ''} />
              ) : (
                <p>{message.content}</p>
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
    </>
  )
}