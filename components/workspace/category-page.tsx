'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { mockModels, type Model } from '@/lib/mock-data'
import { Search } from 'lucide-react'

interface CategoryPageProps {
  initialTab: string
  onSelectModel: (model: Model) => void
}

const tabs = [
  { id: 'chat', label: '聊天' },
  { id: 'image', label: '图片' },
  { id: 'video', label: '视频' },
]

export function CategoryPage({ initialTab, onSelectModel }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>(initialTab)

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

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex items-center gap-3 pl-14 md:pl-6 pr-6 py-4 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold text-foreground">模型列表</h2>
        <span className="text-xs text-muted-foreground">共 {filteredModels.length} 个</span>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* 搜索框 */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="搜索模型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* 分类 Tabs */}
          <div className="flex items-center gap-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 模型网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => onSelectModel(model)}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/[0.03] cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl mb-3">
                  {model.logo}
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{model.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{model.description}</p>
                <p className="text-xs text-muted-foreground mt-2">单次消耗 {model.costPoints} 智点</p>
              </div>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">未找到匹配的模型</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
