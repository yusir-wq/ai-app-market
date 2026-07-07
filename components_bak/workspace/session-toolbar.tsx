'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import type { Model } from '@/lib/mock-data'

interface SessionToolbarProps {
  model: Model | null
  onNewChat: () => void
  onOpenHistory: () => void
}

export function SessionToolbar({
  model,
  onNewChat,
  onOpenHistory,
}: SessionToolbarProps) {
  const { isLoggedIn, setShowLoginModal } = useAuth()

  const handleOpenHistory = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    onOpenHistory()
  }

  return (
    <div className="absolute left-6 top-6 flex flex-col gap-2 z-30">
      {/* 新建对话按钮 */}
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-3 py-1 text-xs rounded-full shadow-md hover:shadow-lg transition-shadow"
        onClick={onNewChat}
      >
        新建对话
      </Button>

      {/* 历史对话按钮 */}
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-3 py-1 text-xs rounded-full shadow-md hover:shadow-lg transition-shadow"
        onClick={handleOpenHistory}
        disabled={!model}
      >
        历史对话
      </Button>
    </div>
  )
}
