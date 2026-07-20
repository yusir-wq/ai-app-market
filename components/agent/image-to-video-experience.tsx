'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Send,
  ImagePlay,
  Minus,
  Plus,
  Volume2,
  Zap,
  Loader2,
  Plus as PlusIcon,
  X,
  RotateCw,
  Download,
  Copy,
  Trash2,
  ArrowUp,
  Image as ImageIcon,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Agent } from '@/lib/mock-data'
import { toast } from 'sonner'

// ============================================================
// Types
// ============================================================

interface ImageToVideoExperienceProps {
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

interface ChatTurn {
  id: string
  prompt: string
  referenceImage: string | null
  params: Record<string, any>
  videoUrl: string | null
  status: 'processing' | 'done'
}

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
// Sub-components
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
        <span className="h-7 px-1.5 flex items-center justify-center text-[11px] font-medium tabular-nums min-w-[2.5rem] text-foreground/70">{value}S</span>
        <button type="button" onClick={(e) => { e.stopPropagation(); increase() }} disabled={!canIncrease} className="h-7 w-6 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Plus className="h-3 w-3" />
        </button>
      </div>
      {showPopup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#1A1A1E] border border-border/30 rounded-xl p-4 shadow-2xl z-50 min-w-[220px]" onClick={(e) => e.stopPropagation()}>
          <div className="mb-2">
            <span className="text-[11px] text-muted-foreground/50">时长设置</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="range" min="3" max="15" value={Number(value)} onChange={(e) => onChange(e.target.value)} className="flex-1 h-1.5 bg-muted/60 rounded-full appearance-none cursor-pointer accent-amber-500" />
            <span className="text-xs font-semibold tabular-nums text-foreground shrink-0 w-8 text-right">{value}S</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ShimmerPlaceholder() {
  return (
    <div className="space-y-2.5">
      <div className="w-72 h-40 rounded-lg overflow-hidden relative bg-muted/40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{ width: '200%', animation: 'shimmer 1.8s ease-in-out infinite' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-muted-foreground/40 animate-spin" />
        </div>
      </div>
      <div className="h-2.5 w-48 rounded-full bg-muted/40 animate-pulse" />
    </div>
  )
}

function VideoThumbnail({ turn, agentName }: { turn: ChatTurn; agentName: string }) {
  const [showDialog, setShowDialog] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => { videoRef.current?.play() }
  const handleMouseLeave = () => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 } }

  return (
    <div className="space-y-2">
      <div
        className="rounded-lg overflow-hidden border border-border/20 bg-black relative cursor-pointer group aspect-video w-full max-w-[370px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowDialog(true)}
      >
        {turn.videoUrl && (
          <>
            <video ref={videoRef} src={turn.videoUrl} muted loop playsInline className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground/60 hover:text-foreground rounded-md">
          <Download className="h-3 w-3" />下载
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground/60 hover:text-foreground rounded-md">
          <Copy className="h-3 w-3" />复制
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black border-0">
          <DialogTitle className="sr-only">视频预览</DialogTitle>
          {turn.videoUrl && (
            <video src={turn.videoUrl} controls autoPlay className="w-full max-h-[85vh] object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

export function ImageToVideoExperienceArea({
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
}: ImageToVideoExperienceProps) {
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([])
  const [processingTurnId, setProcessingTurnId] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [chatInputValue, setChatInputValue] = useState('')
  const [chatImage, setChatImage] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const chatImageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isChatting = chatTurns.length > 0

  const ratio = paramValues.ratio || 'auto'
  const resolution = paramValues.resolution || '540p'
  const duration = String(paramValues.duration || '5')
  const bgm = !!paramValues.bgm

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [chatTurns])

  const handleSend = useCallback(() => {
    if (!!processingTurnId) return

    const newTurnId = 'turn-' + Date.now()
    const newTurn: ChatTurn = {
      id: newTurnId,
      prompt: text,
      referenceImage: uploadedImage,
      params: { ratio, resolution, duration, bgm },
      videoUrl: null,
      status: 'processing',
    }
    setChatTurns((prev) => [...prev, newTurn])
    setProcessingTurnId(newTurnId)

    const mockVideo = mockVideoResults[ratio] || mockVideoResults['auto']

    setTimeout(() => {
      setChatTurns((prev) =>
        prev.map((t) => (t.id === newTurnId ? { ...t, status: 'done', videoUrl: mockVideo } : t))
      )
      setProcessingTurnId(null)
    }, 4000)

    setUploadedImage(null)
    onTextChange('')
  }, [text, uploadedImage, ratio, resolution, duration, bgm, processingTurnId, onTextChange])

  const handleChatSend = useCallback(() => {
    if (!!processingTurnId || !chatInputValue.trim()) return

    const newTurnId = 'turn-' + Date.now()
    const newTurn: ChatTurn = {
      id: newTurnId,
      prompt: chatInputValue,
      referenceImage: chatImage,
      params: { ratio, resolution, duration, bgm },
      videoUrl: null,
      status: 'processing',
    }
    setChatTurns((prev) => [...prev, newTurn])
    setProcessingTurnId(newTurnId)
    setChatInputValue('')
    setChatImage(null)

    const mockVideo = mockVideoResults[ratio] || mockVideoResults['auto']

    setTimeout(() => {
      setChatTurns((prev) =>
        prev.map((t) => (t.id === newTurnId ? { ...t, status: 'done', videoUrl: mockVideo } : t))
      )
      setProcessingTurnId(null)
    }, 4000)
  }, [chatInputValue, chatImage, ratio, resolution, duration, bgm, processingTurnId])

  const mockVideoResults: Record<string, string> = {
    '16:9': 'https://picsum.photos/seed/video-result-169/960/540',
    '9:16': 'https://picsum.photos/seed/video-result-916/540/960',
    '1:1': 'https://picsum.photos/seed/video-result-11/600/600',
    'auto': 'https://picsum.photos/seed/video-result-auto/960/540',
  }

  const handleImageUpload = () => { imageInputRef.current?.click() }
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedImage(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleChatImageUpload = () => { chatImageInputRef.current?.click() }
  const handleChatImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setChatImage(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleRegenerate = (turnId: string) => {
    setChatTurns((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, status: 'processing', videoUrl: null } : t))
    )
    setProcessingTurnId(turnId)
    setTimeout(() => {
      setChatTurns((prev) =>
        prev.map((t) => (t.id === turnId ? { ...t, status: 'done', videoUrl: mockVideoResults[ratio] || mockVideoResults['auto'] } : t))
      )
      setProcessingTurnId(null)
    }, 3000)
  }

  const handleDeleteTurn = (turnId: string) => {
    setChatTurns((prev) => prev.filter((t) => t.id !== turnId))
    toast.success('已删除')
  }

  const handleCopyVideo = (videoUrl: string) => {
    navigator.clipboard.writeText(videoUrl)
    toast.success('链接已复制')
  }

  // ============================================================
  // RENDER: Chat Mode
  // ============================================================
  if (isChatting) {
    return (
      <div className="w-full flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 space-y-8">
            {chatTurns.map((turn, turnIdx) => {
              const isProcessing = turn.status === 'processing'
              const isLatestTurn = turnIdx === chatTurns.length - 1
              return (
                <div key={turn.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] w-fit space-y-2">
                      {turn.referenceImage && (
                        <img src={turn.referenceImage} alt="参考图" className="w-[208px] h-[208px] rounded-xl object-cover border border-border/20" />
                      )}
                      {turn.prompt && (
                        <p className="text-sm text-foreground/80 line-clamp-3">{turn.prompt}</p>
                      )}
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">{turn.params.duration}s</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">{turn.params.ratio}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">{turn.params.resolution}</span>
                        {turn.params.bgm && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">BGM</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3">
                    <div className="text-xl flex-shrink-0 mt-0.5">🎬</div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground/50">{agent.name}</p>
                      {isProcessing && isLatestTurn && <ShimmerPlaceholder />}
                      {!isProcessing && turn.videoUrl && <VideoThumbnail turn={turn} agentName={agent.name} />}
                    </div>
                  </div>
                </div>
              )
            })}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom input — match initial view style */}
        <div className="shrink-0 border-t border-border/20 bg-[#FAFAFC] dark:bg-[#111115] rounded-b-xl">
          <div className="flex gap-4 p-4 pb-2 items-stretch">
            {/* 图片上传区 — 与初始视图一致 */}
            <div className="w-40 flex-shrink-0 flex flex-col h-[100px]">
              {chatImage ? (
                <div className="relative flex-1 rounded-lg overflow-hidden border border-border/20">
                  <img src={chatImage} alt="参考图" className="w-full h-full object-cover absolute inset-0" />
                  <button onClick={() => setChatImage(null)} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 text-xs z-10">✕</button>
                </div>
              ) : (
                <button type="button" onClick={handleChatImageUpload} className="flex-1 rounded-lg border-2 border-dashed border-border/30 hover:border-border/50 bg-white dark:bg-[#0A0A0E] flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
                  <PlusIcon className="h-6 w-6 text-muted-foreground/40" />
                  <span className="text-[11px] text-muted-foreground/40">上传图片</span>
                </button>
              )}
            </div>

            {/* 提示词输入框 — 多行 */}
            <div className="flex-1 flex flex-col h-[100px]">
              <Textarea
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
                placeholder="继续描述你想要的视频效果…"
                className="flex-1 min-h-0 resize-none rounded-lg border-0 shadow-none bg-white dark:bg-[#0A0A0E] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-muted-foreground/35"
              />
            </div>
          </div>

          {/* 底部：参数 + 发送按钮 — 独立一行，左对齐 */}
          <div className="flex items-center justify-between px-4 pb-3">
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
              <Button className="h-8 px-3 text-[12px] rounded-lg gap-1.5" onClick={handleChatSend} disabled={!!processingTurnId}>
                <Send className="h-3.5 w-3.5" />发送
              </Button>
            </div>
          </div>

          <input ref={chatImageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.bmp" className="hidden" onChange={handleChatImageFileChange} />
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Initial Input View
  // ============================================================
  return (
    <div className="w-full space-y-4 relative">
      <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden gap-0 rounded-xl">
        <CardContent className="p-0 flex flex-col">
          {/* 标题栏 */}
          <div className="flex items-center px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
            <span className="w-1.5 h-4 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
            <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight ml-2">输入图片与文案</h3>
          </div>

          {/* Content */}
          <div className="flex gap-4 p-4 min-h-[260px] items-stretch">
            <div className="w-40 flex-shrink-0 flex flex-col">
              {uploadedImage ? (
                <div className="relative flex-1 rounded-lg overflow-hidden border border-border/20">
                  <img src={uploadedImage} alt="上传的图片" className="w-full h-full object-cover absolute inset-0" />
                  <button type="button" onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 text-xs z-10">✕</button>
                </div>
              ) : (
                <button type="button" onClick={handleImageUpload} className="flex-1 rounded-lg border-2 border-dashed border-border/30 hover:border-border/50 bg-white dark:bg-[#0A0A0E] flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
                  <PlusIcon className="h-6 w-6 text-muted-foreground/40" />
                  <span className="text-[11px] text-muted-foreground/40">上传图片</span>
                </button>
              )}
            </div>

            <div className="flex-1">
              <Textarea
                id="image-to-video-textarea"
                placeholder={examplePlaceholder}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full h-full min-h-[220px] resize-none rounded-lg border-0 shadow-none bg-white dark:bg-[#0A0A0E] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-muted-foreground/35"
              />
            </div>

            <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.bmp" className="hidden" onChange={handleImageFileChange} />
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
              <Button className="h-8 px-3 text-[12px] rounded-lg gap-1.5" onClick={handleSend} disabled={!!processingTurnId}>
                <Send className="h-3.5 w-3.5" />发送
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
