'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ModelCard } from './model-card'
import { mockModels, type Model } from '@/lib/mock-data'
import { Search, PanelLeftClose, PanelLeft } from 'lucide-react'

interface SidebarProps {
  selectedModel: Model | null
  onSelectModel: (model: Model) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

type ModelType = 'all' | 'chat' | 'image' | 'video'

export function Sidebar({
  selectedModel,
  onSelectModel,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<ModelType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤模型
  const filteredModels = useMemo(() => {
    let models = [...mockModels]
    
    // 按类型过滤
    if (activeTab !== 'all') {
      models = models.filter((m) => m.type === activeTab)
    }
    
    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query)
      )
    }
    
    // 按添加时间倒序
    return models.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
  }, [activeTab, searchQuery])

  if (isCollapsed) {
    return (
      <div className="w-12 bg-muted/30 border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-[280px] bg-muted/30 border-r border-border flex flex-col h-full">
      {/* 折叠按钮 */}
      <div className="p-3 flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleCollapse}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* 模型分类 Tabs */}
      <div className="px-3 pb-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ModelType)}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">聊天</TabsTrigger>
            <TabsTrigger value="image" className="flex-1">图片</TabsTrigger>
            <TabsTrigger value="video" className="flex-1">视频</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 搜索框 */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 模型列表 */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModel?.id === model.id}
              onClick={() => {
                onSelectModel(model)
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}