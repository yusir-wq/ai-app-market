'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Copy, Receipt, CreditCard, Puzzle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface HeaderProps {
  onNavigate?: (page: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const { isLoggedIn, user, setShowLoginModal, setShowRechargeModal, logout } = useAuth()
  const [copied, setCopied] = useState(false)

  const handleCopyId = async () => {
    if (user?.id) {
      try {
        await navigator.clipboard.writeText(user.id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        const textarea = document.createElement('textarea')
        textarea.value = user.id
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  // 将余额转换为智点（1元=1000智点）
  const points = user ? Math.floor(user.balance * 1000) : 0

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* 左侧 Logo 和名称 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
          <span className="text-background font-bold text-sm">AI</span>
        </div>
        <span className="font-semibold text-sm text-foreground">AI应用广场</span>
      </div>

      {/* 右侧用户信息 */}
      <div className="flex items-center gap-4">
        {isLoggedIn && user ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">剩余智点:</span>
              <span className="font-medium text-foreground">{points.toLocaleString()}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowRechargeModal(true)}>
              充值
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">{user.id}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                {/* 用户信息卡片 */}
                <div className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.id}</p>
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    </div>
                    <button
                      onClick={handleCopyId}
                      className="flex-shrink-0 p-1.5 rounded-md hover:bg-accent transition-colors"
                      title="复制用户ID"
                    >
                      <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* 菜单项 */}
                {/* MCP服务选项 - 新增 */}
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => onNavigate?.('mcp-center')}
                >
                  <Puzzle className="h-4 w-4" />
                  MCP服务
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => onNavigate?.('billing-usage')}
                >
                  <Receipt className="h-4 w-4" />
                  消费记录
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => onNavigate?.('billing-payments')}
                >
                  <CreditCard className="h-4 w-4" />
                  支付记录
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive gap-2 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button onClick={() => setShowLoginModal(true)}>
            登录
          </Button>
        )}
      </div>
    </header>
  )
}