'use client'

import { useRef, useState, useCallback } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { type Model } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ModelListRowProps {
  title: string
  icon: React.ReactNode
  models: Model[]
  onSelectModel: (model: Model) => void
  activeModel?: Model | null
  compact?: boolean
  /** 显示 disabled 模型为正常状态（首页和搜索弹窗） */
  showDisabled?: boolean
}

export function ModelListRow({
  title,
  icon,
  models,
  onSelectModel,
  activeModel,
  compact = false,
  showDisabled,
}: ModelListRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 280
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="w-full">
      {/* 标题栏 */}
      <div className="flex items-center mb-4 px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
      </div>

      {/* 滚动区域 */}
      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          onScroll={updateScrollButtons}
        >
          {models.map((model) => {
            const isDisabled = model.disabled && !showDisabled
            const isActive = activeModel?.id === model.id

            const card = (
              <button
                key={model.id}
                onClick={() => !isDisabled && onSelectModel(model)}
                disabled={isDisabled}
                className={cn(
                  'flex flex-col items-center gap-3 p-2 rounded-xl border transition-all shrink-0 scroll-snap-align-start',
                  isDisabled
                    ? 'border-transparent bg-muted/40 opacity-50 cursor-not-allowed'
                    : isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-card hover:border-border hover:shadow-md'
                )}
                style={{ scrollSnapAlign: 'start', width: compact ? 140 : 170 }}
              >
                <div className={`rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-white ${compact ? 'w-12 h-12 text-xl' : 'w-14 h-14 text-2xl'} shadow-sm`}>
                  {model.logo}
                </div>
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <span className={cn(
                    'text-sm font-medium line-clamp-2 text-center w-full',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}>
                    {model.name}
                  </span>
                  {!compact && (
                    <span className="text-[11px] text-muted-foreground truncate w-full text-center leading-tight">
                      {model.description.slice(0, 20)}...
                    </span>
                  )}
                </div>
              </button>
            )

            if (isDisabled && model.disabledReason) {
              return (
                <Tooltip key={model.id}>
                  <TooltipTrigger asChild>
                    {card}
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{model.disabledReason}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return card
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
