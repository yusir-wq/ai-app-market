'use client'

import { Badge } from '@/components/ui/badge'
import type { Model } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ModelCardProps {
  model: Model
  isSelected: boolean
  onClick: () => void
}

const typeLabels: Record<Model['type'], string> = {
  chat: '聊天',
  image: '图片',
  video: '视频',
}

export function ModelCard({ model, isSelected, onClick }: ModelCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl cursor-pointer transition-colors',
        'hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
          {model.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-foreground truncate">
              {model.name}
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {typeLabels[model.type]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {model.description}
          </p>
        </div>
      </div>
    </div>
  )
}
