'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Play,
  Pause,
  GearSix,
  MagicWand,
  BookOpen,
  FileText,
  CheckCircle,
  SpinnerGap,
  Spinner,
  CaretLeft,
  Star,
  ShareNetwork,
  ArrowLineDown,
  Trash,
  Copy,
  PencilSimple,
  WarningCircle,
  SpeakerHigh, X,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Agent } from '@/lib/mock-data'
import { AgentTextToSpeechIntro } from './agent-text-to-speech-intro'
import { toast } from 'sonner'

const CARD_SHADOW: React.CSSProperties = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' }
const COST_POINTS = 20
const COST_PRICE = 0.02
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

// ============================================================
// Voice Presets
// ============================================================

const voicePresets = [
  { value: 'female-gentle', label: '知夏', avatar: '/avatars/voice-zhixia.jpg', tags: ['温暖', '知性', '细腻'], tagColor: 'bg-rose-50 text-rose-600' },
  { value: 'female-lively', label: '悦晴', avatar: '/avatars/voice-yueqing.jpg', tags: ['欢快', '明亮', '自信'], tagColor: 'bg-pink-50 text-pink-600' },
  { value: 'male-calm', label: '正宇', avatar: '/avatars/voice-zhengyu.jpg', tags: ['沉稳', '大气', '字正腔圆'], tagColor: 'bg-blue-50 text-blue-600' },
  { value: 'male-deep', label: '沉言', avatar: '/avatars/voice-chenyan.jpg', tags: ['低沉', '醇厚', '感染力'], tagColor: 'bg-indigo-50 text-indigo-600' },
  { value: 'child', label: '童童', avatar: '/avatars/voice-tongtong.jpg', tags: ['天真', '灵动', '自然'], tagColor: 'bg-amber-50 text-amber-600' },
]

// ============================================================
// Background Music Options
// ============================================================

// ============================================================
// Mock History
// ============================================================

const mockHistory = [
  { id: 'h1', title: '产品宣传文案.mp3', status: 'completed' as const, time: '2026-06-15 14:30', size: '3.2 MB', result: '在这个快速迭代的时代，科技创新正以前所未有的速度改变着我们的生活…', resultId: 'result-text-to-speech' },
  { id: 'h2', title: '有声书章节 1.mp3', status: 'completed' as const, time: '2026-06-12 09:15', size: '8.7 MB', result: '深夜，九岁的阿布悄悄溜出外婆家，提着一盏熄灭的马灯走向神秘的黑森林…', resultId: 'result-text-to-speech' },
  { id: 'h3', title: '新闻播报稿.mp3', status: 'completed' as const, time: '2026-06-10 16:00', size: '2.1 MB', result: '各位听众朋友大家好，欢迎收听今日新闻播报。今天的主要内容有…', resultId: 'result-text-to-speech' },
  { id: 'h4', title: '广告配音（已失效）.mp3', status: 'expired' as const, time: '2024-12-01 10:00', size: '4.5 MB', result: '品牌宣传配音（已过期无法下载）', resultId: '' },
  { id: 'h5', title: '课程旁白（已失效）.mp3', status: 'expired' as const, time: '2024-11-15 14:30', size: '12.3 MB', result: '在线课程旁白（超过30天已失效）', resultId: '' },
]

// ============================================================
// Helpers
// ============================================================

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return `今天 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatAudioTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ============================================================
// Voice Settings Popover
// ============================================================

function VoiceSettingsPopover({ speed, volume, onSpeedChange, onVolumeChange }: {
  speed: number; volume: number; onSpeedChange: (v: number) => void; onVolumeChange: (v: number) => void
}) {
  return (
    <PopoverContent side="left" align="start" className="w-56 p-0 overflow-hidden border-[#E5E9F6] rounded-[12px]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
      <div className="p-3 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">语速</span>
            <Slider value={[speed]} onValueChange={(vals) => onSpeedChange(vals[0])} min={0.5} max={2.0} step={0.1} className="flex-1" />
            <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{speed}x</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">音量</span>
            <Slider value={[volume]} onValueChange={(vals) => onVolumeChange(vals[0])} min={50} max={150} step={10} className="flex-1" />
            <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{volume}%</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  )
}

// ============================================================
// Voice Row
// ============================================================

function VoiceRow({ voice, isSelected, isPlaying, onSelect, onTogglePlay, speed, volume, onSpeedChange, onVolumeChange }: {
  voice: (typeof voicePresets)[number]; isSelected: boolean; isPlaying: boolean; onSelect: () => void; onTogglePlay: () => void; speed: number; volume: number; onSpeedChange: (v: number) => void; onVolumeChange: (v: number) => void
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  return (
    <div onClick={onSelect} className={cn('group relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] cursor-pointer transition-all duration-200', isSelected ? 'bg-[#4f55ec]/[0.04] ring-1 ring-[#4f55ec]/[0.12]' : 'hover:bg-[#4f55ec]/[0.03]')}>
      <div className="shrink-0">
        <img src={voice.avatar} alt={voice.label} className="w-9 h-9 rounded-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={cn('text-[15px] font-medium tracking-tight', isSelected ? 'text-[#3f4558]' : 'text-[#3f4558]/80')}>{voice.label}</span>
        {voice.tags.map((tag, i) => (
          <span key={i} className={cn('inline-flex items-center text-[11px] px-1.5 py-0.5 rounded-md font-medium', voice.tagColor)}>{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); onTogglePlay() }} className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200', isPlaying ? 'bg-[#3f4558]/10 text-[#3f4558]' : 'text-[#3f4558]/40 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.06]')}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" weight="fill" /> : <Play className="h-3.5 w-3.5 ml-0.5" weight="fill" />}
        </button>
        <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
          <PopoverTrigger asChild>
            <button onClick={(e) => { e.stopPropagation(); setSettingsOpen(!settingsOpen) }} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200', settingsOpen ? 'bg-[#4f55ec]/[0.06] text-[#4f55ec]' : 'text-[#3f4558]/60 hover:text-[#4f55ec] hover:bg-[#4f55ec]/[0.06]')}>
              <GearSix className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <VoiceSettingsPopover speed={speed} volume={volume} onSpeedChange={onSpeedChange} onVolumeChange={onVolumeChange} />
        </Popover>
      </div>
      {isPlaying && (
        <div className="absolute bottom-0 inset-x-3 h-0.5 bg-[#3f4558]/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#4f55ec]/30 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

interface TextToSpeechExperienceProps {
  agent: Agent
  onBack: () => void
  onViewResult?: (resultId: string, fileName?: string) => void
}

export function TextToSpeechExperience({ agent, onBack, onViewResult }: TextToSpeechExperienceProps) {
  // 输入
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('female-gentle')
  const [speed, setSpeed] = useState(1.0)
  const [volume, setVolume] = useState(100)

  // 处理
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultText, setResultText] = useState('')

  // 历史
  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)

  // Tab
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  // 音频播放
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(32)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const audioTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // 声音试听
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  // 文本编辑
  const [isEditingTranscript, setIsEditingTranscript] = useState(false)
  const [transcriptEditText, setTranscriptEditText] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // ============================================================
  // Handlers
  // ============================================================

  function handleGenerate() {
    if (!text.trim()) { toast.error('请输入要转换的文字内容'); return }
    setIsProcessing(true)
    setProgress(0)
    setResultText('')
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioTimer.current) { clearInterval(audioTimer.current); audioTimer.current = null }
    const iv = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 12) + 6
        if (next >= 100) { clearInterval(iv); setTimeout(finish, 400); return 100 }
        return next
      })
    }, 350)
  }

  function finish() {
    setIsProcessing(false)
    setProgress(100)
    setResultText(text)
    toast.success('语音生成完成！')
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null); toast.success('已删除') } }
  function handleCopy(text: string) { navigator.clipboard.writeText(text); toast.success('已复制到剪贴板') }

  // 音频播放
  function togglePlay() {
    if (isPlaying) {
      if (audioTimer.current) { clearInterval(audioTimer.current); audioTimer.current = null }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      audioTimer.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + (100 * playbackRate / 1000)
          if (next >= duration) { clearInterval(audioTimer.current!); audioTimer.current = null; setIsPlaying(false); return duration }
          return next
        })
      }, 100)
    }
  }
  function handleProgressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const wasPlaying = isPlaying
    if (audioTimer.current) { clearInterval(audioTimer.current); audioTimer.current = null }
    setIsPlaying(false)
    const v = parseFloat(e.target.value)
    setCurrentTime(v)
    if (wasPlaying) {
      setIsPlaying(true)
      audioTimer.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + (100 * playbackRate / 1000)
          if (next >= duration) { clearInterval(audioTimer.current!); audioTimer.current = null; setIsPlaying(false); return duration }
          return next
        })
      }, 100)
    }
  }
  function changePlaybackRate() {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
    const idx = rates.indexOf(playbackRate)
    const next = rates[(idx + 1) % rates.length]
    setPlaybackRate(next)
  }

  // 声音试听
  const togglePreview = (voiceValue: string) => {
    if (playingVoice === voiceValue) { setPlayingVoice(null) } else { setPlayingVoice(voiceValue); setTimeout(() => setPlayingVoice(null), 2000) }
  }

  // 快捷填充
  function handleQuickFill(actionId: string) {
    if (actionId === 'random-story') {
      setText('萤火虫的秘密\n深夜，九岁的阿布悄悄溜出外婆家，提着一盏熄灭的马灯走向神秘的黑森林。\n他想抓住传说中能实现愿望的"黄金萤火虫"，来治好外婆的眼睛。林子里静得只能听到他自己的心跳，微风吹过，树叶沙沙作响。突然，前方亮起了一团温暖的微光。那不是一只，而是成千上万只萤火虫聚在一起，宛如地上的银河。\n当它们围绕着阿布翩翩起舞时，阿布闭上眼睛，在心里虔诚地许愿。等他再次睁开眼，手里的马灯竟然自己亮了起来，散发出永不熄灭的柔和光芒。阿布开心地笑了，他捧着这盏希望之灯，朝着外婆家的方向飞奔而去。')
      return
    }
  }

  function handleTxtUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      const reader = new FileReader()
      reader.onload = (ev) => { setText((ev.target?.result as string) || '') }
      reader.readAsText(uploadedFile)
    }
    e.target.value = ''
  }

  function startEditTranscript() { setTranscriptEditText(resultText); setIsEditingTranscript(true) }
  function saveEditTranscript() { setResultText(transcriptEditText); setIsEditingTranscript(false); toast.success('已保存') }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b backdrop-blur-[10px]" style={{ background: 'rgba(255,255,255,0.96)', borderColor: 'rgb(237,240,248)' }}>
        <div className="flex items-center justify-between h-16 px-[34px] relative">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2.5">
              <SpeakerHigh className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI文字转语音</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="inline-flex bg-muted rounded-[10px] p-1 gap-0.5">
              <button onClick={() => setActiveTab('intro')} className={cn('h-8 px-5 rounded-[7px] text-sm transition-all cursor-pointer', activeTab === 'intro' ? 'bg-white text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground')}>场景介绍</button>
              <button onClick={() => setActiveTab('experience')} className={cn('h-8 px-5 rounded-[7px] text-sm transition-all cursor-pointer', activeTab === 'experience' ? 'bg-white text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground')}>使用应用</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e7ebf5] bg-white text-[#596176] hover:bg-[#4f55ec]/[0.06] px-[14px] shadow-none"><Star className="h-[17px] w-[17px]" />收藏</Button>
            <Button variant="outline" size="sm" className="h-9 rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e7ebf5] bg-white text-[#596176] hover:bg-[#4f55ec]/[0.06] px-[14px] shadow-none"><ShareNetwork className="h-[17px] w-[17px]" />分享</Button>
          </div>
        </div>
      </header>

      {activeTab === 'intro' ? (
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentTextToSpeechIntro /></div>
      ) : (
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

          {/* CARD 1 — 使用指南 */}
          <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
            <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
              <div>
                <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
                <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">输入文字内容，AI 即刻生成带情感的自然人声。支持多音色切换、语速音量调节，满足配音、有声书、播客等多种场景。</p>
                <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
              </div>
              <div className="flex items-center justify-center h-full">
                <div className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden" style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}>
                  <img src="/covers/agent-text-to-speech.jpg" alt="AI文字转语音封面图" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2A + 2B — 输入区 | 生成设置，3:2 比例 */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-stretch">

            {/* 输入区 */}
            <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
              <div className="p-6 h-full flex flex-col">
                {/* 标题栏 + 工具按钮 */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-[18px] font-medium text-[#3f4558]">输入内容</h3>
                  <div className="flex items-center gap-0.5">
                    {/* 随机故事 */}
                    <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => handleQuickFill('random-story')}><BookOpen className="h-4 w-4" weight="duotone" />随机故事</Button>
                    {/* 上传txt */}
                    <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => document.getElementById('tts-txt-upload')?.click()}><FileText className="h-4 w-4" weight="duotone" />上传txt</Button>
                    <input id="tts-txt-upload" type="file" accept=".txt" className="hidden" onChange={handleTxtUpload} />
                  </div>
                </div>
                {/* Textarea */}
                <div className="flex-1 relative">
                  <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="输入你想要的配音文案，AI 即刻生成带情感的自然人声…" className="min-h-[280px] h-full resize-none rounded-[12px] border border-[#e7ebf5] shadow-none bg-[#F8FAFF] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-[#3f4558]/35" />
                  <span className={cn('absolute bottom-3 right-3 text-[11px] font-medium tabular-nums tracking-tight', text.length > 4500 ? 'text-destructive/80' : 'text-[#3f4558]/40')}>{text.length}/5000</span>
                </div>
                <p className="flex items-center gap-1.5 mt-3 text-[12px] text-muted-foreground/70 shrink-0"><WarningCircle className="h-3 w-3 shrink-0" />生成内容仅供合法用途，请勿用于违法违规场景。</p>
              </div>
            </div>

            {/* 生成设置 */}
            <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">生成设置</h3>
                {/* 选择声音 */}
                <div className="shrink-0">
                  <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">选择声音</span>
                  <div className="space-y-1.5">
                    {voicePresets.map((v) => (
                      <VoiceRow key={v.value} voice={v} isSelected={voice === v.value} isPlaying={playingVoice === v.value} onSelect={() => setVoice(v.value)} onTogglePlay={() => togglePreview(v.value)} speed={speed} volume={volume} onSpeedChange={setSpeed} onVolumeChange={setVolume} />
                    ))}
                  </div>
                </div>
                {/* 立即生成 */}
                {text.trim() && (
                  <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                    <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                      {isProcessing ? (<span className="flex items-center gap-2"><Spinner className="h-4 w-4 animate-spin" />正在生成...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />立即生成</span>)}
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
              <div className="px-6 pt-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
                <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
              </div>
              <div className="p-6 pt-4 pb-6">
                <div className="p-10 text-center">
                  <Spinner className="h-10 w-10 text-muted-foreground animate-spin mx-auto mb-4" />
                  <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在生成语音…</p>
                  <p className="text-sm text-muted-foreground mb-6">预计 {agent.avgProcessTime} 完成</p>
                  <div className="w-full h-2 bg-[#e7ebf5] rounded-full overflow-hidden max-w-[400px] mx-auto">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {resultText && !isProcessing && (
            <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
              <div className="px-6 pt-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
                <div className="flex items-center justify-between"><h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3><span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span></div>
              </div>
              <div className="p-6 pt-4">
                <div className="grid grid-cols-1 gap-6">
                  {/* 语音内容 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">输入内容</h4>
                    {isEditingTranscript ? (
                      <div className="space-y-3">
                        <textarea value={transcriptEditText} onChange={e => setTranscriptEditText(e.target.value)} className="w-full rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 text-sm text-foreground leading-relaxed font-sans h-[400px] resize-none outline-none focus:border-primary/50" />
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-[46px] rounded-[10px] text-[15px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white px-6" style={{ boxShadow: '0px 8px 16px rgba(87,92,233,0.14)' }} onClick={saveEditTranscript}>保存</Button>
                          <Button size="sm" variant="outline" className="h-[46px] rounded-[10px] text-[15px] px-6" onClick={() => setIsEditingTranscript(false)}>取消</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 h-[400px] overflow-y-auto"><pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{resultText}</pre></div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={startEditTranscript}><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                          <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => handleCopy(resultText)}><Copy className="h-3.5 w-3.5" />复制</Button>
                          <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('已下载')}><ArrowLineDown className="h-3.5 w-3.5" />导出 MP3</Button>
                        </div>
                      </>
                    )}
                    {/* 音频区域：生成设置信息条 + 播放器，一体 */}
                    <div className="mt-4 rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden">
                      {/* 生成设置信息条 */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 border-b border-[#e7ebf5]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-[#a0a7b8]">声音</span>
                          <span className="text-[13px] text-[#3f4558] font-medium">{voicePresets.find(v => v.value === voice)?.label || voice}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-[#a0a7b8]">文件名称</span>
                          <span className="text-[13px] text-[#3f4558] font-medium">{resultText.slice(0, 20).trim() || '未命名'}.mp3</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-[#a0a7b8]">音频格式</span>
                          <span className="text-[13px] text-[#3f4558] font-medium">MP3 · 32秒 · 128kbps</span>
                        </div>
                      </div>
                      {/* 音频播放器 */}
                      <div className="px-3 py-2 flex items-center gap-3 h-10">
                        <button onClick={togglePlay} className="w-6 h-6 rounded-full bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white flex items-center justify-center shrink-0 transition-colors">
                          {isPlaying ? <Pause className="h-3 w-3" weight="fill" /> : <Play className="h-3 w-3 ml-0.5" weight="fill" />}
                        </button>
                        <div className="flex-1 relative">
                          <input type="range" min={0} max={duration} step={0.01} value={currentTime} onChange={handleProgressChange} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #4f55ec ${(currentTime/duration)*100}%, #e7ebf5 ${(currentTime/duration)*100}%)`, WebkitAppearance: 'none' }} />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 w-[80px] text-right">{formatAudioTime(currentTime)}/{formatAudioTime(duration)}</span>
                        <button onClick={changePlaybackRate} className="h-7 px-2.5 rounded-[6px] border border-[#e7ebf5] bg-white text-xs text-foreground hover:bg-[#f8faff] shrink-0 transition-colors">{playbackRate.toFixed(2)}x</button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
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
              <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><SpeakerHigh className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">输入文字后，生成结果将显示在这里</p></div></div>
            ) : (
              <div className="px-6 pb-6">
                <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
                {history.map(item => (
                  <div key={item.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                    <div className="w-[76px] h-[58px] rounded-[8px] bg-gradient-to-br from-[#f3f0ff] to-[#f8faff] border border-[#e7ebf5] flex items-center justify-center shrink-0 overflow-hidden relative"><SpeakerHigh className="h-5 w-5 text-[#7c3aed]/50" weight="fill" /></div>
                    <div className="w-[180px] shrink-0 min-w-0">
                      <span className="text-xs text-[#a0a7b8] block">输入内容</span>
                      <span className="text-sm text-[#697185] truncate block">{item.result.length > 20 ? item.result.slice(0, 20) + '...' : item.result}</span>
                    </div>
                    <div className="w-[150px] shrink-0 min-w-0">
                      <span className="text-xs text-[#a0a7b8] block">文件名称</span>
                      <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                    </div>
                    <div className="w-[100px] shrink-0">
                      <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                      <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                    </div>
                    <div className="w-[80px] shrink-0">
                      <span className="text-xs text-[#a0a7b8] block">状态</span>
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle className="h-3.5 w-3.5" weight="fill" />完成
                        </span>
                      ) : item.status === 'expired' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <WarningCircle className="h-3.5 w-3.5" weight="fill" />已失效
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-500 font-medium">
                          <SpinnerGap className="h-3.5 w-3.5 animate-spin" weight="fill" />处理中
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-auto shrink-0">
                      {item.status !== 'expired' ? (
                        <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-white text-[#596176] hover:bg-[#f3f5ff] hover:border-[#dfe3ff] hover:text-[#596176] shadow-none" onClick={(e) => { e.stopPropagation(); toast.success('下载完成'); }}><ArrowLineDown className="h-3.5 w-3.5" />下载</Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" disabled><ArrowLineDown className="h-3.5 w-3.5" />下载</Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] text-[#9ca2b5] hover:text-destructive gap-1" onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}><Trash className="h-3.5 w-3.5" />删除</Button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>

          {/* 删除确认弹窗 */}
          <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
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
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  {/* 输入内容 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">输入内容</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 h-[300px] overflow-y-auto">
                      <pre className="text-sm text-[#3f4558] leading-relaxed whitespace-pre-wrap font-sans">{selectedHistoryItem.result}</pre>
                    </div>
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => { navigator.clipboard.writeText(selectedHistoryItem.result); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载 MP3</Button>
                    </div>
                  </div>
                  {/* 音频区域：生成设置信息条 + 播放器 */}
                  <div className="mt-4 rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 border-b border-[#e7ebf5]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-[#a0a7b8]">声音</span>
                        <span className="text-[13px] text-[#3f4558] font-medium">知夏 · 温柔女声</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-[#a0a7b8]">音频格式</span>
                        <span className="text-[13px] text-[#3f4558] font-medium">MP3 · 32秒 · 128kbps</span>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center gap-3 h-10">
                      <button className="w-6 h-6 rounded-full bg-[#4f55ec] text-white flex items-center justify-center shrink-0"><Play className="h-3 w-3 ml-0.5" weight="fill" /></button>
                      <div className="flex-1 relative">
                        <input type="range" min={0} max={100} step={0.01} defaultValue={0} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #4f55ec 0%, #e7ebf5 0%)', WebkitAppearance: 'none' }} readOnly />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 w-[80px] text-right">00:00/00:32</span>
                      <button className="h-7 px-2.5 rounded-[6px] border border-[#e7ebf5] bg-white text-xs text-foreground shrink-0">1.00x</button>
                    </div>
                  </div>
                  {/* 文件信息 - 靠在一起 */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-[#8a91a6]">
                    <span>创建时间：{formatTime(selectedHistoryItem.time)}</span>
                  </div>
                  {/* 提示信息 */}
                  <p className="text-xs text-muted-foreground/80 mt-3 flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
