'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { mockModels, type Model } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const typeOrder: Record<Model['type'], number> = { chat: 0, image: 1, video: 2 }

interface ModelMentionPopoverProps {
  selectedModels: Model[]
  onToggleModel: (model: Model) => void
  maxModels?: number
  /** 限定模型类型，不传则显示全部 */
  filterType?: Model['type']
}

export function ModelMentionPopover({
  selectedModels,
  onToggleModel,
  maxModels = 4,
  filterType,
}: ModelMentionPopoverProps) {
  const [open, setOpen] = useState(false)

  // 按类别排序 + 按类型过滤
  const sortedModels = useMemo(() => {
    let result = filterType
      ? mockModels.filter(m => m.type === filterType)
      : [...mockModels]
    return result.sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
  }, [filterType])

  const isSingleSelect = maxModels === 1
  const selectedCount = selectedModels.length
  const isMaxReached = selectedCount >= maxModels

  const handleToggle = (model: Model) => {
    if (model.disabled) return
    const isSelected = selectedModels.some(m => m.id === model.id)

    // 单选模式：已选中同一模型不做任何操作；切换其他模型则替换
    if (isSingleSelect) {
      if (isSelected) return
      onToggleModel(model)
      setOpen(false)
      return
    }

    // 多选模式
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
            {isSingleSelect
              ? `选择${filterType === 'image' ? '图片' : filterType === 'video' ? '视频' : ''}模型`
              : `选择模型（${selectedCount}/${maxModels}）`
            }
          </p>
        </div>

        {/* 模型列表 */}
        <ScrollArea className="h-[360px]">
          <div className="p-2 space-y-1">
            {sortedModels.map((model) => {
              const isSelected = selectedModels.some(m => m.id === model.id)

              const item = (
                <div
                  key={model.id}
                  className={cn(
                    'flex items-start gap-3 p-2.5 rounded-lg transition-all',
                    model.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-muted/50',
                    isSelected && isSingleSelect && !model.disabled && 'bg-primary/5 ring-1 ring-primary/30'
                  )}
                  onClick={() => handleToggle(model)}
                >
                  {!isSingleSelect && (
                    <Checkbox
                      checked={isSelected}
                      disabled={model.disabled}
                      className="mt-0.5 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0">{model.logo}</span>
                      <span className="text-sm font-medium truncate">
                        {model.name}
                      </span>
                      {!filterType && <BadgeType type={model.type} />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                </div>
              )

              if (model.disabled && model.disabledReason) {
                return (
                  <Tooltip key={model.id}>
                    <TooltipTrigger asChild>
                      {item}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{model.disabledReason}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return item
            })}
          </div>
        </ScrollArea>

        {/* 底部提示 */}
        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground">
            {isSingleSelect
              ? `仅支持选择1个${filterType === 'image' ? '图片' : '视频'}模型`
              : `选中后即可在输入框中 @ 提及模型，最多选择 ${maxModels} 个`
            }
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
