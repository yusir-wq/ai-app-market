'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Play,
  Pause,
  GearSix,
  CheckCircle,
  MagicWand,
  BookOpen,
  FileText,
  UploadSimple,
  MusicNotesSimple,
  Lightning,
  Sparkle,
  Spinner,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Agent } from '@/lib/mock-data'

// ============================================================
// V2.0 Constants
// ============================================================

const CARD_SHADOW: React.CSSProperties = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' }

// ============================================================
// Types
// ============================================================

interface TextToSpeechExperienceProps {
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
// Quick Fill Actions
// ============================================================

const quickFillActions = [
  { id: 'ai-write', label: 'AI帮我写', icon: MagicWand },
  { id: 'random-story', label: '随机故事', icon: BookOpen },
  { id: 'upload-txt', label: '上传txt', icon: FileText },
]

// ============================================================
// Voice Presets
// ============================================================

const voicePresets = [
  {
    value: 'female-gentle',
    label: 'Bella',
    avatar: 'B',
    avatarBg: 'bg-rose-100 text-rose-600',
    tags: '温暖，知性，细腻',
    tagColor: 'bg-rose-50 text-rose-600',
  },
  {
    value: 'female-lively',
    label: 'Luna',
    avatar: 'L',
    avatarBg: 'bg-pink-100 text-pink-600',
    tags: '欢快，明亮，自信',
    tagColor: 'bg-pink-50 text-pink-600',
  },
  {
    value: 'male-calm',
    label: 'Alex',
    avatar: 'A',
    avatarBg: 'bg-blue-100 text-blue-600',
    tags: '沉稳，大气，字正腔圆',
    tagColor: 'bg-blue-50 text-blue-600',
  },
  {
    value: 'male-deep',
    label: 'Marcus',
    avatar: 'M',
    avatarBg: 'bg-indigo-100 text-indigo-600',
    tags: '低沉，醇厚，富有感染力',
    tagColor: 'bg-indigo-50 text-indigo-600',
  },
  {
    value: 'child',
    label: 'Milo',
    avatar: 'M',
    avatarBg: 'bg-amber-100 text-amber-600',
    tags: '天真，灵动，自然',
    tagColor: 'bg-amber-50 text-amber-600',
  },
]

// ============================================================
// Background Music Options
// ============================================================

const bgmOptions = [
  { value: 'none', label: '无背景音乐', duration: '' },
  { value: 'light', label: '阳光明媚', duration: '01:18', sub: '轻快自然' },
  { value: 'inspire', label: '逐梦前行', duration: '02:05', sub: '积极向上' },
  { value: 'upbeat', label: '元气满满', duration: '00:52', sub: '活泼灵动' },
  { value: 'cinematic', label: '史诗之旅', duration: '01:45', sub: '大气沉稳' },
  { value: 'lofi', label: '午后咖啡馆', duration: '02:30', sub: '悠闲放松' },
  { value: 'classical', label: '月光花园', duration: '03:12', sub: '优雅温婉' },
  { value: 'electronic', label: '未来脉搏', duration: '01:33', sub: '科技节奏' },
]

// ============================================================
// Voice Settings Popover Content
// ============================================================

function VoiceSettingsPopover({
  speed,
  volume,
  onSpeedChange,
  onVolumeChange,
}: {
  speed: number
  volume: number
  onSpeedChange: (v: number) => void
  onVolumeChange: (v: number) => void
}) {
  return (
    <PopoverContent
      side="left"
      align="start"
      className="w-56 p-0 overflow-hidden shadow-xl border-[#f0f2f8] rounded-[14px]"
    >
      <div className="p-3 space-y-3">
        {/* 语速：标签 + 进度条 + 当前值 一行 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">语速</span>
            <Slider
              value={[speed]}
              onValueChange={(vals) => onSpeedChange(vals[0])}
              min={0.5}
              max={2.0}
              step={0.1}
              className="flex-1"
            />
            <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{speed}x</span>
          </div>
        </div>
        {/* 音量：标签 + 进度条 + 当前值 一行 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3f4558]/60 shrink-0 w-7">音量</span>
            <Slider
              value={[volume]}
              onValueChange={(vals) => onVolumeChange(vals[0])}
              min={50}
              max={150}
              step={10}
              className="flex-1"
            />
            <span className="text-[12px] font-medium tabular-nums text-[#3f4558]/70 shrink-0 w-7 text-right">{volume}%</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  )
}

// ============================================================
// Voice Row Component (1 column, 5 rows)
// ============================================================

function VoiceRow({
  voice,
  isSelected,
  isPlaying,
  onSelect,
  onTogglePlay,
  speed,
  volume,
  onSpeedChange,
  onVolumeChange,
}: {
  voice: (typeof voicePresets)[number]
  isSelected: boolean
  isPlaying: boolean
  onSelect: () => void
  onTogglePlay: () => void
  speed: number
  volume: number
  onSpeedChange: (v: number) => void
  onVolumeChange: (v: number) => void
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] cursor-pointer transition-all duration-200',
        isSelected
          ? 'bg-[#4f55ec]/[0.04] ring-1 ring-[#4f55ec]/[0.12]'
          : 'hover:bg-[#4f55ec]/[0.03]'
      )}
    >
      {/* 左侧：彩色首字母头像 */}
      <div className="shrink-0">
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200',
          voice.avatarBg
        )}>
          {voice.avatar}
        </div>
      </div>

      {/* 中间：人名 + 声音标签徽章 */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={cn(
          'text-[15px] font-medium transition-colors tracking-tight',
          isSelected ? 'text-[#3f4558]' : 'text-[#3f4558]/80'
        )}>
          {voice.label}
        </span>
        <span className={cn('inline-flex items-center text-[11px] px-1.5 py-0.5 rounded-md font-medium', voice.tagColor)}>
          {voice.tags}
        </span>
      </div>

      {/* 右侧：试听 + 设置按钮（hover 显示） */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* 试听按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onTogglePlay()
          }}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
            isPlaying
              ? 'bg-[#3f4558]/10 text-[#3f4558]'
              : 'text-[#3f4558]/40 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.06]'
          )}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" weight="fill" />
          ) : (
            <Play className="h-3.5 w-3.5 ml-0.5" weight="fill" />
          )}
        </button>
        {/* 设置按钮 */}
        <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSettingsOpen(!settingsOpen)
              }}
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200',
                settingsOpen
                  ? 'bg-[#3f4558]/[0.06] text-[#3f4558]'
                  : 'text-[#3f4558]/40 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.06]'
              )}
            >
              <GearSix className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <VoiceSettingsPopover
            speed={speed}
            volume={volume}
            onSpeedChange={onSpeedChange}
            onVolumeChange={onVolumeChange}
          />
        </Popover>
      </div>

      {/* 播放中波形指示 — 底部微条 */}
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

export function TextToSpeechExperienceArea({
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
}: TextToSpeechExperienceProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [playingBgm, setPlayingBgm] = useState<string | null>(null)
  const [bgmSelectOpen, setBgmSelectOpen] = useState(false)
  // AI写悬浮卡片
  const [aiWriteKeyword, setAiWriteKeyword] = useState('')
  const [aiWriteGenerating, setAiWriteGenerating] = useState(false)

  const currentVoice = paramValues.voice || 'female-gentle'
  const currentSpeed = paramValues.speed ?? 1.0
  const currentVolume = paramValues.volume ?? 100
  const currentBgm = paramValues.bgm || ''

  const togglePreview = (voiceValue: string) => {
    if (playingVoice === voiceValue) {
      setPlayingVoice(null)
    } else {
      setPlayingVoice(voiceValue)
      setTimeout(() => setPlayingVoice(null), 2000)
    }
  }

  const toggleBgmPreview = (bgmValue: string) => {
    if (playingBgm === bgmValue) {
      setPlayingBgm(null)
    } else {
      setPlayingBgm(bgmValue)
      setTimeout(() => setPlayingBgm(null), 2000)
    }
  }

  const handleBgmUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = e.target.files?.[0]
      if (uploadedFile) {
        onParamChange('bgm', 'custom-' + uploadedFile.name)
        onParamChange('customBgmName', uploadedFile.name)
      }
      e.target.value = ''
    },
    [onParamChange]
  )

  const handleQuickFill = useCallback(
    (actionId: string) => {
      if (actionId === 'random-story') {
        onTextChange('萤火虫的秘密\n深夜，九岁的阿布悄悄溜出外婆家，提着一盏熄灭的马灯走向神秘的黑森林。\n他想抓住传说中能实现愿望的"黄金萤火虫"，来治好外婆的眼睛。林子里静得只能听到他自己的心跳，微风吹过，树叶沙沙作响。突然，前方亮起了一团温暖的微光。那不是一只，而是成千上万只萤火虫聚在一起，宛如地上的银河。\n当它们围绕着阿布翩翩起舞时，阿布闭上眼睛，在心里虔诚地许愿。等他再次睁开眼，手里的马灯竟然自己亮了起来，散发出永不熄灭的柔和光芒。阿布开心地笑了，他捧着这盏希望之灯，朝着外婆家的方向飞奔而去。')
        return
      }
    },
    [text, onTextChange]
  )

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

  // AI写生成处理
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* ========================================== */}
      {/* LEFT: 输入内容                                                    */}
      {/* ========================================== */}
      <div className="flex-1 min-w-0 relative">
        <Card className="border border-[#f0f2f8] bg-white overflow-hidden h-full" style={CARD_SHADOW}>
          <CardContent className="p-0 flex flex-col h-full">
            {/* 标题栏 — 精简到只有标题 + 工具按钮 */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f2f8]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-4 rounded-full bg-violet-400 shrink-0" />
                <h3 className="text-[15px] font-medium text-[#3f4558] tracking-tight">输入内容</h3>
                <div className="hidden sm:flex items-center gap-0.5 ml-1 pl-2 border-l border-[#f0f2f8]">
                  {/* AI帮我写 — Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors">
                        <MagicWand className="h-4 w-4" weight="duotone" />
                        AI帮我写
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="start" className="w-72 p-0 overflow-hidden shadow-xl border-[#f0f2f8] rounded-[14px]">
                      <div className="px-4 py-3 border-b border-[#f0f2f8] bg-[#f8f9fc]">
                        <span className="text-[13px] font-semibold text-[#3f4558]">AI 智能写作</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <Input
                          value={aiWriteKeyword}
                          onChange={(e) => setAiWriteKeyword(e.target.value)}
                          placeholder="输入关键词，使用AI帮写生成完整故事内容"
                          className="h-9 text-[13px] rounded-[12px] border-[#e7ebf5] focus-visible:ring-[#4f55ec]/20 focus-visible:border-[#4f55ec]/30"
                          onKeyDown={(e) => e.key === 'Enter' && handleAiWriteGenerate()}
                        />
                        <Button
                          className="w-full h-9 text-[13px] gap-2 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80"
                          onClick={handleAiWriteGenerate}
                          disabled={aiWriteGenerating}
                        >
                          {aiWriteGenerating ? (
                            <><Spinner className="h-4 w-4 animate-spin" />生成中...</>
                          ) : (
                            <>
                              <Sparkle className="h-4 w-4" weight="fill" />
                              生成
                              <span className="flex items-center gap-1 ml-1 text-xs font-normal opacity-70">
                                <span className="w-px h-3 bg-white/30" />
                                <Lightning className="h-3 w-3" weight="fill" />1
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* 随机故事 */}
                  <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => handleQuickFill('random-story')}>
                    <BookOpen className="h-4 w-4" weight="duotone" />
                    随机故事
                  </Button>

                  {/* 上传txt */}
                  <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => document.getElementById('tts-txt-upload')?.click()}>
                    <FileText className="h-4 w-4" weight="duotone" />
                    上传txt
                  </Button>
                </div>
              </div>
            </div>
            <input
              id="tts-txt-upload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleTxtUpload}
            />

          {/* 移动端工具条 */}
          <div className="sm:hidden flex items-center gap-1 flex-wrap px-4 py-2 border-b border-[#f0f2f8]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors">
                  <MagicWand className="h-4 w-4" weight="duotone" />
                  AI帮我写
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-72 p-0 overflow-hidden shadow-xl border-[#f0f2f8] rounded-[14px]">
                <div className="px-4 py-3 border-b border-[#f0f2f8] bg-[#f8f9fc]">
                  <span className="text-[13px] font-semibold text-[#3f4558]">AI 智能写作</span>
                </div>
                <div className="p-4 space-y-3">
                  <Input value={aiWriteKeyword} onChange={(e) => setAiWriteKeyword(e.target.value)} placeholder="输入关键词，使用AI帮写生成完整故事内容" className="h-9 text-[13px] rounded-[12px] border-[#e7ebf5] focus-visible:ring-[#4f55ec]/20 focus-visible:border-[#4f55ec]/30" onKeyDown={(e) => e.key === 'Enter' && handleAiWriteGenerate()} />
                  <Button className="w-full h-9 text-[13px] gap-2 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80" onClick={handleAiWriteGenerate} disabled={aiWriteGenerating}>
                    {aiWriteGenerating ? <><Spinner className="h-4 w-4 animate-spin" />生成中...</> : (<><Sparkle className="h-4 w-4" weight="fill" />生成<span className="flex items-center gap-1 ml-1 text-xs font-normal opacity-70"><span className="w-px h-3 bg-white/30" /><Lightning className="h-3 w-3" weight="fill" />1</span></>)}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => handleQuickFill('random-story')}>
              <BookOpen className="h-4 w-4" weight="duotone" />
              随机故事
            </Button>
            <Button variant="ghost" size="sm" className="h-[34px] px-2 text-[13px] gap-1 rounded-[7px] text-[#3f4558]/60 hover:text-[#3f4558] hover:bg-[#3f4558]/[0.04] transition-colors" onClick={() => document.getElementById('tts-txt-upload')?.click()}>
              <FileText className="h-4 w-4" weight="duotone" />
              上传txt
            </Button>
          </div>

          {/* Textarea — 无边框无底色，字数在右下角 */}
          <div className="flex-1 relative p-4">
            <Textarea
              id="tts-experience-textarea"
              placeholder="输入你想要的配音文案，AI 即刻生成带情感的自然人声…"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-[280px] h-full resize-none rounded-[12px] border border-[#e7ebf5] shadow-none bg-white focus-visible:ring-0 text-[13px] leading-7 placeholder:text-[#3f4558]/35"
            />
            <span className={cn(
              'absolute bottom-6 right-6 text-[11px] font-medium tabular-nums tracking-tight',
              text.length > 4500
                ? 'text-destructive/80'
                : 'text-[#3f4558]/40'
            )}>
              {text.length}/5000
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Loading 覆盖层 */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px] overflow-hidden">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
          <div className="relative z-10 text-center space-y-4">
            <div className="flex items-center justify-center">
              <Spinner className="h-8 w-8 animate-spin text-[#3f4558]/60" />
            </div>
            {progressSteps && progressSteps.length > 0 ? (
              <div className="space-y-1.5">
                {progressSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px]">
                    {step.status === 'done' ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" weight="fill" />
                    ) : step.status === 'running' ? (
                      <Spinner className="h-3.5 w-3.5 animate-spin text-[#3f4558] shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#f0f2f8] shrink-0" />
                    )}
                    <span className={cn(
                      step.status === 'done' ? 'text-emerald-600' : step.status === 'running' ? 'text-[#3f4558]/80' : 'text-[#3f4558]/50'
                    )}>
                      {step.label}
                      {step.status === 'running' && progress != null && ` ${Math.round(progress)}%`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#3f4558]/50">处理中…{progress != null ? ` ${Math.round(progress)}%` : ''}</p>
            )}
            {costPoints && processTime && (
              <p className="text-[12px] text-[#3f4558]/40">预计消耗 {costPoints} 智点 · 约 {processTime}</p>
            )}
          </div>
        </div>
      )}
    </div>

      {/* ========================================== */}
      {/* RIGHT: 选择声音 + 背景音乐 + 开始处理                              */}
      <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4">
        {/* 配音设置 Card — 音色 + BGM 合为一张卡片 */}
        <Card className="border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
          <CardContent className="p-0">
            {/* 选择声音 Section */}
            <div>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f0f2f8]">
                <span className="w-1.5 h-4 rounded-full bg-rose-400/60 shrink-0" />
                <h3 className="text-[15px] font-medium text-[#3f4558] tracking-tight">选择声音</h3>
              </div>
              <div className="px-3 py-2 space-y-1.5">
                {voicePresets.map((voice) => (
                  <VoiceRow
                    key={voice.value}
                    voice={voice}
                    isSelected={currentVoice === voice.value}
                    isPlaying={playingVoice === voice.value}
                    onSelect={() => onParamChange('voice', voice.value)}
                    onTogglePlay={() => togglePreview(voice.value)}
                    speed={currentSpeed}
                    volume={currentVolume}
                    onSpeedChange={(v) => onParamChange('speed', v)}
                    onVolumeChange={(v) => onParamChange('volume', v)}
                  />
                ))}
              </div>
            </div>

            {/* 背景音乐 — 降为子选项，标题 + 下拉同行 */}
            <div className="px-4 py-2.5 border-t border-[#f0f2f8]">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 shrink-0">背景音乐</span>
                <Select
                  open={bgmSelectOpen}
                  onOpenChange={setBgmSelectOpen}
                  value={currentBgm}
                  onValueChange={(v) => {
                    onParamChange('bgm', v)
                    setBgmSelectOpen(false)
                  }}
                >
                  <SelectTrigger className="flex-1 h-8 rounded-[11px] border border-[#e7ebf5] bg-white text-[13px] hover:bg-[#4f55ec]/[0.04] transition-colors px-3 shadow-none focus-visible:ring-[#4f55ec]/20 focus-visible:ring-1">
                    {currentBgm ? (
                      <span className="text-[#3f4558]">{bgmOptions.find(o => o.value === currentBgm)?.label || currentBgm}</span>
                    ) : (
                      <span className="text-[#3f4558]/50">选择背景音乐</span>
                    )}
                  </SelectTrigger>
                  <SelectContent align="start" className="w-[340px] p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {/* 上传本地音乐 */}
                      <label
                        className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer hover:bg-[#4f55ec]/[0.04] transition-colors text-[#3f4558]/60 hover:text-[#3f4558] border border-dashed border-[#f0f2f8]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <UploadSimple className="h-4 w-4 shrink-0" weight="duotone" />
                        <span className="text-[13px]">上传本地音乐</span>
                        <input
                          type="file"
                          accept=".mp3,.wav,.m4a,.flac"
                          className="hidden"
                          onChange={handleBgmUpload}
                        />
                      </label>
                      {/* BGM 选项：2 列网格 */}
                      {bgmOptions.map((opt) => {
                        const isBgmPlaying = playingBgm === opt.value
                        return (
                          <div
                            key={opt.value}
                            onClick={() => { onParamChange('bgm', opt.value); setBgmSelectOpen(false) }}
                            className={cn(
                              'group flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[#3f4558]',
                              currentBgm === opt.value
                                ? 'bg-[#4f55ec]/[0.04]'
                                : 'hover:bg-[#4f55ec]/[0.03]'
                            )}
                          >
                            {/* 音乐 icon + 播放 icon 同位置叠加 */}
                            <div
                              className="shrink-0 relative w-5 h-5"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (opt.value !== 'none') toggleBgmPreview(opt.value)
                              }}
                            >
                              {opt.value === 'none' ? (
                                <span className="absolute inset-0 flex items-center justify-center text-[10px]">—</span>
                              ) : (
                                <>
                                  <MusicNotesSimple className={cn(
                                    'absolute inset-0 h-5 w-5 transition-opacity duration-200',
                                    isBgmPlaying ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                                  )} />
                                  <div className={cn(
                                    'absolute inset-0 h-5 w-5 rounded flex items-center justify-center transition-opacity duration-200',
                                    isBgmPlaying ? 'opacity-100 bg-[#3f4558]/10' : 'opacity-0 group-hover:opacity-100 group-hover:bg-[#3f4558]/[0.05]'
                                  )}>
                                    {isBgmPlaying ? (
                                      <Pause className="h-4 w-4" weight="fill" />
                                    ) : (
                                      <Play className="h-4 w-4 ml-px" weight="fill" />
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[13px] font-medium block truncate">{opt.label}</span>
                              {opt.sub && (
                                <span className="text-[12px] text-[#3f4558]/50 block">{opt.sub} · {opt.duration}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 开始处理按钮 + 智点 */}
        <Button
          className="w-full h-[46px] text-[15px] font-semibold gap-2 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 shadow-lg shadow-[#4f55ec]/20 hover:shadow-[#4f55ec]/30 transition-all duration-200 hover:-translate-y-0.5"
          size="lg"
          onClick={onStartProcess}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Sparkle className="h-5 w-5 animate-pulse" weight="fill" />
              处理中...
            </>
          ) : (
            <>
              <Play className="h-5 w-5" weight="fill" />
              开始处理
              <span className="flex items-center gap-1 ml-1 text-[13px] font-normal opacity-80">
                <span className="w-px h-3 bg-white/30" />
                <Lightning className="h-3.5 w-3.5" weight="fill" />
                {agent.costPoints} 智点
              </span>
            </>
          )}
        </Button>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-[16px] bg-destructive/10 text-destructive text-[13px]">
            <span className="text-[13px]">⚠</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}