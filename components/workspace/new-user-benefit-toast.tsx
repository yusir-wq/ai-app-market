'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface NewUserBenefitToastProps {
  open: boolean
  onClose: () => void
}

export function NewUserBenefitToast({ open, onClose }: NewUserBenefitToastProps) {
  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => {
      onClose()
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card px-6 py-6 shadow-xl pointer-events-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          type="button"
          aria-label="关闭新用户福利提示"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-8">
          <h3 className="text-xl font-semibold leading-tight text-foreground">
            🎉 新用户福利已到账
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-primary">100智点</span>已自动发放到账户，
            <br />
            立即体验 GPT、Claude、Gemini 等热门 AI 模型。
          </p>
        </div>
      </div>
    </div>
  )
}
