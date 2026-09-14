'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  UploadSimple,
  X,
  FileAudio,
  FileVideo,
  FileImage,
  FileText,
  Warning,
  Play,
  Pause,
  MagicWand,
  BookOpen,
  Sparkle,
  TextT,
  Globe,
  SpeakerHigh,
  MusicNote,
  Crop,
  Plus,
  Trash,
  CheckCircle,
  Spinner,
  Translate,
  Lightning,
  WarningCircle as AlertCircle,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Agent } from '@/lib/mock-data'

// ============================================================
// Types
// ============================================================

export interface SelectedRegion {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface AgentInputAreaProps {
  agent: Agent
  file: File | null
  text: string
  paramValues: Record<string, any>
  onFileChange: (file: File | null) => void
  onTextChange: (text: string) => void
  onParamChange: (id: string, value: any) => void
  error?: string
  isProcessing?: boolean
  progress?: number
  progressSteps?: { label: string; status: 'pending' | 'running' | 'done' }[]
  onStartProcess?: () => void
}

// ============================================================
// Utility
// ============================================================

function getFileCategory(ext: string): string {
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) return 'video'
  if (['.mp3', '.wav', '.m4a', '.flac', '.aac'].includes(ext)) return 'audio'
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'].includes(ext))
    return 'image'
  return 'text'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fileTypeIcons: Record<string, React.ReactNode> = {
  video: <FileVideo className="h-8 w-8 text-primary" />,
  audio: <FileAudio className="h-8 w-8 text-rose-500" />,
  image: <FileImage className="h-8 w-8 text-emerald-500" />,
  text: <FileText className="h-8 w-8 text-amber-500" />,
}

// ============================================================
// Quick Fill Buttons (for text-to-speech & similar)
// ============================================================

const quickFillActions = [
  { id: 'ai-write', label: 'AI帮我写', icon: MagicWand },
  { id: 'random-story', label: '随机故事', icon: BookOpen },
  { id: 'upload-txt', label: '上传txt', icon: FileText },
  { id: 'translate', label: '翻译', icon: Globe },
  { id: 'pause', label: '插入停顿', icon: TextT },
]

function QuickFillBar({
  onAction,
}: {
  onAction: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap p-1 rounded-xl bg-secondary/50 border border-border/40">
      {quickFillActions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 rounded-lg hover:bg-background hover:shadow-sm transition-all"
            onClick={() => onAction(action.id)}
          >
            <Icon className="h-3 w-3 text-muted-foreground" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

// ============================================================
// File Upload Zone
// ============================================================

function FileUploadZone({
  acceptedFiles,
  maxFileSize,
  file,
  onFileChange,
}: {
  acceptedFiles?: string[]
  maxFileSize?: number
  file: File | null
  onFileChange: (file: File | null) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileChange(droppedFile)
    },
    [onFileChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null
      onFileChange(selectedFile)
      e.target.value = ''
    },
    [onFileChange]
  )

  const acceptedExtensions = acceptedFiles?.join(',') || '*'
  const fileExt = file ? `.${file.name.split('.').pop()?.toLowerCase()}` : ''
  const fileCategory = file ? getFileCategory(fileExt) : 'text'

  if (file) {
    const isImage = fileCategory === 'image'
    const isVideo = fileCategory === 'video'

    return (
      <div className="rounded-xl border border-border bg-secondary/30 overflow-hidden">
        {/* Preview for image/video */}
        {(isImage || isVideo) && (
          <div className="relative w-full bg-black/5">
            {isImage && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full max-h-[240px] object-contain mx-auto"
              />
            )}
            {isVideo && (
              <video
                src={URL.createObjectURL(file)}
                className="w-full max-h-[240px] mx-auto"
                controls
              />
            )}
          </div>
        )}
        {/* File info bar */}
        <div className="flex items-center gap-3 p-3">
          {fileTypeIcons[fileCategory] || fileTypeIcons.text}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              重选
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onFileChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedExtensions}
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer',
        'bg-secondary/30',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-accent/50'
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
        <UploadSimple className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-foreground mb-1">
        拖拽文件到此处，或 <span className="text-primary font-medium">点击上传</span>
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        {acceptedFiles && (
          <span>支持 {acceptedFiles.join('、')}</span>
        )}
        {maxFileSize && (
          <span>· 最大 {maxFileSize}MB</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions}
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  )
}

// ============================================================
// Voice Selector (声音选择卡片)
// ============================================================

const voicePresets = [
  { value: 'female-gentle', label: '温柔女声', tag: '女声', desc: '温暖知性，情感细腻，适合有声读物、产品解说', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { value: 'female-lively', label: '活泼女声', tag: '女声', desc: '俏皮灵动，元气满满，适合短视频、带货广告', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { value: 'male-calm', label: '沉稳男声', tag: '男声', desc: '大气稳重，字正腔圆，适合新闻播报、品牌视频', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'male-deep', label: '磁性男声', tag: '男声', desc: '低沉醇厚，感染力强，适合广告配音、播客开场', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { value: 'child', label: '可爱童声', tag: '童声', desc: '天真烂漫，自然灵动，适合儿童内容、在线教育', color: 'bg-amber-50 border-amber-200 text-amber-700' },
]

function VoiceSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const togglePreview = (voiceValue: string) => {
    if (playingVoice === voiceValue) {
      setPlayingVoice(null)
    } else {
      setPlayingVoice(voiceValue)
      setTimeout(() => setPlayingVoice(null), 2000)
    }
  }

  return (
    <div className="space-y-3">
      {/* Voice cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {voicePresets.map((voice) => {
          const isSelected = value === voice.value
          const isPlaying = playingVoice === voice.value
          return (
            <button
              key={voice.value}
              onClick={() => onChange(voice.value)}
              className={cn(
                'group relative rounded-lg border p-3 text-left transition-all duration-200',
                isSelected
                  ? 'border-border/50 bg-[#F8F9FB] dark:bg-[#131418] ring-1 ring-border/30'
                  : 'border-border/20 bg-white dark:bg-[#0A0A0E] hover:border-border/40 hover:bg-[#FAFAFC] dark:hover:bg-[#111115]'
              )}
            >
              {/* Top: Tag + Play preview */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md px-1.5 py-px text-[10px] font-medium leading-none',
                    voice.color
                  )}
                >
                  {voice.tag}
                </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePreview(voice.value)
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
                    isPlaying
                      ? 'bg-foreground/10 text-foreground scale-110'
                      : 'bg-muted/60 text-muted-foreground/60 group-hover:bg-muted group-hover:text-foreground/70'
                  )}
                >
                  {isPlaying ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3 ml-0.5" />
                  )}
                </div>
              </div>

              {/* Name */}
              <p
                className={cn(
                  'text-[13px] font-medium mb-1 transition-colors tracking-tight',
                  isSelected ? 'text-foreground' : 'text-foreground/80'
                )}
              >
                {voice.label}
              </p>

              {/* Description */}
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                {voice.desc}
              </p>

              {/* Waveform decoration */}
              <div className="flex items-end gap-px mt-2 h-4 opacity-20 group-hover:opacity-30 transition-opacity">
                {[3, 6, 4, 8, 5, 7, 4, 9, 5, 3, 6, 4, 7, 5, 8, 4, 6, 3, 5, 7].map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-0.5 rounded-full transition-colors',
                      isSelected ? 'bg-foreground/70' : 'bg-foreground/30'
                    )}
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5">
                <CheckCircle className="h-3.5 w-3.5 text-foreground/70" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Region Picker (区域框选 - 简化版)
// ============================================================

function RegionPicker({
  regions,
  onChange,
}: {
  regions: SelectedRegion[]
  onChange: (regions: SelectedRegion[]) => void
}) {
  const addRegion = () => {
    const newRegion: SelectedRegion = {
      id: `region-${Date.now()}`,
      x: 10,
      y: 10,
      width: 30,
      height: 20,
    }
    onChange([...regions, newRegion])
  }

  const removeRegion = (id: string) => {
    onChange(regions.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Crop className="h-3.5 w-3.5 text-muted-foreground" />
          水印区域
        </Label>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={addRegion}
          disabled={regions.length >= 5}
        >
          <Plus className="h-3 w-3" />
          添加区域
        </Button>
      </div>

      {regions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            点击"添加区域"框选水印位置，最多5个
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {regions.map((region, index) => (
            <div
              key={region.id}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card"
            >
              <Badge variant="secondary" className="text-[10px] shrink-0">
                区域{index + 1}
              </Badge>
              <div className="flex-1 grid grid-cols-4 gap-2">
                {(['x', 'y', 'width', 'height'] as const).map((field) => (
                  <div key={field} className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {field}
                    </span>
                    <Input
                      type="number"
                      value={region[field]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        onChange(
                          regions.map((r) =>
                            r.id === region.id ? { ...r, [field]: val } : r
                          )
                        )
                      }}
                      className="h-7 text-xs px-1.5"
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeRegion(region.id)}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Param Field Renderer
// ============================================================

function ParamField({
  param,
  value,
  onChange,
}: {
  param: Agent['parameters'][number]
  value: any
  onChange: (value: any) => void
}) {
  // Voice selector special rendering
  if (
    param.id === 'voice' &&
    (param.label === '配音音色' || param.label.includes('音色'))
  ) {
    return <VoiceSelector value={String(value)} onChange={onChange} />
  }

  switch (param.type) {
    case 'select':
      return (
        <div className="space-y-2">
          <span className="text-[13px] text-foreground/70">{param.label}</span>
          <Select value={String(value ?? param.options?.[0]?.value ?? '')} onValueChange={onChange}>
            <SelectTrigger className="w-full h-9 rounded-lg border-border/30 bg-white dark:bg-[#0A0A0E] text-[13px] hover:border-border/50 transition-colors">
              <SelectValue placeholder={param.label} />
            </SelectTrigger>
            <SelectContent>
              {param.options?.filter(opt => opt.value !== '' && opt.value != null).map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case 'switch':
      return (
        <div className="flex items-center justify-between py-1">
          <span className="text-[13px] text-foreground/70">{param.label}</span>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      )

    case 'slider':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-foreground/70">{param.label}</span>
            <span className="inline-flex items-center justify-center min-w-[42px] h-5 px-1.5 text-[10px] font-medium text-muted-foreground bg-muted/60 rounded-md tabular-nums">
              {value}
              {param.label === '音量' && '%'}
              {param.label === '语速' && 'x'}
            </span>
          </div>
          <Slider
            value={[Number(value)]}
            onValueChange={(vals) => onChange(vals[0])}
            min={param.min}
            max={param.max}
            step={param.step}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/50 tabular-nums">{param.min}{param.label === '音量' ? '%' : param.label === '语速' ? 'x' : ''}</span>
            <span className="text-[10px] text-muted-foreground/50 tabular-nums">{param.max}{param.label === '音量' ? '%' : param.label === '语速' ? 'x' : ''}</span>
          </div>
        </div>
      )

    case 'text':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{param.label}</Label>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-10"
          />
        </div>
      )

    default:
      return null
  }
}

// ============================================================
// Speech-to-Text Custom Input Area
// ============================================================

function SpeechToTextInputArea({
  agent,
  file,
  onFileChange,
  paramValues,
  onParamChange,
  error,
  isProcessing,
  progress,
  progressSteps,
  onStartProcess,
}: {
  agent: Agent
  file: File | null
  onFileChange: (file: File | null) => void
  paramValues: Record<string, any>
  onParamChange: (id: string, value: any) => void
  error?: string
  isProcessing?: boolean
  progress?: number
  progressSteps?: { label: string; status: 'pending' | 'running' | 'done' }[]
  onStartProcess?: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileChange(droppedFile)
    },
    [onFileChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null
      onFileChange(selectedFile)
      e.target.value = ''
    },
    [onFileChange]
  )

  const acceptedExtensions = agent.acceptedFiles?.join(',') || '*'
  const distinguishSpeaker = !!paramValues.distinguishSpeaker

  return (
    <div className="space-y-4 w-full">
      {/* Processing state */}
      {isProcessing ? (
        <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center space-y-4">
          <Spinner className="h-8 w-8 text-primary animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">AI 正在转写中...</p>
            {progressSteps && progressSteps.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {progressSteps.map((step, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full transition-colors',
                      step.status === 'done'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : step.status === 'running'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : file ? (
        /* File selected state */
        <div className="rounded-xl border border-border bg-secondary/30 overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <FileAudio className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onFileChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Upload drop zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
            'bg-secondary/30',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30 hover:bg-accent/50'
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <UploadSimple className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-foreground mb-4">
            拖拽音视频文件到此处，或 <span className="text-primary font-medium">点击上传</span>
          </p>

          {/* Distinguish speaker toggle */}
          <div
            className="inline-flex items-center gap-2 mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-muted-foreground">区分说话人</span>
            <Switch
              checked={distinguishSpeaker}
              onCheckedChange={(checked) => onParamChange('distinguishSpeaker', checked)}
            />
          </div>

          {/* File requirements */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileAudio className="h-3 w-3" />
              mp3/mp4/mov/webm/wav等30种格式
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span>视频 ≤ 4GB；音频 ≤ 500M</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>时长 ≤ 5小时</span>
          </div>

          {/* Estimated cost */}
          <div className="absolute right-3 bottom-2 text-xs text-muted-foreground">
            预计消耗：
            <span className="font-semibold text-foreground">{agent.costPoints} 智点</span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={acceptedExtensions}
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <Warning className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Video Translate Custom Input Area
// (参考 reccloud.cn/ai-translate 上传区设计)
// ============================================================

function VideoTranslateInputArea({
  agent,
  file,
  onFileChange,
  error,
  isProcessing,
  progress,
  progressSteps,
}: {
  agent: Agent
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
  isProcessing?: boolean
  progress?: number
  progressSteps?: { label: string; status: 'pending' | 'running' | 'done' }[]
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileChange(droppedFile)
    },
    [onFileChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null
      onFileChange(selectedFile)
      e.target.value = ''
    },
    [onFileChange]
  )

  const acceptedExtensions = agent.acceptedFiles?.join(',') || '*'

  // Processing state — (已废弃，由 experience area 处理)
  if (isProcessing) {
    return (
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-foreground">AI 正在翻译处理中...</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state — upload drop zone (参考 reccloud.cn 设计)
  return (
    <Card className="border-border/60 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Drag & drop area — 上传区与按钮视觉一体 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'p-4 text-center transition-all flex flex-col items-center gap-5',
            'bg-secondary/20',
            isDragging && 'bg-primary/5'
          )}
        >
          {/* Dashed border zone — 上传按钮与提示文案都在虚线区内 */}
          <div
            onClick={() => inputRef.current?.click()}
            className={cn(
              'relative w-full border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center gap-5',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-accent/30'
            )}
          >
            {/* Center upload icon */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <UploadSimple className="h-6 w-6 text-primary" />
            </div>
            {/* Drag hint text */}
            <p className="text-sm text-muted-foreground">
              拖拽本地音视频文件到这里
            </p>

            {/* Upload button — inside dashed zone */}
            <Button
              className="h-11 gap-2 px-8"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              <UploadSimple className="h-4 w-4" />
              上传文件
            </Button>

            {/* Format / size / duration hints */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>mp3/mp4/mov/webm/wav等30种格式</span>
              <span className="text-border/60">|</span>
              <span>视频 ≤ 4GB；音频 ≤ 500M</span>
              <span className="text-border/60">|</span>
              <span>时长 ≤ 3小时</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions}
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm">
          <Warning className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </Card>
  )
}

// ============================================================
// Main Component
// ============================================================

export function AgentInputArea({
  agent,
  file,
  text,
  paramValues,
  onFileChange,
  onTextChange,
  onParamChange,
  error,
  isProcessing,
  progress,
  progressSteps,
  onStartProcess,
}: AgentInputAreaProps) {
  const [regions, setRegions] = useState<SelectedRegion[]>([])

  // Determine if we should show quick fill bar
  const showQuickFill =
    agent.id === 'text-to-speech'

  // Determine if we should show region picker
  const showRegionPicker =
    agent.id === 'video-remove-watermark' &&
    paramValues.removeArea === 'manual'

  // Handle quick fill actions
  const handleQuickFill = useCallback(
    (actionId: string) => {
      if (actionId === 'random-story') {
        onTextChange('萤火虫的秘密\n深夜，九岁的阿布悄悄溜出外婆家，提着一盏熄灭的马灯走向神秘的黑森林。\n他想抓住传说中能实现愿望的"黄金萤火虫"，来治好外婆的眼睛。林子里静得只能听到他自己的心跳，微风吹过，树叶沙沙作响。突然，前方亮起了一团温暖的微光。那不是一只，而是成千上万只萤火虫聚在一起，宛如地上的银河。\n当它们围绕着阿布翩翩起舞时，阿布闭上眼睛，在心里虔诚地许愿。等他再次睁开眼，手里的马灯竟然自己亮了起来，散发出永不熄灭的柔和光芒。阿布开心地笑了，他捧着这盏希望之灯，朝着外婆家的方向飞奔而去。')
        return
      }
    },
    [text, onTextChange]
  )

  // AI写状态
  const [aiWriteKeyword, setAiWriteKeyword] = useState('')
  const [aiWriteGenerating, setAiWriteGenerating] = useState(false)

  const handleAiWriteGenerate = () => {
    if (aiWriteGenerating || !aiWriteKeyword.trim()) return
    setAiWriteGenerating(true)
    setTimeout(() => {
      onTextChange(
        '【' + aiWriteKeyword + '】\n\n' +
        '针对"${keyword}"这一主题，我为您撰写了以下配音文案：\n\n'.replace('${keyword}', aiWriteKeyword) +
        '在这个快速迭代的时代，科技创新正以前所未有的速度改变着我们的生活。' +
        '从清晨智能闹钟的轻柔唤醒，到夜晚智能助手的贴心陪伴，科技已经融入了我们生命中的每一个角落。\n\n' +
        '想象一下，当你迈进家门的那一刻，灯光自动亮起，温度已经调整到最舒适的度数，' +
        '就连你最爱的音乐也已经在背景中轻轻流淌……这一切，不再是科幻电影中的场景，而是正在发生的现实。\n\n' +
        '让我们一起拥抱这个充满无限可能的智能时代，用科技的力量，去创造更美好的明天。'
      )
      setAiWriteGenerating(false)
    }, 1500)
  }

  // Handle txt upload for quick fill
  const handleTxtUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = e.target.files?.[0]
      if (uploadedFile) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          onTextChange((ev.target?.result as string) || '')
        }
        reader.readAsText(uploadedFile)
      }
      e.target.value = ''
    },
    [onTextChange]
  )

  // Custom input area for speech-to-text and video-to-text
  if (agent.id === 'speech-to-text' || agent.id === 'video-to-text') {
    return (
      <SpeechToTextInputArea
        agent={agent}
        file={file}
        onFileChange={onFileChange}
        paramValues={paramValues}
        onParamChange={onParamChange}
        error={error}
        isProcessing={isProcessing}
        progress={progress}
        progressSteps={progressSteps}
        onStartProcess={onStartProcess}
      />
    )
  }

  // Custom input area for video translate
  if (agent.id === 'video-translate') {
    return (
      <VideoTranslateInputArea
        agent={agent}
        file={file}
        onFileChange={onFileChange}
        error={error}
        isProcessing={isProcessing}
        progress={progress}
        progressSteps={progressSteps}
      />
    )
  }

  return (
    <div className="space-y-4 w-full">
      {/* === File Upload === */}
      {(agent.inputType === 'file' || agent.inputType === 'both') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            上传文件
          </Label>
          <FileUploadZone
            acceptedFiles={agent.acceptedFiles}
            maxFileSize={agent.maxFileSize}
            file={file}
            onFileChange={onFileChange}
          />
        </div>
      )}

      {/* === Region Picker (for watermark removal) === */}
      {showRegionPicker && (
        <RegionPicker regions={regions} onChange={setRegions} />
      )}

      {/* === Text Input === */}
      {(agent.inputType === 'text' || agent.inputType === 'both') && (
        <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden">
          <CardContent className="p-0">
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-violet-400 dark:bg-violet-500" />
                <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight">输入内容</h3>
                {showQuickFill && (
                  <div className="hidden sm:flex items-center gap-0.5 ml-2 pl-2 border-l border-border/30">
                    {/* AI帮我写 — Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors">
                          <MagicWand className="h-3 w-3" />
                          AI帮我写
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="start" className="w-72 p-0 overflow-hidden shadow-xl border-border/80">
                        <div className="px-4 py-3 border-b border-border/20 bg-secondary/30">
                          <span className="text-xs font-semibold text-foreground">AI 智能写作</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <Input value={aiWriteKeyword} onChange={(e) => setAiWriteKeyword(e.target.value)} placeholder="输入关键词，使用AI帮写生成完整故事内容" className="h-9 text-sm rounded-lg" onKeyDown={(e) => e.key === 'Enter' && handleAiWriteGenerate()} />
                          <Button className="w-full h-9 text-sm gap-2 rounded-lg" onClick={handleAiWriteGenerate} disabled={aiWriteGenerating}>
                            {aiWriteGenerating ? <><Spinner className="h-3.5 w-3.5 animate-spin" />生成中...</> : (<><Sparkle className="h-3.5 w-3.5" />生成<span className="flex items-center gap-1 ml-1 text-xs font-normal opacity-70"><span className="w-px h-3 bg-primary-foreground/30" /><Lightning className="h-3 w-3" />1</span></>)}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {/* 随机故事 */}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" onClick={() => handleQuickFill('random-story')}>
                      <BookOpen className="h-3 w-3" />
                      随机故事
                    </Button>
                    {/* 上传txt */}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" onClick={() => document.getElementById('txt-upload')?.click()}>
                      <FileText className="h-3 w-3" />
                      上传txt
                    </Button>
                  </div>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium tabular-nums tracking-tight',
                text.length > 4500 ? 'text-destructive' : 'text-muted-foreground/50'
              )}>
                {text.length}/5000
              </span>
            </div>

            {/* Quick fill bar — 移动端单独显示 */}
            {showQuickFill && (
              <div className="sm:hidden flex items-center gap-1 flex-wrap px-4 py-2 border-b border-border/20 bg-[#FAFAFC] dark:bg-[#111115]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors">
                      <MagicWand className="h-3 w-3" />
                      AI帮我写
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="start" className="w-72 p-0 overflow-hidden shadow-xl border-border/80">
                    <div className="px-4 py-3 border-b border-border/20 bg-secondary/30">
                      <span className="text-xs font-semibold text-foreground">AI 智能写作</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <Input value={aiWriteKeyword} onChange={(e) => setAiWriteKeyword(e.target.value)} placeholder="输入关键词，使用AI帮写生成完整故事内容" className="h-9 text-sm rounded-lg" onKeyDown={(e) => e.key === 'Enter' && handleAiWriteGenerate()} />
                      <Button className="w-full h-9 text-sm gap-2 rounded-lg" onClick={handleAiWriteGenerate} disabled={aiWriteGenerating}>
                        {aiWriteGenerating ? <><Spinner className="h-3.5 w-3.5 animate-spin" />生成中...</> : (<><Sparkle className="h-3.5 w-3.5" />生成<span className="flex items-center gap-1 ml-1 text-xs font-normal opacity-70"><span className="w-px h-3 bg-primary-foreground/30" /><Lightning className="h-3 w-3" />1</span></>)}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" onClick={() => handleQuickFill('random-story')}>
                  <BookOpen className="h-3 w-3" />
                  随机故事
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors" onClick={() => document.getElementById('txt-upload')?.click()}>
                  <FileText className="h-3 w-3" />
                  上传txt
                </Button>
              </div>
            )}
            <input
              id="txt-upload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleTxtUpload}
            />

            <div className="px-4 py-3">
              <Textarea
                id="agent-input-textarea"
                placeholder={
                  agent.id === 'text-to-speech'
                    ? '输入你想要的配音文案，AI 即刻生成带情感的自然人声…'
                    : '请输入内容...'
                }
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                className="min-h-[160px] resize-none rounded-lg border-0 shadow-none bg-white dark:bg-[#0A0A0E] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-muted-foreground/40"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* === Parameters === */}
      {agent.parameters.length > 0 && (
        <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-slate-400/60 dark:bg-slate-500/60" />
                <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight">参数设置</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {agent.parameters.map((param) => (
                <ParamField
                  key={param.id}
                  param={param}
                  value={paramValues[param.id]}
                  onChange={(value) => onParamChange(param.id, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === Error === */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
