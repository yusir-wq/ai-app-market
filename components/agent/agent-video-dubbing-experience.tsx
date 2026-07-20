'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select'
import { Agent } from '@/lib/mock-data'
import { AgentVideoDubbingIntro } from '@/components/agent/agent-video-dubbing-intro'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Star,
  ShareNetwork,
  WarningCircle,
  SpinnerGap,
  Trash,
  MagicWand,
  CaretLeft,
  Microphone,
  ArrowLineDown,
  Play,
  Pause,
  X,
  Upload, GearSix, PlusCircle,
  MusicNotesSimple, UploadSimple,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'

const COST_POINTS = 30
const COST_PRICE = 0.03
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface VideoDubbingExperienceProps {
  agent: Agent
  onBack: () => void
  onViewResult?: (resultId: string, fileName?: string) => void
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return `今天 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 声音选择下拉组件
function VoiceSelectDropdown({ voicePresets, selectedVoice, onSelectVoice, playingVoice, onTogglePlay, speed, volume, onSpeedChange, onVolumeChange }: {
  voicePresets: typeof voicePresets
  selectedVoice: string
  onSelectVoice: (v: string) => void
  playingVoice: string | null
  onTogglePlay: (v: string) => void
  speed: number
  volume: number
  onSpeedChange: (v: number) => void
  onVolumeChange: (v: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [settingsVoice, setSettingsVoice] = useState<string | null>(null)
  const selected = voicePresets.find(v => v.value === selectedVoice)

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSettingsVoice(null) }}>
      <PopoverTrigger asChild>
        <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] border border-[#e7ebf5] bg-white hover:bg-[#4f55ec]/[0.02] transition-colors">
          {selected && (
            <>
              <img src={selected.avatar} alt={selected.label} className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-[14px] font-medium text-[#3f4558]">{selected.label}</span>
                {selected.tags.map((tag, i) => (
                  <span key={i} className={cn('inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md font-medium', selected.tagColor)}>{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={(e) => { e.stopPropagation(); onTogglePlay(selectedVoice) }} className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200', playingVoice === selectedVoice ? 'bg-[#3f4558]/10 text-[#3f4558]' : 'text-[#3f4558]/40 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.06]')}>
                  {playingVoice === selectedVoice ? <Pause className="h-3.5 w-3.5" weight="fill" /> : <Play className="h-3.5 w-3.5 ml-0.5" weight="fill" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setOpen(true); setSettingsVoice(selectedVoice) }} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200', settingsVoice ? 'bg-[#4f55ec]/[0.06] text-[#4f55ec]' : 'text-[#3f4558]/60 hover:text-[#4f55ec] hover:bg-[#4f55ec]/[0.06]')}>
                  <GearSix className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-[380px] rounded-[12px] border-[#E5E9F6] p-2" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
        {settingsVoice ? (
          <div className="space-y-3">
            <button onClick={() => setSettingsVoice(null)} className="flex items-center gap-1.5 text-[13px] text-[#3f4558]/60 hover:text-[#3f4558] px-1 py-1">
              <CaretLeft className="h-3.5 w-3.5" />
              返回声音列表
            </button>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">语速</span>
                <Slider value={[speed]} onValueChange={(vals) => onSpeedChange(vals[0])} min={0.5} max={2.0} step={0.1} className="flex-1" />
                <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{speed}x</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">音量</span>
                <Slider value={[volume]} onValueChange={(vals) => onVolumeChange(vals[0])} min={50} max={150} step={10} className="flex-1" />
                <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{volume}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 max-h-[280px] overflow-y-auto">
            {voicePresets.map((v) => {
              const isSelected = selectedVoice === v.value
              const isPlaying = playingVoice === v.value
              return (
                <div key={v.value} onClick={() => { onSelectVoice(v.value); setOpen(false) }} className={cn('group relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200', isSelected ? 'bg-[#4f55ec]/[0.04] ring-1 ring-[#4f55ec]/[0.12]' : 'hover:bg-[#4f55ec]/[0.03]')}>
                  <div className="shrink-0">
                    <img src={v.avatar} alt={v.label} className="w-9 h-9 rounded-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={cn('text-[14px] font-medium tracking-tight', isSelected ? 'text-[#3f4558]' : 'text-[#3f4558]/80')}>{v.label}</span>
                    {v.tags.map((tag, i) => (
                      <span key={i} className={cn('inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md font-medium', v.tagColor)}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={(e) => { e.stopPropagation(); onTogglePlay(v.value) }} className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200', isPlaying ? 'bg-[#3f4558]/10 text-[#3f4558]' : 'text-[#3f4558]/40 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.06]')}>
                      {isPlaying ? <Pause className="h-3.5 w-3.5" weight="fill" /> : <Play className="h-3.5 w-3.5 ml-0.5" weight="fill" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setSettingsVoice(v.value) }} className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 text-[#3f4558]/60 hover:text-[#4f55ec] hover:bg-[#4f55ec]/[0.06]">
                      <GearSix className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// 声音预设（与TTS一致）
const voicePresets = [
  { value: 'female-gentle', label: '知夏', avatar: '/avatars/voice-zhixia.jpg', tags: ['温暖', '知性', '细腻'], tagColor: 'bg-rose-50 text-rose-600' },
  { value: 'female-lively', label: '悦晴', avatar: '/avatars/voice-yueqing.jpg', tags: ['欢快', '明亮', '自信'], tagColor: 'bg-pink-50 text-pink-600' },
  { value: 'male-calm', label: '正宇', avatar: '/avatars/voice-zhengyu.jpg', tags: ['沉稳', '大气', '字正腔圆'], tagColor: 'bg-blue-50 text-blue-600' },
  { value: 'male-deep', label: '沉言', avatar: '/avatars/voice-chenyan.jpg', tags: ['低沉', '醇厚', '感染力'], tagColor: 'bg-indigo-50 text-indigo-600' },
  { value: 'child', label: '童童', avatar: '/avatars/voice-tongtong.jpg', tags: ['天真', '灵动', '自然'], tagColor: 'bg-amber-50 text-amber-600' },
]

// 背景音乐选项（与TTS一致）
const bgmOptions = [
  { value: 'none', label: '无背景音乐', duration: '' },
  { value: 'light', label: '阳光明媚', duration: '01:18' },
  { value: 'inspire', label: '逐梦前行', duration: '02:05' },
  { value: 'upbeat', label: '元气满满', duration: '00:52' },
  { value: 'cinematic', label: '史诗之旅', duration: '01:45' },
  { value: 'lofi', label: '午后咖啡馆', duration: '02:30' },
  { value: 'classical', label: '月光花园', duration: '03:12' },
  { value: 'electronic', label: '未来脉搏', duration: '01:33' },
]

const mockHistory = [
  { id: 'h1', title: '产品演示配音.mp4', status: 'completed' as const, time: '2026-06-15 14:30', duration: '2:30', voiceType: '知夏', resultId: 'result-video-dubbing', thumbnail: '/thumbnails/thumb-product-lights.jpg' },
  { id: 'h2', title: '教程视频配音.mp4', status: 'completed' as const, time: '2026-06-12 09:15', duration: '5:20', voiceType: '正宇', resultId: 'result-video-dubbing', thumbnail: '/thumbnails/thumb-online-course.jpg' },
  { id: 'h3', title: '品牌故事配音.mov', status: 'completed' as const, time: '2026-06-10 16:00', duration: '3:15', voiceType: '沉言', resultId: 'result-video-dubbing', thumbnail: '/thumbnails/thumb-brand-story.jpg' },
]

export function VideoDubbingExperience({ agent, onBack, onViewResult }: VideoDubbingExperienceProps) {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [voice, setVoice] = useState('female-gentle')
  const [bgm, setBgm] = useState('none')
  const [speed, setSpeed] = useState(1.0)
  const [volume, setVolume] = useState(100)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [bgmSelectOpen, setBgmSelectOpen] = useState(false)
  const [playingBgm, setPlayingBgm] = useState<string | null>(null)
  const [bgmFile, setBgmFile] = useState<File | null>(null)

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [downloadConfirmId, setDownloadConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (uploadedVideo && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [uploadedVideo])

  const resultRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (resultVideoTitle && resultRef.current) { setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) }
  }, [resultVideoTitle])

  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
    if (!validTypes.includes(file.type)) {
      toast.error('仅支持 MP4、MOV、WebM、AVI 格式')
      return
    }
    if (file.size > 4 * 1024 * 1024 * 1024) {
      toast.error('视频大小不能超过 4GB')
      return
    }
    setUploadedFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedVideo(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function toggleBgmPreview(bgmValue: string) {
    if (playingBgm === bgmValue) { setPlayingBgm(null) } else { setPlayingBgm(bgmValue); setTimeout(() => setPlayingBgm(null), 2000) }
  }
  function handleBgmUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) { setBgm('custom'); setBgmFile(uploadedFile); setBgmSelectOpen(true) }
    e.target.value = ''
  }
  function formatBgmTime(s: number) {
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function handleGenerate() {
    if (!uploadedVideo) { toast.error('请先上传视频'); return }
    if (isProcessing) { return }
    setIsProcessing(true)
    setProgress(0)
    setResultVideoTitle('')
    const iv = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 10) + 5
        if (next >= 100) { clearInterval(iv); setTimeout(finish, 400); return 100 }
        return next
      })
    }, 350)
  }

  function finish() {
    setIsProcessing(false)
    setProgress(100)
    setResultVideoTitle(uploadedFileName.replace(/\.[^/.]+$/, '') + ' 配音版')
    toast.success('视频配音完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }

  const CARD_SHADOW = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' } as React.CSSProperties

  return (
    <>
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
      {/* 顶部标题横条：64px，全宽，毛玻璃 */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-[10px]"
        style={{ background: 'rgba(255,255,255,0.96)', borderColor: 'rgb(237,240,248)' }}
      >
        <div className="flex items-center justify-between h-16 px-[34px] relative">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2.5">
              <Microphone className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 视频配音</span>
            </div>
          </div>
          {/* Tabs — 居中，滑动按钮样式 */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="inline-flex bg-muted rounded-[10px] p-1 gap-0.5">
              <button
                onClick={() => setActiveTab('intro')}
                className={cn(
                  'h-8 px-5 rounded-[7px] text-sm transition-all cursor-pointer',
                  activeTab === 'intro' ? 'bg-white text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                场景介绍
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={cn(
                  'h-8 px-5 rounded-[7px] text-sm transition-all cursor-pointer',
                  activeTab === 'experience' ? 'bg-white text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                使用应用
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e7ebf5] bg-white text-[#596176] hover:bg-[#4f55ec]/[0.06] px-[14px] shadow-none"
            >
              <Star className="h-[17px] w-[17px]" />收藏
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e7ebf5] bg-white text-[#596176] hover:bg-[#4f55ec]/[0.06] px-[14px] shadow-none"
            >
              <ShareNetwork className="h-[17px] w-[17px]" />分享
            </Button>
          </div>
        </div>
      </header>

      {activeTab === 'intro' ? (
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentVideoDubbingIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传视频，AI 自动识别语音内容，智能匹配音色生成配音，支持多种声音风格和背景音乐，让视频配音更专业。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-video-dubbing.jpg" alt="AI视频配音封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 视频上传卡片 | 参数设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-stretch">

          {/* 视频上传区卡片 */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1 relative">
                {uploadedVideo ? (
                  <div className="relative w-full h-full min-h-[280px] rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] overflow-hidden flex items-center justify-center">
                    <video src={uploadedVideo} controls className="max-w-full max-h-full" />
                    <button
                      onClick={() => { setUploadedVideo(null); setUploadedFileName('') }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs">
                      {uploadedFileName}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[280px] border-2 border-dashed rounded-[12px] py-10 px-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 border-[#e7ebf5] hover:border-primary/30" style={{ background: '#f8faff' }} onClick={() => fileInputRef.current?.click()}>
                    <PlusCircle className="text-[#4f55ec]" style={{ fontSize: '60px' }} />
                    <p className="text-[17px] text-[#3f4558]">点击或拖拽上传视频</p>
                    <div className="flex flex-col items-center gap-1 text-[13px] text-muted-foreground"><span>支持 MP4、MOV、WebM、AVI</span><span>最大 4GB</span></div>
                    <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo" className="hidden" onChange={handleVideoUpload} />
                  </div>
                )}
              </div>
              <p className="flex items-center gap-1.5 mt-3 text-[12px] text-muted-foreground/70 shrink-0"><WarningCircle className="h-3 w-3 shrink-0" />请确保视频内容合法合规，不包含侵权或违规信息。</p>
            </div>
          </div>

          {/* 配音设置卡片 + 开始配音按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden w-[428px]" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">参数设置</h3>
              {/* 选择声音 */}
              <div className="shrink-0 mb-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">选择声音</span>
                <div className="w-[380px]">
                <VoiceSelectDropdown
                  voicePresets={voicePresets}
                  selectedVoice={voice}
                  onSelectVoice={setVoice}
                  playingVoice={playingVoice}
                  onTogglePlay={(v) => setPlayingVoice(playingVoice === v ? null : v)}
                  speed={speed}
                  volume={volume}
                  onSpeedChange={setSpeed}
                  onVolumeChange={setVolume}
                />
                </div>
              </div>
              {/* 背景音乐 */}
              <div className="shrink-0 mb-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">背景音乐</span>
                <Select open={bgmSelectOpen} onOpenChange={setBgmSelectOpen} value={bgm} onValueChange={(v) => { setBgm(v) }}>
                  <SelectTrigger className="w-[380px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none">
                    {bgmFile ? <span className="text-[#3f4558] truncate">{bgmFile.name}</span> : bgm !== 'none' ? <span className="text-[#3f4558]">{bgmOptions.find(o => o.value === bgm)?.label || bgm}</span> : <span className="text-[#3f4558]/50">选择背景音乐</span>}
                  </SelectTrigger>
                  <SelectContent align="start" className="w-[480px] p-2 border-[#E5E9F6] rounded-[12px]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                    <div className="grid grid-cols-2 gap-2">
                      {/* 上传本地音乐 */}
                      {bgmFile ? (
                        <div
                          className={cn('group flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer transition-colors', bgm === 'custom' ? 'bg-[#F3F5FF] text-[#4F55EC]' : 'text-[#3f4558] hover:bg-[#4f55ec]/[0.03]')}
                          onClick={() => setBgm('custom')}
                        >
                          <div className="shrink-0 w-5 h-5 relative">
                            <MusicNotesSimple className={cn('absolute inset-0 h-5 w-5 transition-opacity duration-200', playingBgm ? 'opacity-0' : 'opacity-100 group-hover:opacity-0')} />
                            <div className={cn('absolute inset-0 h-5 w-5 rounded flex items-center justify-center transition-opacity duration-200', playingBgm ? 'opacity-100 bg-[#3f4558]/10' : 'opacity-0 group-hover:opacity-100 group-hover:bg-[#3f4558]/[0.05]')}>
                              {playingBgm ? <Pause className="h-4 w-4" weight="fill" /> : <Play className="h-4 w-4 ml-px" weight="fill" />}
                            </div>
                          </div>
                          <span className="text-[13px] font-medium truncate">{bgmFile.name}</span>
                        </div>
                      ) : (
                        <label
                          className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer hover:bg-[#4f55ec]/[0.04] transition-colors text-[#3f4558]/60 hover:text-[#3f4558] border border-dashed border-[#E5E9F6]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <UploadSimple className="h-4 w-4 shrink-0" weight="duotone" />
                          <span className="text-[13px]">上传本地音乐</span>
                          <input type="file" accept=".mp3,.wav,.m4a,.flac" className="hidden" onChange={handleBgmUpload} />
                        </label>
                      )}
                      {/* 预设选项 */}
                      {bgmOptions.map((opt) => {
                        const isBgmPlaying = playingBgm === opt.value
                        const isSelected = bgm === opt.value
                        return (
                          <div
                            key={opt.value}
                            onClick={() => setBgm(opt.value)}
                            className={cn('group flex flex-col gap-1 px-2.5 py-2 rounded-md cursor-pointer transition-colors', isSelected ? 'bg-[#F3F5FF] text-[#4F55EC]' : 'text-[#3f4558] hover:bg-[#4f55ec]/[0.03]')}
                          >
                            {/* 第一行：图标 + 名称 */}
                            <div className="flex items-center gap-2">
                              <div
                                className="shrink-0 w-5 h-5 relative"
                                onClick={(e) => { e.stopPropagation(); if (opt.value !== 'none') toggleBgmPreview(opt.value) }}
                              >
                                {opt.value === 'none' ? (
                                  <span className="absolute inset-0 flex items-center justify-center text-[10px]">—</span>
                                ) : (
                                  <>
                                    <MusicNotesSimple className={cn('absolute inset-0 h-5 w-5 transition-opacity duration-200', isBgmPlaying ? 'opacity-0' : 'opacity-100 group-hover:opacity-0')} />
                                    <div className={cn('absolute inset-0 h-5 w-5 rounded flex items-center justify-center transition-opacity duration-200', isBgmPlaying ? 'opacity-100 bg-[#3f4558]/10' : 'opacity-0 group-hover:opacity-100 group-hover:bg-[#3f4558]/[0.05]')}>
                                      {isBgmPlaying ? <Pause className="h-4 w-4" weight="fill" /> : <Play className="h-4 w-4 ml-px" weight="fill" />}
                                    </div>
                                  </>
                                )}
                              </div>
                              <span className="text-[13px] font-medium block truncate">{opt.label}</span>
                            </div>
                            {/* 第二行：时长 */}
                            <div className="pl-7">
                              <span className={cn('text-[12px] block', opt.duration ? 'text-[#70788D]' : 'text-transparent')}>{opt.duration || '占位'}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              {uploadedVideo && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在配音...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />开始配音</span>)}
                  </Button>
                  <p className="text-[11px] text-[#b7becf] mt-3">{COST_TEXT}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CARD 3 — 生成结果 */}
        {isProcessing && (
          <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
            <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-4">生成结果</h3>
            </div>
            <div className="p-6 pt-4 pb-6">
              <div className="p-10 text-center">
                <SpinnerGap className="h-10 w-10 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在为视频配音…</p>
                <p className="text-sm text-muted-foreground mb-6">预计 {agent.avgProcessTime} 完成</p>
                <div className="w-full h-2 bg-[#e7ebf5] rounded-full overflow-hidden max-w-[400px] mx-auto">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
        {resultVideoTitle && !isProcessing && (
          <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
            <div className="px-6 pt-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
              <div className="flex items-center justify-between"><h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3><span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span></div>
            </div>
            <div className="p-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 items-start">
                {/* 左侧：视频预览 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden h-[309px]">
                    <div className="w-full h-full bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                          <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                        </div>
                        <p className="text-sm font-medium text-[#3f4558]">{resultVideoTitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
                {/* 右侧：配音参数 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">配音参数</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 h-[309px] overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#697185] w-20 shrink-0">配音音色</span>
                        <div className="flex items-center gap-2">
                          <img src={voicePresets.find(v => v.value === voice)?.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-sm text-[#3f4558]">{voicePresets.find(v => v.value === voice)?.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#697185] w-20 shrink-0">背景音乐</span>
                        <span className="text-sm text-[#3f4558]">{bgmOptions.find(b => b.value === bgm)?.label || '无'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#697185] w-20 shrink-0">语速</span>
                        <span className="text-sm text-[#3f4558]">{speed.toFixed(1)}x</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#697185] w-20 shrink-0">音量</span>
                        <span className="text-sm text-[#3f4558]">{volume}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[7px] h-[16px]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARD 4 — 生成历史 */}
        <div className="rounded-[18px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
          <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-[18px] font-medium text-[#3f4558]">生成历史</h3><span className="text-sm text-muted-foreground">历史记录将为您保留 3 天。为避免过期丢失，请及时下载到本地设备。</span></div>
          </div>
          {history.length === 0 ? (
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><Microphone className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无配音记录</p><p className="text-sm text-muted-foreground">上传视频后，配音结果将显示在这里</p></div></div>
          ) : (
            <div className="px-6 pb-6">
              <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
              {history.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                  <img src={item.thumbnail} alt={item.title} className="w-[76px] h-[58px] rounded-[8px] shrink-0 object-cover" />
                  <div className="w-[160px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">文件名称</span>
                    <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">时长</span>
                    <span className="text-sm text-[#697185]">{item.duration}</span>
                  </div>
                  <div className="w-[90px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">配音音色</span>
                    <span className="text-sm text-[#697185]">{item.voiceType}</span>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                    <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto shrink-0">
                    <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-white text-[#596176] hover:bg-[#f3f5ff] hover:border-[#dfe3ff] hover:text-[#596176] shadow-none" onClick={(e) => { e.stopPropagation(); setDownloadConfirmId(item.id); }}><ArrowLineDown className="h-3.5 w-3.5" />下载</Button>
                    <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] text-[#9ca2b5] hover:text-destructive gap-1" onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}><Trash className="h-3.5 w-3.5" />删除</Button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* 删除确认弹窗 */}
        <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
          <AlertDialogContent className="rounded-[12px] max-w-[420px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[18px] font-medium text-[#111827]">确认删除</AlertDialogTitle>
              <AlertDialogDescription className="text-[14px] text-[#6B7280]">删除后，这个文件将被彻底清除且无法找回，确认要删除吗？</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-10 rounded-[8px] text-sm border-[#E5E7EB] text-[#374151] bg-white">取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="h-10 rounded-[8px] text-sm bg-[#4F46E5] hover:bg-[#4F46E5]/80 text-white">确认删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 下载确认弹窗 */}
        <AlertDialog open={downloadConfirmId !== null} onOpenChange={(open) => { if (!open) setDownloadConfirmId(null) }}>
          <AlertDialogContent className="rounded-[12px] max-w-[420px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[18px] font-medium text-[#111827]">确认下载</AlertDialogTitle>
              <AlertDialogDescription className="text-[14px] text-[#6B7280]">下载即表示您对上传素材拥有合法使用权，知悉该图片为AI生成/编辑内容，并自行承担使用责任。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-10 rounded-[8px] text-sm border-[#E5E7EB] text-[#374151] bg-white">取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setDownloadConfirmId(null); toast.success('下载完成'); }} className="h-10 rounded-[8px] text-sm bg-[#4F46E5] hover:bg-[#4F46E5]/80 text-white">确认并下载</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 历史记录详情弹窗 */}
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedHistoryItem(null)}>
            <div className="bg-white rounded-[16px] shadow-2xl max-w-[800px] w-full mx-4 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* 标题区域 - 带渐变背景 */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
                  <span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span>
                </div>
                <button onClick={() => setSelectedHistoryItem(null)} className="text-[#8a91a6] hover:text-[#3f4558] transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {/* 内容区域 */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start">
                  {/* 左侧：视频预览 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden h-[309px]">
                      <div className="w-full h-full bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                            <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                          </div>
                          <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                  </div>
                  {/* 右侧：配音参数 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">配音参数</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 h-[309px] overflow-y-auto">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#697185] w-20 shrink-0">配音音色</span>
                          <div className="flex items-center gap-2">
                            <img src={voicePresets.find(v => v.value === voice)?.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-sm text-[#3f4558]">{voicePresets.find(v => v.value === voice)?.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#697185] w-20 shrink-0">背景音乐</span>
                          <span className="text-sm text-[#3f4558]">{bgmOptions.find(b => b.value === bgm)?.label || '无'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#697185] w-20 shrink-0">语速</span>
                          <span className="text-sm text-[#3f4558]">{speed.toFixed(1)}x</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#697185] w-20 shrink-0">音量</span>
                          <span className="text-sm text-[#3f4558]">{volume}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 文件信息 - 底部 */}
                <div className="mt-4 pt-3 flex items-center gap-6 text-xs text-[#8a91a6]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#b0b7c9]">文件名称</span>
                    <span className="text-[#3f4558] font-medium">{selectedHistoryItem.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#b0b7c9]">创建时间</span>
                    <span className="text-[#3f4558] font-medium">{formatTime(selectedHistoryItem.time)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
    </>
  )
}
