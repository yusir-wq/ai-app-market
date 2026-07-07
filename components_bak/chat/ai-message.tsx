'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Copy, Trash2, RotateCw, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '@/lib/mock-data'
import { MarkdownContent } from './markdown-content'
import { CodeBlock } from './code-block'
import { MCPMessageView } from '@/components/workspace/mcp-message-view'

interface AIMessageProps {
  message: ChatMessage
  modelName: string
  modelLogo: string
  isLastMessage?: boolean
}

const MAX_LINES = 10 // 超过10行显示折叠按钮

export function AIMessage({ message, modelName, modelLogo, isLastMessage }: AIMessageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [shouldShowCollapse, setShouldShowCollapse] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // 检查内容行数是否超过限制
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(window.getComputedStyle(contentRef.current).lineHeight)
      const height = contentRef.current.scrollHeight
      const lineCount = Math.ceil(height / lineHeight)
      setShouldShowCollapse(lineCount > MAX_LINES)
    }
  }, [message.content])

  return (
    <div
      className="group flex justify-start mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3 max-w-2xl">
        {/* AI 头像 */}
        <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
          <AvatarFallback className="text-sm">{modelLogo}</AvatarFallback>
        </Avatar>

        {/* 消息内容 */}
        <div className="flex-1 min-w-0">
          {/* 模型名称 */}
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {modelName}
          </p>

          {/* 内容区 */}
          <div
            ref={contentRef}
            className={`prose prose-sm max-w-none dark:prose-invert text-foreground transition-all ${
              isExpanded ? '' : 'line-clamp-10'
            }`}
          >
            {message.contentType === 'mcp' && message.mcpContent ? (
              <MCPMessageView content={message.mcpContent} />
            ) : message.contentType === 'markdown' ? (
              <MarkdownContent content={message.content} />
            ) : message.contentType === 'code' ? (
              <CodeBlock
                code={message.content}
                language={message.codeLanguage || 'javascript'}
              />
            ) : (
              <p className="text-sm leading-relaxed text-foreground">
                {message.content}
              </p>
            )}
          </div>

          {/* 时间和操作 */}
          <div className="flex items-center gap-2 mt-3 pt-2">
            <span className="text-xs text-muted-foreground">
              {isLastMessage
                ? message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : message.timestamp.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
              }
            </span>

            {/* 展开/收起按钮 */}
            {shouldShowCollapse && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>
            )}

            {isHovered && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    navigator.clipboard.writeText(message.content)
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => console.log('Delete message')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => console.log('Regenerate')}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
