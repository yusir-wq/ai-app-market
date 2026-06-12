'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy, Check } from 'lucide-react'

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

const INVITE_LINKS = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  url: `https://ai.chinaz.cn//invite/8K2M9P-${index + 1}`,
  shared: index >= 6,
}))

export function InviteDialog({ open, onOpenChange, userId = 'user_demo' }: InviteDialogProps) {
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null)

  const handleCopyLink = (linkId: number, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedLinkId(linkId)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden rounded-2xl">
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
                邀请好友，免费薅智点!
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                分享专属邀请链接给好友，你获得<span className="font-semibold text-primary">300智点</span>，好友获得<span className="font-semibold text-primary">200智点</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* 邀请链接区域 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                你的专属邀请链接
              </h4>
              <span className="text-xs text-muted-foreground">10 个链接</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {INVITE_LINKS.map((link) => {
                const copied = copiedLinkId === link.id

                return (
                  <div
                    key={link.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 ${link.shared ? 'bg-muted/60 opacity-60 cursor-not-allowed' : 'bg-secondary'}`}
                  >
                    <span className="w-5 shrink-0 text-xs text-muted-foreground">
                      {link.id}
                    </span>
                    <span className={`min-w-0 flex-1 truncate font-mono text-xs ${link.shared ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {link.url}
                    </span>
                    {link.shared ? (
                      <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        已邀请
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 gap-1 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleCopyLink(link.id, link.url)}
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            复制
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 奖励信息区域 */}
          <div className="space-y-3">
            <p className="text-xs leading-5 text-muted-foreground">
              每人可领取10个邀请链接，复制给好友，好友注册成功后，你与好友均获得奖励。
              <br />
              邀请链接长期有效。
            </p>

            <div className="bg-secondary rounded-xl p-5">
              <div className="grid grid-cols-2 divide-x divide-border">
                {/* 左侧 - 已获得 */}
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#575CE910' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="4" fill="#575CE9" fillOpacity="0.3"/>
                      <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="#575CE9" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">你已获得</p>
                    <p className="mt-0.5 leading-none">
                      <span className="text-2xl font-bold text-primary">600</span>
                      <span className="ml-1 text-xs font-medium text-muted-foreground">智点</span>
                    </p>
                  </div>
                </div>

                {/* 右侧 - 已帮好友拿到 */}
                <div className="flex items-center gap-3 pl-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#575CE910' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="4" fill="#575CE9" fillOpacity="0.3"/>
                      <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="#575CE9" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">已帮好友拿到</p>
                    <p className="mt-0.5 leading-none">
                      <span className="text-2xl font-bold text-primary">1200</span>
                      <span className="ml-1 text-xs font-medium text-muted-foreground">智点</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
