'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Lightning } from '@phosphor-icons/react'
import type { Agent, AgentCategory } from '@/lib/mock-data'

/* ──────────────── 按分类的主题色映射 ──────────────── */
const categoryAccent: Record<AgentCategory, {
  border: string
  glow: string
  badgeBg: string
  badgeText: string
}> = {
  video: {
    border: 'hover:border-cyan-400/40',
    glow: 'hover:shadow-cyan-500/8',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-600',
  },
  audio: {
    border: 'hover:border-purple-400/40',
    glow: 'hover:shadow-purple-500/8',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-600',
  },
  copywriting: {
    border: 'hover:border-fuchsia-400/40',
    glow: 'hover:shadow-fuchsia-500/8',
    badgeBg: 'bg-fuchsia-500/10',
    badgeText: 'text-fuchsia-600',
  },
  image: {
    border: 'hover:border-amber-400/40',
    glow: 'hover:shadow-amber-500/8',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600',
  },
}

const categoryLabel: Record<AgentCategory, string> = {
  video: '视频',
  audio: '音频',
  copywriting: '文案',
  image: '图片',
}

/* ──────────────── Props ──────────────── */
interface AgentGridCardProps {
  agent: Agent
  onClick?: (agentId: string) => void
}

/* ──────────────── 组件 ──────────────── */
export function AgentGridCard({ agent, onClick }: AgentGridCardProps) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accent = categoryAccent[agent.category]

  /* —— 视频悬停播放 —— */
  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (agent.coverVideo && videoRef.current) {
      hoverTimer.current = setTimeout(() => {
        videoRef.current?.play().catch(() => {})
      }, 300)
    }
  }, [agent.coverVideo])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  const handleClick = () => onClick?.(agent.id)

  return (
    <article
      className={cn(
        /* 基础容器 */
        'group relative flex flex-col cursor-pointer rounded-[12px] overflow-hidden',
        'bg-card border border-border',
        /* Hover 过渡 */
        'transition-shadow duration-200 ease-out',
        'hover:shadow-[0_4px_16px_rgba(38,44,72,0.06)]',
        accent.border,
        accent.glow,
      )}
      style={{ boxShadow: '0 8px 22px rgba(38,44,72,0.028)' }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ═══════ 封面图区域 ═══════ */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {/* 静态封面图 */}
        {agent.coverImage && !imgError ? (
          <img
            src={agent.coverImage}
            alt={agent.name}
            loading="lazy"
            className={cn(
              'absolute inset-0 w-full h-full object-cover',
              'transition-transform duration-500 ease-out',
              'group-hover:scale-105',
            )}
            onError={() => setImgError(true)}
          />
        ) : (
          /* 无图回退 */
          <div className={cn('absolute inset-0 bg-gradient-to-br', agent.gradient)} />
        )}

        {/* 视频层 */}
        {agent.coverVideo && (
          <video
            ref={videoRef}
            src={agent.coverVideo}
            muted
            loop
            playsInline
            className={cn(
              'absolute inset-0 w-full h-full object-cover',
              'transition-opacity duration-400',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}

        {/* —— 左上角分类标签 —— */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full',
            'text-[11px] font-medium',
            'bg-white/80 backdrop-blur-sm text-muted-foreground',
            'border border-white/40',
          )}>
            {categoryLabel[agent.category]}
          </span>
        </div>

        {/* —— 右上角智点标签 —— */}
        <div className="absolute top-3 right-3 z-10">
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full',
            'text-[11px] font-medium',
            'bg-white/80 backdrop-blur-sm text-muted-foreground',
            'border border-white/40',
          )}>
            <Lightning className="h-3 w-3 text-amber-500" weight="fill" />
            {agent.costPoints}
          </span>
        </div>
      </div>

      {/* ═══════ 文本内容 ═══════ */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            'font-medium text-[15px] leading-tight',
            'text-[#3f4558] line-clamp-1',
            'transition-colors duration-200',
          )}>
            {agent.name}
          </h3>
        </div>
        <p className={cn(
          'text-[13px] leading-relaxed',
          'text-muted-foreground line-clamp-2',
          'flex-1',
        )}>
          {agent.description}
        </p>
      </div>
    </article>
  )
}
