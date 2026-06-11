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
import { Badge } from '@/components/ui/badge'
import { mockInviteRecords, type InviteRecord } from '@/lib/mock-data'
import { Copy, Check, Share2, Gift, Users, ExternalLink } from 'lucide-react'

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

const INVITE_LINK = 'https://ai-app-market.com/invite/abc123xyz'

export function InviteDialogRefactor({ open, onOpenChange, userId = 'user_demo' }: InviteDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(INVITE_LINK)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Gift className="h-5 w-5 text-primary" />
            邀请好友
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 奖励说明卡片 */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">邀请好友注册</p>
                <p className="text-xs text-muted-foreground">双方各获奖励</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary text-center mt-2">
              500 <span className="text-sm font-normal">智点</span>
            </p>
          </div>

          {/* 邀请链接区域 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">邀请链接</label>
            <div className="flex items-center gap-2">
              <Input
                value={INVITE_LINK}
                readOnly
                className="font-mono text-xs h-10 bg-secondary border-input"
              />
              <Button
                variant={copied ? 'default' : 'outline'}
                size="sm"
                className="shrink-0 gap-1 h-10 px-3"
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
                    复制
                  </>
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 h-9"
              onClick={handleCopyLink}
            >
              <Share2 className="h-4 w-4" />
              分享邀请链接
            </Button>
          </div>

          {/* 邀请记录区域 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1">
              邀请记录
              <span className="text-xs text-muted-foreground ml-1">
                ({mockInviteRecords.length})
              </span>
            </h4>
            
            <div className="border border-border rounded-lg overflow-hidden">
              {/* 表头 */}
              <div className="grid grid-cols-3 gap-2 px-3 py-2.5 bg-secondary text-xs font-medium text-muted-foreground">
                <span>用户</span>
                <span>注册时间</span>
                <span className="text-right">奖励状态</span>
              </div>
              
              {/* 记录列表 */}
              <div className="divide-y divide-border max-h-60 overflow-y-auto">
                {mockInviteRecords.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-3 gap-2 px-3 py-2.5 text-xs"
                  >
                    <span className="text-foreground font-medium truncate">
                      {record.invitedUserName}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(record.registeredAt)}
                    </span>
                    <span className="text-right">
                      {record.rewardStatus === 'granted' ? (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          已发放
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          待发放
                        </Badge>
                      )}
                    </span>
                  </div>
                ))}
                
                {mockInviteRecords.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    暂无邀请记录
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}