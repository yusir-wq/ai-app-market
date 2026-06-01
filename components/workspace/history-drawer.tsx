'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History, X, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { mockChatHistories, type Model, type ChatHistories } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface HistoryDrawerProps {
  model: Model | null
  isOpen: boolean
  onClose: () => void
  onSelectChat?: (chatId: string) => void
  onRenameChat?: (chatId: string, newTitle: string) => void
  onDeleteChat?: (chatId: string) => void
  histories?: ChatHistories
}

export function HistoryDrawer({
  model,
  isOpen,
  onClose,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  histories: externalHistories,
}: HistoryDrawerProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')

  // 使用外部传入的 histories 或默认的 mockChatHistories
  const histories = externalHistories || mockChatHistories
  const modelHistories = model ? histories[model.id] || [] : []

  const handleRenameClick = (chatId: string, currentTitle: string) => {
    setSelectedChatId(chatId)
    setNewTitle(currentTitle)
    setRenameDialogOpen(true)
  }

  const handleConfirmRename = () => {
    if (selectedChatId && newTitle.trim()) {
      onRenameChat?.(selectedChatId, newTitle.trim())
    }
    setRenameDialogOpen(false)
    setSelectedChatId(null)
    setNewTitle('')
  }

  const handleDeleteClick = (chatId: string) => {
    setSelectedChatId(chatId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedChatId) {
      onDeleteChat?.(selectedChatId)
    }
    setDeleteDialogOpen(false)
    setSelectedChatId(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* 右侧抽屉 - 固定宽度 280px */}
      <div className="fixed top-[60px] right-0 bottom-0 w-[280px] bg-background border-l border-border z-50 shadow-lg animate-in slide-in-from-right-4 flex flex-col">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium text-sm text-foreground">
              {model?.name || '历史对话'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* 内容区 */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-2 space-y-1">
            {modelHistories.length > 0 ? (
              modelHistories.map((history) => (
                <div
                  key={history.id}
                  className="group flex items-start justify-between p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectChat?.(history.id)
                    onClose()
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate max-w-[180px]">
                      {history.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {history.createdAt.toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* 使用 CSS group-hover 控制按钮可见性，避免 JS 状态导致闪烁 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem 
                        className="text-xs gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRenameClick(history.id, history.title)
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        重命名
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs text-destructive gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(history.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                <p className="text-xs">暂无历史对话</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 重命名对话框 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>重命名对话</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="输入新名称"
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmRename()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmRename}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>删除对话</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              确定要删除这个对话吗？此操作无法撤销。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
