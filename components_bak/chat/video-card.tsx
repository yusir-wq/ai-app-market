'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Download, Copy, Zap, RotateCw, Trash2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface VideoCardProps {
  video: string
  duration?: string
  resolution?: string
  onPlay?: () => void
  onDownload?: () => void
  onCopyLink?: () => void
  onUsePrompt?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
}

export function VideoCard({
  video,
  duration = '0:05',
  resolution = '1080p',
  onPlay,
  onDownload,
  onCopyLink,
  onUsePrompt,
  onRegenerate,
  onDelete,
}: VideoCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden rounded-lg aspect-video bg-black cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay?.()}
    >
      {/* 视频封面 - 使用视频的第一帧作为缩略图 */}
      <video
        src={video}
        className="w-full h-full object-cover"
        onLoadedMetadata={(e) => {
          const video = e.currentTarget
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            // 可选：使用封面背景
          }
        }}
      />

      {/* 暗色覆盖层 */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${hovered ? 'opacity-40' : 'opacity-0'}`} />

      {/* 播放按钮 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
          onClick={(e) => {
            e.stopPropagation()
            onPlay?.()
          }}
        >
          <Play className="h-6 w-6 ml-0.5" />
        </Button>
      </div>

      {/* 视频信息 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex gap-2 text-white text-xs font-medium">
          <span>{duration}</span>
          <span>{resolution}</span>
        </div>
      </div>

      {/* Hover 操作按钮 */}
      {hovered && (
        <div className="absolute top-2 right-2 flex gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload?.()
                  }}
                >
                  <Download className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                下载视频
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopyLink?.()
                  }}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                复制链接
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUsePrompt?.()
                  }}
                >
                  <Zap className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                使用提示词
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRegenerate?.()
                  }}
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                再次生成
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                删除
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
