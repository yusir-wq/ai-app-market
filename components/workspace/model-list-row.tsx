'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { type Model } from '@/lib/mock-data'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ModelListRowProps {
  title: string
  icon: React.ReactNode
  models: Model[]
  onSelectModel: (model: Model) => void
  onViewAll: () => void
  compact?: boolean
}

export function ModelListRow({
  title,
  icon,
  models,
  onSelectModel,
  onViewAll,
  compact = false,
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
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary gap-1 h-7"
          onClick={onViewAll}
        >
          查看全部
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* 滚动区域 */}
      <div className="relative group">
        {/* 左箭头 */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* 模型列表 - 彩色大卡片风格 */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          onScroll={updateScrollButtons}
        >
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => onSelectModel(model)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all shrink-0 scroll-snap-align-start ${
                compact ? 'w-[140px]' : 'w-[170px]'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* 彩色渐变图标区域 */}
              <div className={`rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-white ${compact ? 'w-12 h-12 text-xl' : 'w-14 h-14 text-2xl'} shadow-sm`}>
                {model.logo}
              </div>
              <div className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-sm font-medium text-foreground truncate w-full text-center">
                  {model.name}
                </span>
                {!compact && (
                  <span className="text-[11px] text-muted-foreground truncate w-full text-center leading-tight">
                    {model.description.slice(0, 20)}...
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 右箭头 */}
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
