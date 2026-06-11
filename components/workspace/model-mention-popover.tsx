'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { mockModels, type Model } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ModelMentionPopoverProps {
  selectedModels: Model[]
  onToggleModel: (model: Model) => void
  maxModels?: number
}

export function ModelMentionPopover({
  selectedModels,
  onToggleModel,
  maxModels = 4,
}: ModelMentionPopoverProps) {
  const [open, setOpen] = useState(false)

  // 展示全部模型
  const allModels = mockModels
  const selectedCount = selectedModels.length
  const isMaxReached = selectedCount >= maxModels

  const handleToggle = (model: Model) => {
    const isSelected = selectedModels.some(m => m.id === model.id)
    if (!isSelected && isMaxReached) {
      toast.warning('选择模型已达上限')
      return
    }
    onToggleModel(model)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            'h-8 w-8',
            selectedCount > 0 && 'text-primary'
          )}
        >
          <span className="text-base font-medium">@</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        side="top"
        sideOffset={8}
      >
        {/* 标题 */}
        <div className="p-3 border-b flex items-center justify-between">
          <p className="text-sm font-medium">
            选择模型（{selectedCount}/{maxModels}）
          </p>
        </div>

        {/* 模型列表 */}
        <ScrollArea className="h-[360px]">
          <div className="p-2 space-y-1">
            {allModels.map((model) => {
              const isSelected = selectedModels.some(m => m.id === model.id)

              return (
                <div
                  key={model.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg transition-all hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleToggle(model)}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0">{model.logo}</span>
                      <span className="text-sm font-medium truncate">
                        {model.name}
                      </span>
                      <BadgeType type={model.type} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* 底部提示 */}
        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground">
            选中后即可在输入框中 @ 提及模型，最多选择 {maxModels} 个
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function BadgeType({ type }: { type: Model['type'] }) {
  const config = {
    chat: { label: '聊天', className: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
    image: { label: '图片', className: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400' },
    video: { label: '视频', className: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  }
  const c = config[type] || config.chat
  return (
    <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', c.className)}>
      {c.label}
    </span>
  )
}
