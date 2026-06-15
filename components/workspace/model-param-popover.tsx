'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---- 图片模型参数 ----
export interface ImageParams {
  ratio: string
  count: number
  quality: string
  optimizePrompt: boolean
}

// ---- 视频模型参数 ----
export interface VideoParams {
  duration: number
  ratio: string
  resolution: string
  count: number
  mode: string
}

export type ModelParams = ImageParams | VideoParams

export const DEFAULT_IMAGE_PARAMS: ImageParams = {
  ratio: 'auto',
  count: 1,
  quality: 'auto',
  optimizePrompt: true,
}

export const DEFAULT_VIDEO_PARAMS: VideoParams = {
  duration: 5,
  ratio: '16:9',
  resolution: '1080p',
  count: 1,
  mode: 'quality',
}

// ---- 参数选项配置 ----
const IMAGE_RATIOS = [
  { value: 'auto', label: '自动' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
]

const IMAGE_COUNTS = [1, 2, 4]

const IMAGE_QUALITIES = [
  { value: 'auto', label: '自动' },
  { value: 'standard', label: '标准' },
  { value: 'high', label: '高清' },
]

const VIDEO_DURATIONS = [5, 10, 15, 30]

const VIDEO_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
]

const VIDEO_RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
  { value: '4K', label: '4K' },
]

const VIDEO_MODES = [
  { value: 'quality', label: '质量优先' },
  { value: 'speed', label: '速度优先' },
]

interface ModelParamPopoverProps {
  modelType: 'chat' | 'image' | 'video'
  value?: ImageParams | VideoParams
  onChange?: (params: ImageParams | VideoParams) => void
  // ---- 聊天模型参数 ----
  enableSearch?: boolean
  enableThinking?: boolean
  onToggleSearch?: () => void
  onToggleThinking?: () => void
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer',
        checked ? 'bg-primary' : 'bg-muted-foreground/20'
      )}
      onClick={onChange}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        )}
      />
    </button>
  )
}

function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer',
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ModelParamPopover({
  modelType,
  value,
  onChange,
  enableSearch,
  enableThinking,
  onToggleSearch,
  onToggleThinking,
}: ModelParamPopoverProps) {
  const [imageParams, setImageParams] = useState<ImageParams>(
    (value as ImageParams) || DEFAULT_IMAGE_PARAMS
  )
  const [videoParams, setVideoParams] = useState<VideoParams>(
    (value as VideoParams) || DEFAULT_VIDEO_PARAMS
  )

  const isChat = modelType === 'chat'
  const isImage = modelType === 'image'

  const updateImageParams = (partial: Partial<ImageParams>) => {
    const next = { ...imageParams, ...partial }
    setImageParams(next)
    onChange?.(next)
  }

  const updateVideoParams = (partial: Partial<VideoParams>) => {
    const next = { ...videoParams, ...partial }
    setVideoParams(next)
    onChange?.(next)
  }

  // 按钮高亮：聊天模式有任一开关打开时高亮
  const hasChatActive = isChat && (enableSearch || enableThinking)

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn('h-8 w-8', hasChatActive && 'text-primary')}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>参数设置</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-64 p-4"
      >
        {isChat ? (
          <>
            {/* 联网搜索 */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-foreground">联网搜索</p>
              <ToggleSwitch
                checked={enableSearch || false}
                onChange={() => onToggleSearch?.()}
              />
            </div>

            {/* 深度思考 */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">深度思考</p>
              <ToggleSwitch
                checked={enableThinking || false}
                onChange={() => onToggleThinking?.()}
              />
            </div>
          </>
        ) : isImage ? (
          <>
            {/* 宽高比 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">宽高比</p>
              <ChipGroup
                options={IMAGE_RATIOS}
                value={imageParams.ratio}
                onChange={(v) => updateImageParams({ ratio: v })}
              />
            </div>

            {/* 生成数量 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">生成数量</p>
              <ChipGroup
                options={IMAGE_COUNTS.map((c) => ({ value: c, label: `${c}张` }))}
                value={imageParams.count}
                onChange={(v) => updateImageParams({ count: v })}
              />
            </div>

            {/* 图片质量 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">图片质量</p>
              <ChipGroup
                options={IMAGE_QUALITIES}
                value={imageParams.quality}
                onChange={(v) => updateImageParams({ quality: v })}
              />
            </div>

            {/* 优化提示词 */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">优化提示词</p>
              <ToggleSwitch
                checked={imageParams.optimizePrompt}
                onChange={() =>
                  updateImageParams({ optimizePrompt: !imageParams.optimizePrompt })
                }
              />
            </div>
          </>
        ) : (
          <>
            {/* 时长 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">时长</p>
              <ChipGroup
                options={VIDEO_DURATIONS.map((d) => ({ value: d, label: `${d}s` }))}
                value={videoParams.duration}
                onChange={(v) => updateVideoParams({ duration: v })}
              />
            </div>

            {/* 宽高比 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">宽高比</p>
              <ChipGroup
                options={VIDEO_RATIOS}
                value={videoParams.ratio}
                onChange={(v) => updateVideoParams({ ratio: v })}
              />
            </div>

            {/* 分辨率 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">分辨率</p>
              <ChipGroup
                options={VIDEO_RESOLUTIONS}
                value={videoParams.resolution}
                onChange={(v) => updateVideoParams({ resolution: v })}
              />
            </div>

            {/* 生成数量 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-foreground mb-2">生成数量</p>
              <ChipGroup
                options={IMAGE_COUNTS.map((c) => ({ value: c, label: `${c}个` }))}
                value={videoParams.count}
                onChange={(v) => updateVideoParams({ count: v })}
              />
            </div>

            {/* 生成模式 */}
            <div>
              <p className="text-xs font-medium text-foreground mb-2">生成模式</p>
              <ChipGroup
                options={VIDEO_MODES}
                value={videoParams.mode}
                onChange={(v) => updateVideoParams({ mode: v })}
              />
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
