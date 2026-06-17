'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { mockModels, type Model } from '@/lib/mock-data'
import { Search, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryTabs = [
  { id: 'all', label: '全部' },
  { id: 'chat', label: '聊天' },
  { id: 'image', label: '图片' },
  { id: 'video', label: '视频' },
] as const

interface ModelSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectModel: (model: Model) => void
  /** 无视 disabled 状态，所有模型正常可选 */
  showDisabled?: boolean
}

export function ModelSearchDialog({ open, onOpenChange, onSelectModel, showDisabled }: ModelSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredModels = useMemo(() => {
    let result = mockModels
    if (activeTab !== 'all') {
      result = result.filter(m => m.type === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, activeTab])

  const handleSelect = (model: Model) => {
    if (model.disabled && !showDisabled) return
    onSelectModel(model)
    onOpenChange(false)
    setSearchQuery('')
    setActiveTab('all')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0" showCloseButton={false}>
        <DialogTitle className="sr-only">搜索模型</DialogTitle>

        {/* 标题栏 + 关闭按钮 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="text-base font-semibold text-foreground">搜索模型</h3>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 搜索框 */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索模型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm border-border"
              autoFocus
            />
          </div>
        </div>

        {/* 分类 Tabs */}
        <div className="flex items-center gap-1 px-5 pt-1 pb-3 border-b border-border/50">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 模型列表 */}
        <ScrollArea className="h-[440px]">
          <div className="p-2 space-y-0.5">
            {filteredModels.length > 0 ? (
              filteredModels.map(model => {
                const isDisabled = model.disabled && !showDisabled
                const btn = (
                  <button
                    key={model.id}
                    disabled={isDisabled}
                    onClick={() => handleSelect(model)}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg transition-colors w-full text-left',
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-muted/50 cursor-pointer'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                      {model.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{model.name}</span>
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0',
                          model.type === 'chat' && 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
                          model.type === 'image' && 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
                          model.type === 'video' && 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
                        )}>
                          {{ chat: '聊天', image: '图片', video: '视频' }[model.type]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {model.description}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                        <Sparkles className="h-3 w-3" />
                        单次预计消耗 {model.costPoints} 智点
                      </p>
                    </div>
                  </button>
                )

                if (isDisabled && model.disabledReason) {
                  return (
                    <Tooltip key={model.id}>
                      <TooltipTrigger asChild>
                        {btn}
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{model.disabledReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return btn
              })
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">未找到匹配的模型</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
