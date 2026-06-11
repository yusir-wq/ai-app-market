'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy, Check, Info } from 'lucide-react'

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

const INVITE_LINK = 'https://ai.chinaz.cn//invite/8K2M9P'

export function InviteDialog({ open, onOpenChange, userId = 'user_demo' }: InviteDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(INVITE_LINK)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
        {/* 头部区域 */}
        <div className="px-8 pt-8 pb-6">
          <DialogHeader className="mb-0">
            <DialogTitle className="sr-only">邀请好友</DialogTitle>
          </DialogHeader>

          <div className="flex items-start gap-4">
            {/* 礼物图标 */}
            <div className="shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="20" width="32" height="24" rx="4" fill="#575CE9" fillOpacity="0.1"/>
                <rect x="8" y="20" width="32" height="20" rx="4" fill="#575CE9" fillOpacity="0.15"/>
                <rect x="14" y="16" width="20" height="8" rx="2" fill="#575CE9" fillOpacity="0.2"/>
                <path d="M18 16C18 12.686 20.686 10 24 10C27.314 10 30 12.686 30 16" stroke="#575CE9" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <rect x="22" y="8" width="4" height="8" rx="1" fill="#575CE9" fillOpacity="0.3"/>
                <path d="M24 24V36" stroke="#575CE9" strokeWidth="2" strokeLinecap="round"/>
                <rect x="8" y="26" width="32" height="2" fill="#575CE9" fillOpacity="0.1"/>
                <circle cx="36" cy="12" r="3" fill="#575CE9" fillOpacity="0.15"/>
                <circle cx="38" cy="10" r="2" fill="#575CE9" fillOpacity="0.1"/>
              </svg>
            </div>

            {/* 标题和副标题 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground leading-tight">
                邀请好友，赚取智点
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                分享专属邀请链接，好友成功注册后，你将获得 <span className="font-semibold" style={{ color: '#575CE9' }}>500 智点</span>奖励
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* 邀请链接区域 */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              你的专属邀请链接
            </h4>
            <div className="flex items-center gap-2">
              <Input
                value={INVITE_LINK}
                readOnly
                className="font-mono text-sm h-11 bg-secondary border-input flex-1"
              />
              <Button
                variant={copied ? 'default' : 'default'}
                size="sm"
                className="shrink-0 gap-1.5 h-11 px-5 font-medium"
                style={{ backgroundColor: copied ? undefined : '#575CE9' }}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    复制链接
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 奖励信息区域 */}
          <div className="bg-secondary rounded-xl p-5">
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* 左侧 - 你将获得 */}
              <div className="flex items-center gap-3 pr-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#575CE910' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" fill="#575CE9" fillOpacity="0.3"/>
                    <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="#575CE9" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">你将获得</p>
                  <p className="text-base font-semibold text-foreground">
                    <span style={{ color: '#575CE9' }}>500 智点</span>
                    <span className="text-muted-foreground font-normal"> / 每位好友</span>
                  </p>
                </div>
              </div>

              {/* 右侧 - 好友将获得 */}
              <div className="flex items-center gap-3 pl-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#575CE910' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" fill="#575CE9" fillOpacity="0.3"/>
                    <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="#575CE9" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">好友将获得</p>
                  <p className="text-base font-semibold"
                    style={{ color: '#575CE9' }}
                  >
                    100 智点
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="leading-relaxed">
              每位好友仅可通过你的链接注册一次，奖励将在好友完成注册后自动发放
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
