'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AgentGridCard } from '@/components/agent/agent-grid-card'
import { mockAgents, agentCategories, AgentCategory } from '@/lib/mock-data'
import * as LucideIcons from 'lucide-react'
import { Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentHomeViewProps {
  onSelectAgent?: (agentId: string) => void
}

export function AgentHomeView({ onSelectAgent }: AgentHomeViewProps = {}) {
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = useMemo(() => {
    return mockAgents.filter((agent) => {
      const matchCategory = activeCategory === 'all' || agent.category === activeCategory
      const matchSearch =
        !searchQuery ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  const handleAgentClick = (agentId: string) => {
    onSelectAgent?.(agentId)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-6 pt-8 pb-12">
          {/* ─── 头部 ─── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                AI 智能体广场
              </h1>
            </div>
            <p className="text-sm text-muted-foreground pl-3.5">
              选择智能体，一键处理音视频、文案、图片 — 探索 AI 生产力的无限可能
            </p>
          </div>

          {/* ─── 搜索栏 + 筛选 ─── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="搜索智能体名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'pl-10 h-11 rounded-xl',
                  'border-border/60 bg-muted/40',
                  'focus-visible:ring-primary/30',
                )}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className="h-9 rounded-lg font-medium"
              >
                全部
                <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                  {mockAgents.length}
                </Badge>
              </Button>
              {agentCategories.map((cat) => {
                const CatIcon = (LucideIcons as any)[cat.icon] || LucideIcons.Circle
                const count = mockAgents.filter((a) => a.category === cat.id).length
                return (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className="h-9 rounded-lg font-medium"
                  >
                    <CatIcon className="h-3.5 w-3.5 mr-1.5" />
                    {cat.name}
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                      {count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* ─── 卡片网格 ─── */}
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredAgents.map((agent) => (
                <AgentGridCard
                  key={agent.id}
                  agent={agent}
                  onClick={handleAgentClick}
                />
              ))}
            </div>
          ) : (
            /* 空状态 */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Search className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                没有找到匹配的智能体
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                试试调整搜索关键词或切换分类
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-lg"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                重置筛选
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
