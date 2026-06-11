'use client'

import { Button } from '@/components/ui/button'
import { Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ChatMessage } from '@/lib/mock-data'

interface UserMessageProps {
  message: ChatMessage
  isLastMessage?: boolean
}

export function UserMessage({ message, isLastMessage }: UserMessageProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group flex justify-end mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end gap-2 max-w-[72%]">
        {/* 操作按钮 */}
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
          </div>
        )}

        {/* 消息内容 */}
        <div className="flex flex-col items-end gap-1">
          <div className="bg-primary text-primary-foreground rounded-lg rounded-br-sm px-4 py-2.5 break-words">
            <p className="text-sm">{message.content}</p>
          </div>
          <span className="text-xs text-muted-foreground px-2">
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
        </div>
      </div>
    </div>
  )
}
