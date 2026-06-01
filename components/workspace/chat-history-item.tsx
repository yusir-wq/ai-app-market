'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ChatHistory } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, Check, X } from 'lucide-react'

interface ChatHistoryItemProps {
  history: ChatHistory
  isSelected: boolean
  onClick: () => void
  onRename?: (id: string, newTitle: string) => void
  onDelete?: (id: string) => void
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

export function ChatHistoryItem({ history, isSelected, onClick, onRename, onDelete }: ChatHistoryItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(history.title)

  const handleRename = () => {
    setIsEditing(true)
    setEditTitle(history.title)
  }

  const handleSaveRename = () => {
    if (editTitle.trim() && editTitle !== history.title) {
      onRename?.(history.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleCancelRename = () => {
    setEditTitle(history.title)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('确定要删除这个对话吗？')) {
      onDelete?.(history.id)
    }
  }

  if (isEditing) {
    return (
      <div className="px-3 py-2 rounded-lg bg-accent">
        <div className="flex items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-7 text-sm py-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveRename()
              } else if (e.key === 'Escape') {
                handleCancelRename()
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 shrink-0"
            onClick={handleSaveRename}
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 shrink-0"
            onClick={handleCancelRename}
          >
            <X className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'px-3 py-2 rounded-lg cursor-pointer transition-colors group',
        'hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">{history.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatTime(history.createdAt)}
          </p>
        </div>
        {isHovered && (
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                handleRename()
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
