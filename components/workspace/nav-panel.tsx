'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { mockModels, type Conversation } from '@/lib/mock-data'
import { useAuth } from '@/contexts/auth-context'
import { UserProfilePopover } from './user-profile-popover'
import {
  Plus,
  Search,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  UserPlus,
} from 'lucide-react'

interface NavPanelProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNewChat: () => void
  onSelectConversation: (convId: string) => void
  onViewAll: () => void
  onOpenInvite: () => void
  onNavigate: (page: string) => void
  onRenameChat?: (chatId: string, newTitle: string) => void
  onDeleteChat?: (chatId: string) => void
  conversations: Conversation[]
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

export function NavPanel({
  isCollapsed,
  onToggleCollapse,
  onNewChat,
  onSelectConversation,
  onViewAll,
  onOpenInvite,
  onNavigate,
  onRenameChat,
  onDeleteChat,
  conversations,
}: NavPanelProps) {
  const { isLoggedIn, user, setShowLoginModal, setShowRechargeModal } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false)

  const modelMap = useMemo(() => new Map(mockModels.map(m => [m.id, m])), [])

  // 按时间倒序，最近5条
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [conversations])

  const recentConversations = useMemo(() => {
    return sortedConversations.slice(0, 8)
  }, [sortedConversations])

  // 智点
  const points = user ? Math.floor(user.balance * 1000) : 0

  const handleStartRename = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameChat?.(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditTitle('')
  }

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingId])

  const handleNewChat = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    onNewChat()
  }

  const handleSearchClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    onViewAll()
  }

  // 折叠态 — 纯图标列
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="w-[56px] bg-sidebar border-r border-sidebar-border flex flex-col items-center h-full py-3 gap-2 shrink-0">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mb-1">
            <Sparkles className="h-4 w-4 text-brand-foreground" />
          </div>

          {/* 展开按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={onToggleCollapse}>
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">展开面板</TooltipContent>
          </Tooltip>

          {/* 新建对话 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">新建对话</TooltipContent>
          </Tooltip>

          {/* 搜索对话 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleSearchClick}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">搜索对话</TooltipContent>
          </Tooltip>

          {/* 查看全部 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={onViewAll}>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">查看全部</TooltipContent>
          </Tooltip>

          {/* 分隔 */}
          <div className="w-6 h-px bg-sidebar-border my-1" />

          {/* 邀请好友 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={onOpenInvite}>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">邀请好友</TooltipContent>
          </Tooltip>

          {/* 底部用户头像 */}
          <div className="flex-1" />
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className="w-8 h-8 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
                >
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user ? user.id.slice(0, 2).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">个人中心</TooltipContent>
            </Tooltip>
            <UserProfilePopover
              open={profilePopoverOpen}
              onClose={() => setProfilePopoverOpen(false)}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </TooltipProvider>
    )
  }

  // 展开态
  return (
    <div className="w-[288px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* 品牌区域 */}
      <div className="p-4 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-brand-foreground" />
        </div>
        <h1 className="font-semibold text-sm text-sidebar-foreground flex-1">AI应用广场</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={onToggleCollapse}
        >
          <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* 新建对话按钮 */}
      <div className="px-3 pb-3">
        <Button
          size="default"
          className="w-full gap-2"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          新建对话
        </Button>
      </div>

      {/* 搜索对话按钮 */}
      <div className="px-3 pb-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-sidebar-foreground"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4" />
          搜索对话
        </Button>
      </div>

      {/* 历史对话区域 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="px-3 pb-1 shrink-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            最近对话
          </p>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 scrollbar-hide">
          <div className="space-y-0.5">
            {recentConversations.length > 0 ? (
              recentConversations.map((conv) => {
                const firstModel = modelMap.get(conv.modelIds[0])
                return (
                  <div
                    key={conv.id}
                    className="group flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    {/* 模型图标 */}
                    <div className={`relative w-7 h-7 rounded-lg bg-gradient-to-br ${firstModel?.gradient || 'from-violet-500 to-indigo-600'} flex items-center justify-center text-white text-sm shadow-sm shrink-0 mt-0.5`}>
                      {firstModel?.logo || '💬'}
                      {conv.modelIds.length > 1 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-sidebar">
                          {conv.modelIds.length}
                        </span>
                      )}
                    </div>
                    
                    {/* 中间内容 */}
                    <div className="flex-1 min-w-0">
                      {editingId === conv.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            ref={editInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-transparent border-b border-primary text-xs outline-none py-0.5"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename()
                              if (e.key === 'Escape') handleCancelRename()
                            }}
                            onBlur={handleCancelRename}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-sidebar-foreground truncate flex-1 min-w-0">
                              {conv.title}
                            </p>
                            <p className="text-xs text-muted-foreground/60 shrink-0">
                              {formatTime(conv.createdAt)}
                            </p>
                          </div>
                          {conv.preview && (
                            <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                              {conv.preview}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* 更多操作 */}
                    {editingId !== conv.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-6 w-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            className="text-xs gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartRename(conv.id, conv.title)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-xs text-destructive gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteTargetId(conv.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">暂无对话记录</p>
              </div>
            )}
          </div>

          {/* 查看全部 — 紧贴在最后一条对话下方 */}
          <div className="py-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-muted-foreground hover:text-sidebar-foreground"
              onClick={onViewAll}
            >
              查看全部
            </Button>
          </div>
        </div>
      </div>

      {/* 邀请好友 */}
      <div className="px-3 py-2 border-t border-sidebar-border space-y-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-sidebar-foreground h-8"
          onClick={onOpenInvite}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span className="text-xs truncate">邀请好友  |  你与好友都拿奖励</span>
        </Button>
      </div>

      {/* 用户信息卡片（底部吸附） */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar shrink-0 relative">
        {isLoggedIn && user ? (
          <>
            <div
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
              onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.id.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.id}</p>
                <p className="text-[11px] text-muted-foreground">
                  剩余智点: <span className="font-medium text-primary">{points.toLocaleString()}</span>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] px-2.5"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRechargeModal(true)
                }}
              >
                充值
              </Button>
            </div>
            <UserProfilePopover
              open={profilePopoverOpen}
              onClose={() => setProfilePopoverOpen(false)}
              onNavigate={onNavigate}
            />
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Button
              size="default"
              className="w-full"
              onClick={() => setShowLoginModal(true)}
            >
              登录
            </Button>
          </div>
        )}
      </div>

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
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTargetId) {
                  onDeleteChat?.(deleteTargetId)
                }
                setDeleteDialogOpen(false)
                setDeleteTargetId(null)
              }}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}