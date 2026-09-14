'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  DownloadSimple,
  FileText,
  FileAudio,
  FileVideo,
  FileImage,
  CheckCircle,
  Spinner,
  Copy,
  Translate,
  MagnifyingGlass,
  ArrowsClockwise,
  Play,
  Pause,
  SpeakerHigh,
  ImageSquare,
  Trash,
  CaretDown,
  CaretUp,
  Sparkle,
  Clock,
  Lightning,
  Spinner as Loader2,
  CheckCircle as CheckCircle2,
  SpeakerHigh as Volume2,
  DownloadSimple as Download,
  ImageSquare as ImagePlus,
  Trash as Trash2,
  CaretUp as ChevronUp,
  ArrowsClockwise as RefreshCw,
  Sparkle as Sparkles,
  Lightning as Zap,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// ============================================================
// Types
// ============================================================

export type ResultType = 'text' | 'audio' | 'video' | 'image' | 'file' | 'storyboard'

export interface SpeakerSegment {
  id: string
  speaker: string
  startTime: string
  endTime: string
  text: string
}

export interface StoryboardShot {
  id: string
  index: number
  duration: string
  description: string
  caption?: string
  imageUrl?: string
  voiceUrl?: string
}

export interface MultiVoiceResult {
  speaker: string
  voiceType: string
  audioUrl: string
  text: string
}

export interface AgentResultAreaProps {
  isProcessing: boolean
  resultType?: ResultType
  resultContent?: string
  resultUrl?: string
  resultFileName?: string
  progress?: number
  progressSteps?: { label: string; status: 'pending' | 'running' | 'done' }[]
  segments?: SpeakerSegment[]
  storyboard?: StoryboardShot[]
  multiVoiceResults?: MultiVoiceResult[]
  onDownload?: () => void
  onRetry?: () => void
  costPoints?: number
  processTime?: string
}

// ============================================================
// Processing State with Steps
// ============================================================

function ProcessingState({
  progress,
  steps,
}: {
  progress: number
  steps?: { label: string; status: 'pending' | 'running' | 'done' }[]
}) {
  return (
    <div className="space-y-5">
      {/* Progress Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">AI 处理中…</p>
          <p className="text-xs text-muted-foreground">请稍候，正在为您生成结果</p>
        </div>
        <span className="text-base font-bold text-primary tabular-nums">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500 rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Steps */}
      {steps && steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                step.status === 'done'
                  ? 'bg-primary/5'
                  : step.status === 'running'
                    ? 'bg-accent border border-primary/20 shadow-sm'
                    : 'bg-secondary/30 opacity-50'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all',
                  step.status === 'done'
                    ? 'bg-primary text-primary-foreground'
                    : step.status === 'running'
                      ? 'border-2 border-primary border-t-transparent animate-spin shadow-sm shadow-primary/20'
                      : 'border-2 border-muted-foreground/30'
                )}
              >
                {step.status === 'done' && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
              </div>
              <span
                className={cn(
                  'text-sm transition-colors',
                  step.status === 'running'
                    ? 'text-foreground font-semibold'
                    : step.status === 'done'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {step.status === 'done' && (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 ml-auto shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skeleton placeholder */}
      {!steps && (
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
        </div>
      )}
    </div>
  )
}

// ============================================================
// Text Result with Toolbar (Transcription Style)
// ============================================================

function TextResult({
  content,
  segments,
  onDownload,
}: {
  content?: string
  segments?: SpeakerSegment[]
  onDownload?: () => void
}) {
  const [activeTab, setActiveTab] = useState<'text' | 'translation'>('text')
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(content || '')
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  const displayContent = isEditing ? editedText : content

  return (
    <div className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1"
        >
          <Button
            variant={activeTab === 'text' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setActiveTab('text')}
          >
            原文
          </Button>
          <Button
            variant={activeTab === 'translation' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setActiveTab('translation')}
          >
            <Translate className="h-3 w-3 mr-1" />
            翻译
          </Button>
        </div>
        <div className="flex items-center gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-primary" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                复制
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '完成编辑' : '编辑'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={onDownload}
          >
            <DownloadSimple className="h-3 w-3" />
            下载
          </Button>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[300px] resize-none font-mono text-sm"
        />
      ) : segments && segments.length > 0 ? (
        /* Segmented display with timestamps and speakers */
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1"
        >
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5"
              >
                <Badge variant="secondary" className="text-[10px]"
                >
                  {seg.speaker}
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono"
                >
                  {seg.startTime} - {seg.endTime}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed"
              >{seg.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 max-h-[400px] overflow-y-auto"
        >
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed"
          >
            {displayContent}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Audio Result with Player
// ============================================================

function AudioResult({
  url,
  fileName,
  onDownload,
}: {
  url?: string
  fileName?: string
  onDownload?: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="space-y-4">
      {/* Professional Audio Player Card */}
      <div className="rounded-xl overflow-hidden border border-slate-700/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-5 space-y-4">
          {/* Top row: Play button + Info */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shrink-0',
                'bg-white/10 hover:bg-white/15 border border-white/10',
                isPlaying && 'bg-primary/20 border-primary/30 shadow-sm shadow-primary/10'
              )}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </button>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate">
                {fileName || '生成的音频'}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-white/50">AI 语音合成</span>
                <span className="inline-flex items-center gap-1 text-xs text-white/40">
                  <Volume2 className="h-3 w-3" />
                  MP3
                </span>
              </div>
            </div>

            {/* Type badge */}
            <Badge className="bg-white/10 text-white/70 border-white/10 text-[10px] shrink-0">
              <FileAudio className="h-3 w-3 mr-1" />
              音频
            </Badge>
          </div>

          {/* Waveform visualization (static decorative) */}
          <div className="flex items-end gap-px h-8 opacity-25">
            {[4, 8, 12, 6, 16, 10, 20, 14, 18, 8, 22, 12, 16, 24, 10, 14,
              6, 18, 12, 20, 8, 16, 10, 22, 14, 18, 6, 12, 20, 8, 16, 10,
              4, 14, 18, 8, 22, 12, 16, 6, 20, 10, 14, 8, 18, 12, 6, 10].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-white/25"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          {/* Native audio controls */}
          {url && (
            <audio
              src={url}
              controls
              className="w-full mt-3"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1 h-10 text-sm"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          下载音频
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-10 text-sm"
        >
          <Copy className="h-4 w-4 mr-2" />
          复制链接
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Video Result
// ============================================================

function VideoResult({
  url,
  fileName,
  onDownload,
}: {
  url?: string
  fileName?: string
  onDownload?: () => void
}) {
  return (
    <div className="space-y-4"
    >
      <div className="rounded-xl overflow-hidden border border-border bg-black"
      >
        {url ? (
          <video controls className="w-full max-h-[360px]"
          >
            <source src={url} />
            您的浏览器不支持视频播放
          </video>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-muted"
          >
            <FileVideo className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2"
      >
        <Button
          variant="outline"
          className="flex-1 h-10"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          下载视频
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-10"
        >
          <Copy className="h-4 w-4 mr-2" />
          复制链接
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Image Result
// ============================================================

function ImageResult({
  url,
  onDownload,
}: {
  url?: string
  onDownload?: () => void
}) {
  return (
    <div className="space-y-4"
    >
      <div className="rounded-xl overflow-hidden border border-border bg-secondary/30"
      >
        {url && (
          <img
            src={url}
            alt="处理结果"
            className="w-full h-auto object-contain max-h-[400px] mx-auto"
          />
        )}
      </div>
      <div className="flex items-center gap-2"
      >
        <Button
          variant="outline"
          className="flex-1 h-10"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          下载图片
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-10"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          继续编辑
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Storyboard Result (分镜编辑)
// ============================================================

function StoryboardResult({
  shots,
  onDownload,
}: {
  shots?: StoryboardShot[]
  onDownload?: () => void
}) {
  const [shotList, setShotList] = useState(shots || [])
  const [expandedShot, setExpandedShot] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setShotList(shotList.filter((s) => s.id !== id))
  }

  const handleDuplicate = (shot: StoryboardShot) => {
    const newShot: StoryboardShot = {
      ...shot,
      id: `shot-${Date.now()}`,
      index: shotList.length + 1,
    }
    setShotList([...shotList, newShot])
  }

  if (shotList.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground"
      >
        <FileVideo className="h-10 w-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm"
        >暂无分镜数据</p>
      </div>
    )
  }

  return (
    <div className="space-y-4"
    >
      {/* Shot List */}
      <div className="space-y-3"
      >
        {shotList.map((shot, index) => {
          const isExpanded = expandedShot === shot.id
          return (
            <div
              key={shot.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                isExpanded
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card hover:border-primary/20'
              )}
            >
              {/* Shot Header */}
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() =>
                  setExpandedShot(isExpanded ? null : shot.id)
                }
              >
                <Badge
                  variant="secondary"
                  className="shrink-0 text-[10px]"
                >
                  镜{shot.index}
                </Badge>
                <div className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-foreground truncate"
                  >
                    {shot.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground"
                  >
                    时长: {shot.duration}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDuplicate(shot)
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(shot.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <CaretDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3"
                >
                  {shot.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-border"
                    >
                      <img
                        src={shot.imageUrl}
                        alt={`镜${shot.index}`}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  {shot.voiceUrl && (
                    <audio src={shot.voiceUrl} controls className="w-full" />
                  )}
                  <div className="flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1"
                    >
                      <ImageSquare className="h-3 w-3" />
                      替换画面
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      重新生成
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-2 pt-2"
      >
        <Button
          className="flex-1 h-10"
          onClick={onDownload}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          合成完整视频
        </Button>
      </div>
    </div>
  )
}

// ============================================================
// Multi Voice Result (多人配音)
// ============================================================

function MultiVoiceResult({
  results,
  onDownload,
}: {
  results?: MultiVoiceResult[]
  onDownload?: () => void
}) {
  const [playingId, setPlayingId] = useState<string | null>(null)

  if (!results || results.length === 0) return null

  return (
    <div className="space-y-4"
    >
      <div className="space-y-3"
      >
        {results.map((result) => {
          const isPlaying = playingId === result.audioUrl
          return (
            <div
              key={result.audioUrl}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-3"
              >
                <button
                  onClick={() =>
                    setPlayingId(isPlaying ? null : result.audioUrl)
                  }
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isPlaying
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-foreground"
                  >
                    {result.speaker}
                  </p>
                  <p className="text-xs text-muted-foreground"
                  >
                    {result.voiceType}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px]"
                >
                  {result.text.length}字
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg"
              >
                {result.text}
              </p>
              {result.audioUrl && isPlaying && (
                <audio
                  src={result.audioUrl}
                  autoPlay
                  controls
                  className="w-full mt-3"
                  onEnded={() => setPlayingId(null)}
                />
              )}
            </div>
          )
        })}
      </div>
      <Button variant="outline" className="w-full h-10" onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-2" />
        下载全部音频
      </Button>
    </div>
  )
}

// ============================================================
// File Result
// ============================================================

function FileResult({
  fileName,
  onDownload,
}: {
  fileName?: string
  onDownload?: () => void
}) {
  return (
    <div className="space-y-4"
    >
      <div className="flex items-center gap-3 p-5 rounded-xl border border-border bg-secondary/30"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
        >
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0"
        >
          <p className="text-sm font-medium text-foreground truncate"
          >
            {fileName || '处理结果文件'}
          </p>
          <p className="text-xs text-muted-foreground"
          >
            文件已生成，可点击下方按钮下载
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-full h-10" onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-2" />
        下载文件
      </Button>
    </div>
  )
}

// ============================================================
// Result Header
// ============================================================

function ResultHeader({
  type,
  costPoints,
  processTime,
}: {
  type: ResultType
  costPoints?: number
  processTime?: string
}) {
  const typeLabels: Record<ResultType, { label: string; icon: React.ReactNode }> = {
    text: { label: '文本结果', icon: <FileText className="h-4 w-4" /> },
    audio: { label: '音频结果', icon: <FileAudio className="h-4 w-4" /> },
    video: { label: '视频结果', icon: <FileVideo className="h-4 w-4" /> },
    image: { label: '图片结果', icon: <FileImage className="h-4 w-4" /> },
    file: { label: '文件结果', icon: <FileText className="h-4 w-4" /> },
    storyboard: { label: '分镜脚本', icon: <Sparkle className="h-4 w-4" /> },
  }

  const info = typeLabels[type]

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-primary">{info.icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{info.label}</p>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
            {costPoints !== undefined && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted">
                <Zap className="h-3 w-3 text-amber-500" />
                {costPoints} 智点
              </span>
            )}
            {processTime && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted">
                <Clock className="h-3 w-3 text-sky-500" />
                {processTime}
              </span>
            )}
          </div>
        </div>
      </div>
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
        <CheckCircle className="h-3 w-3 mr-1" />
        已完成
      </Badge>
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

export function AgentResultArea({
  isProcessing,
  resultType = 'text',
  resultContent,
  resultUrl,
  resultFileName,
  progress = 0,
  progressSteps,
  segments,
  storyboard,
  multiVoiceResults,
  onDownload,
  onRetry,
  costPoints,
  processTime,
}: AgentResultAreaProps) {
  // Processing state
  if (isProcessing) {
    return (
      <Card className="w-full mt-6 border-primary/20"
      >
        <CardContent className="pt-6"
        >
          <ProcessingState progress={progress} steps={progressSteps} />
        </CardContent>
      </Card>
    )
  }

  // No result
  if (!resultContent && !resultUrl && !storyboard && !multiVoiceResults) {
    return null
  }

  return (
    <Card className="w-full mt-6 border-primary/20"
    >
      <CardContent className="pt-6 space-y-4"
      >
        <ResultHeader
          type={resultType}
          costPoints={costPoints}
          processTime={processTime}
        />

        {resultType === 'text' && (
          <TextResult
            content={resultContent}
            segments={segments}
            onDownload={onDownload}
          />
        )}

        {resultType === 'audio' && (
          <AudioResult
            url={resultUrl}
            fileName={resultFileName}
            onDownload={onDownload}
          />
        )}

        {resultType === 'video' && (
          <VideoResult
            url={resultUrl}
            fileName={resultFileName}
            onDownload={onDownload}
          />
        )}

        {resultType === 'image' && (
          <ImageResult url={resultUrl} onDownload={onDownload} />
        )}

        {resultType === 'storyboard' && (
          <StoryboardResult
            shots={storyboard}
            onDownload={onDownload}
          />
        )}

        {resultType === 'file' && (
          <FileResult fileName={resultFileName} onDownload={onDownload} />
        )}

        {/* Multi voice overlay */}
        {multiVoiceResults && multiVoiceResults.length > 0 && (
          <MultiVoiceResult
            results={multiVoiceResults}
            onDownload={onDownload}
          />
        )}

        {/* Retry button */}
        {onRetry && (
          <div className="pt-2 border-t border-border"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={onRetry}
            >
              <ArrowsClockwise className="h-3 w-3 mr-1" />
              重新生成
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
