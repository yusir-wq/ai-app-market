'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AgentGridCard } from '@/components/agent/agent-grid-card'
import { mockAgents, agentCategories, AgentCategory } from '@/lib/mock-data'
import { MagnifyingGlass, Sparkle, Pen, FilmReel, Image as ImageIcon, Microphone } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

/* ──────── 分类图标映射（Phosphor Icons）──────── */
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool: Pen,
  Film: FilmReel,
  Image: ImageIcon,
  Mic: Microphone,
}

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
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col w-full max-w-[1440px] mx-auto px-8 pt-8 pb-12">
          {/* ─── 头部 ─── */}
          <div className="mb-8">
            <h1 className="text-[20px] font-medium text-[#3f4558] tracking-[-0.01em]">
              AI 智能体广场
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              选择智能体，一键处理音视频、文案、图片 — 探索 AI 生产力的无限可能
            </p>
          </div>

          {/* ─── 搜索栏 ─── */}
          <div className="relative w-full max-w-[360px] mb-6">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="搜索智能体名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'pl-10 h-11 rounded-[10px]',
                'border-border bg-white',
                'focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40',
                'placeholder:text-[#3f4558]/35',
              )}
            />
          </div>

          {/* ─── 分类筛选 ─── */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
              className={cn(
                'h-9 rounded-[10px] font-medium text-[13px]',
                activeCategory === 'all'
                  ? 'bg-primary hover:bg-primary/80 text-primary-foreground shadow-none'
                  : 'border-border text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#4f55ec]/[0.06]',
              )}
            >
              全部
              <Badge
                variant="secondary"
                className={cn(
                  'ml-1.5 px-1.5 py-0 text-[10px]',
                  activeCategory === 'all'
                    ? 'bg-white/20 text-white border-0'
                    : 'bg-[#4f55ec]/[0.06] text-[#3f4558]/50',
                )}
              >
                {mockAgents.length}
              </Badge>
            </Button>
            {agentCategories.map((cat) => {
              const CatIcon = categoryIconMap[cat.icon] || Pen
              const count = mockAgents.filter((a) => a.category === cat.id).length
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'h-9 rounded-[10px] font-medium text-[13px]',
                    activeCategory === cat.id
                      ? 'bg-primary hover:bg-primary/80 text-primary-foreground shadow-none'
                      : 'border-border text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#4f55ec]/[0.06]',
                  )}
                >
                  <CatIcon className="h-3.5 w-3.5 mr-1.5" />
                  {cat.name}
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-1.5 px-1.5 py-0 text-[10px]',
                      activeCategory === cat.id
                        ? 'bg-white/20 text-white border-0'
                        : 'bg-[#4f55ec]/[0.06] text-[#3f4558]/50',
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>

          {/* ─── 卡片网格 ─── */}
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="mb-4 h-16 w-16 rounded-[12px] bg-[#4f55ec]/[0.04] flex items-center justify-center">
                <MagnifyingGlass className="h-7 w-7 text-[#3f4558]/20" />
              </div>
              <p className="text-sm font-medium text-[#3f4558]/60">
                没有找到匹配的智能体
              </p>
              <p className="text-xs text-[#3f4558]/40 mt-1">
                试试调整搜索关键词或切换分类
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-[10px]"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
              >
                <Sparkle className="h-3.5 w-3.5 mr-1.5" />
                重置筛选
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
