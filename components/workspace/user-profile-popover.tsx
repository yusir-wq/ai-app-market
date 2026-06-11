'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { Receipt, CreditCard, Server, LogOut, ChevronRight } from 'lucide-react'

interface UserProfilePopoverProps {
  open: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

export function UserProfilePopover({ open, onClose, onNavigate }: UserProfilePopoverProps) {
  const { user, logout, setShowRechargeModal } = useAuth()
  const ref = useRef<HTMLDivElement>(null)

  const points = user ? Math.floor(user.balance * 1000) : 0

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open || !user) return null

  const handleNavigate = (page: string) => {
    onClose()
    setTimeout(() => onNavigate(page), 100)
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-3 right-3 mb-2 z-50 bg-card rounded-lg border border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150"
      style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* 用户信息区 */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {user.id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              剩余智点 <span className="font-semibold text-primary">{points.toLocaleString()}</span>
            </p>
          </div>
          <Button
            size="sm"
            className="h-7 text-[11px] px-2.5 shrink-0"
            onClick={() => { onClose(); setTimeout(() => setShowRechargeModal(true), 100) }}
          >
            充值
          </Button>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="py-1">
        <button
          onClick={() => handleNavigate('billing-usage')}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
        >
          <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground flex-1 text-left">消费记录</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
        </button>
        <button
          onClick={() => handleNavigate('billing-payments')}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
        >
          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground flex-1 text-left">支付记录</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
        </button>
        <button
          onClick={() => handleNavigate('mcp-center')}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
        >
          <Server className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground flex-1 text-left">MCP服务</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
        </button>
      </div>

      {/* 退出登录 */}
      <div className="px-4 py-2.5 border-t border-border">
        <button
          onClick={() => { onClose(); setTimeout(() => logout(), 100) }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-secondary hover:bg-accent text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          退出登录
        </button>
      </div>
    </div>
  )
}