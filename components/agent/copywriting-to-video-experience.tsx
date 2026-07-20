'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Send,
  Wand2,
  Minus,
  Plus,
  Volume2,
  Zap,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Agent } from '@/lib/mock-data'

// ============================================================
// Types
// ============================================================

interface CopywritingToVideoExperienceProps {
  agent: Agent
  text: string
  paramValues: Record<string, any>
  onTextChange: (text: string) => void
  onParamChange: (id: string, value: any) => void
  error?: string
  isProcessing?: boolean
  progress?: number
  progressSteps?: { label: string; status: 'pending' | 'running' | 'done' }[]
  costPoints?: number
  processTime?: string
  onStartProcess: () => void
}

// ============================================================
// Options
// ============================================================

const ratioOptions = [
  { value: 'auto', label: '自适应' },
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
]

const resolutionOptions = [
  { value: '540p', label: '540P' },
  { value: '720p', label: '720P' },
  { value: '1080p', label: '1080P' },
]

const durationOptions = Array.from({ length: 13 }, (_, i) => (i + 3).toString())

const examplePlaceholder =
  '示例：花园的叶子上，住着一群小精灵。镜头右摇，主角从家中走出——身着花瓣斗篷，手持草叶魔杖，魔杖顶端嵌着一颗发光的黄色宝石。微观世界风格。小精灵用低沉的声音说："美好的清晨，从早安开始。"'

// ============================================================
// Compact Select Trigger
// ============================================================

function ToolbarSelect({
  value,
  options,
  onChange,
  title,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  title?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 min-w-[5rem] w-auto px-2 text-[11px] rounded-md border-border/30 bg-white dark:bg-[#0A0A0E] hover:border-border/50 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {title && (
          <div className="px-2 py-1.5 border-b border-border/20">
            <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">{title}</span>
          </div>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ============================================================
// Duration Stepper with Popup Slider
// ============================================================

function DurationStepper({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const index = durationOptions.indexOf(value)
  const canDecrease = index > 0
  const canIncrease = index < durationOptions.length - 1
  const [showPopup, setShowPopup] = useState(false)

  const decrease = () => { if (canDecrease) onChange(durationOptions[index - 1]) }
  const increase = () => { if (canIncrease) onChange(durationOptions[index + 1]) }

  return (
    <div className="relative inline-flex items-center">
      <div className="inline-flex items-center rounded-md border border-border/30 bg-white dark:bg-[#0A0A0E] overflow-hidden cursor-pointer" onClick={() => setShowPopup(!showPopup)}>
        <button type="button" onClick={(e) => { e.stopPropagation(); decrease() }} disabled={!canDecrease} className="h-7 w-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Minus className="h-3 w-3" />
        </button>
        <span className="h-7 px-1.5 flex items-center justify-center text-[11px] font-medium tabular-nums min-w-[2.5rem] text-foreground/70">
          {value}S
        </span>
        <button type="button" onClick={(e) => { e.stopPropagation(); increase() }} disabled={!canIncrease} className="h-7 w-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {showPopup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#1A1A1E] border border-border/30 rounded-xl p-4 shadow-2xl z-50 min-w-[220px]" onClick={(e) => e.stopPropagation()}>
          {/* 第一行：标题 */}
          <div className="mb-2">
            <span className="text-[11px] text-muted-foreground/50">时长设置</span>
          </div>
          {/* 第二行：进度条 + 当前值 */}
          <div className="flex items-center gap-3">
            <input type="range" min="3" max="15" value={Number(value)} onChange={(e) => onChange(e.target.value)}
              className="flex-1 h-1.5 bg-muted/60 rounded-full appearance-none cursor-pointer accent-violet-500" />
            <span className="text-xs font-semibold tabular-nums text-foreground shrink-0 w-8 text-right">{value}S</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

export function CopywritingToVideoExperienceArea({
  agent,
  text,
  paramValues,
  onTextChange,
  onParamChange,
  error,
  isProcessing,
  progress,
  progressSteps,
  costPoints,
  processTime,
  onStartProcess,
}: CopywritingToVideoExperienceProps) {
  const ratio = paramValues.ratio || 'auto'
  const resolution = paramValues.resolution || '540p'
  const duration = String(paramValues.duration || '5')
  const bgm = !!paramValues.bgm

  const handleSend = useCallback(() => {
    if (isProcessing) return
    onStartProcess()
  }, [isProcessing, onStartProcess])

  return (
    <div className="w-full space-y-4">
      {/* ========================================== */}
      {/* LEFT: 文案输入                                                    */}
      {/* ========================================== */}
      <div className="relative">
        <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden h-full gap-0">
          <CardContent className="p-0 flex flex-col h-full">
            {/* 标题栏 */}
            <div className="flex items-center px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-violet-400 dark:bg-violet-500 shrink-0" />
                <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight">输入视频文案</h3>
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 px-4 py-3">
              <Textarea
                id="copywriting-to-video-textarea"
                placeholder={examplePlaceholder}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                className="min-h-[260px] h-full resize-none rounded-lg border-0 shadow-none bg-white dark:bg-[#0A0A0E] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-muted-foreground/35"
              />
              <span className={cn(
                'absolute bottom-5 right-6 text-[10px] font-medium tabular-nums tracking-tight',
                text.length > 4500 ? 'text-destructive/80' : 'text-muted-foreground/40'
              )}>
                {text.length}/5000
              </span>
            </div>

            {/* 底部工具栏 */}
            <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-border/20 bg-[#FAFAFC] dark:bg-[#111115]">
              <div className="flex items-center gap-2 flex-wrap">
                <ToolbarSelect value={ratio} options={ratioOptions} onChange={(v) => onParamChange('ratio', v)} title="画面比例" />
                <ToolbarSelect value={resolution} options={resolutionOptions} onChange={(v) => onParamChange('resolution', v)} title="清晰度" />
                <DurationStepper value={duration} onChange={(v) => onParamChange('duration', v)} />
                <span className="w-px h-5 bg-border/30" />
                <div className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-border/30 bg-white dark:bg-[#0A0A0E]">
                  <Volume2 className="h-3 w-3 text-muted-foreground/60" />
                  <span className="text-[11px] text-muted-foreground/60">声音</span>
                  <Switch checked={bgm} onCheckedChange={(checked) => onParamChange('bgm', checked)} className="scale-75" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground/50">
                  <Zap className="h-3 w-3" />{agent.costPoints}
                </span>
                <Button className="h-8 px-3 text-[12px] rounded-lg gap-1.5" onClick={handleSend} disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />生成中</> : <><Send className="h-3.5 w-3.5" />发送</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading 覆盖层 */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#FBFBFD]/80 dark:bg-[#0F0F12]/80 backdrop-blur-[2px]" />
            <div className="relative z-10 text-center space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/60" />
              </div>
              {progressSteps && progressSteps.length > 0 ? (
                <div className="space-y-1.5">
                  {progressSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      ) : step.status === 'running' ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-border shrink-0" />
                      )}
                      <span className={cn(
                        step.status === 'done' ? 'text-emerald-600' : step.status === 'running' ? 'text-foreground/80' : 'text-muted-foreground/50'
                      )}>
                        {step.label}
                        {step.status === 'running' && progress != null && ` ${Math.round(progress)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/50">处理中…{progress != null ? ` ${Math.round(progress)}%` : ''}</p>
              )}
              {costPoints && processTime && (
                <p className="text-[10px] text-muted-foreground/40">预计消耗 {costPoints} 智点 · 约 {processTime}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
