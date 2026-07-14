'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Agent } from '@/lib/mock-data'
import { AgentVideoSubtitleIntro } from '@/components/agent/agent-video-subtitle-intro'
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
  ShareNetwork, WarningCircle,
  SpinnerGap, Trash,
  MagicWand, CaretLeft,
  Subtitles, ArrowLineDown, Play, X,
  Upload, GearSix, Copy, FileText, PlusCircle,
} from '@phosphor-icons/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS = 20
const COST_PRICE = 0.02
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface VideoSubtitleExperienceProps {
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

const SOURCE_LANGUAGES = [
  { value: 'auto', label: '智能识别' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
  { value: 'ko', label: '韩文' },
]

const TARGET_LANGUAGES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
  { value: 'ko', label: '韩文' },
  { value: 'fr', label: '法语' },
]

const mockHistory = [
  { id: 'h1', title: '教程视频字幕.mp4', status: 'completed' as const, time: '2026-06-15 14:30', duration: '5:20', subtitleCount: '10条', resultId: 'result-video-subtitle', thumbnail: '/thumbnails/thumb-online-course.jpg', result: [
    { id: 's1', timeStart: '00:00:01,000', timeEnd: '00:00:04,500', original: '欢迎收看本期教程视频', translation: 'Welcome to this tutorial video' },
    { id: 's2', timeStart: '00:00:05,000', timeEnd: '00:00:08,200', original: '今天我们将学习如何使用AI工具', translation: 'Today we will learn how to use AI tools' },
    { id: 's3', timeStart: '00:00:09,000', timeEnd: '00:00:12,800', original: '首先打开软件界面', translation: 'First, open the software interface' },
    { id: 's4', timeStart: '00:00:13,500', timeEnd: '00:00:17,000', original: '然后上传你需要处理的视频文件', translation: 'Then upload the video file you need to process' },
  ]},
  { id: 'h2', title: '产品介绍字幕.mp4', status: 'completed' as const, time: '2026-06-12 09:15', duration: '2:30', subtitleCount: '8条', resultId: 'result-video-subtitle', thumbnail: '/thumbnails/thumb-smartwatch.jpg', result: [
    { id: 's1', timeStart: '00:00:00,500', timeEnd: '00:00:03,200', original: '大家好，欢迎了解我们的新产品', translation: 'Hello everyone, welcome to learn about our new product' },
    { id: 's2', timeStart: '00:00:03,500', timeEnd: '00:00:06,800', original: '这款产品采用了最新的AI技术', translation: 'This product uses the latest AI technology' },
    { id: 's3', timeStart: '00:00:07,000', timeEnd: '00:00:10,500', original: '让我们来看看它的核心功能', translation: "Let's take a look at its core features" },
    { id: 's4', timeStart: '00:00:11,000', timeEnd: '00:00:14,000', original: '操作简单，体验流畅', translation: 'Simple operation, smooth experience' },
  ]},
  { id: 'h3', title: '会议记录字幕.mov', status: 'completed' as const, time: '2026-06-10 16:00', duration: '15:00', subtitleCount: '42条', resultId: 'result-video-subtitle', thumbnail: '/thumbnails/thumb-team-meeting.jpg', result: [
    { id: 's1', timeStart: '00:00:01,000', timeEnd: '00:00:04,000', original: '今天我们讨论Q2的项目进展', translation: "Today we'll discuss Q2 project progress" },
    { id: 's2', timeStart: '00:00:04,500', timeEnd: '00:00:08,000', original: '首先由技术团队汇报成果', translation: 'First, the tech team will report results' },
    { id: 's3', timeStart: '00:00:08,500', timeEnd: '00:00:12,000', original: '我们完成了核心模块的开发和测试', translation: 'We completed the development and testing of core modules' },
    { id: 's4', timeStart: '00:00:12,500', timeEnd: '00:00:16,000', original: '下阶段将进入集成测试环节', translation: 'Next phase will enter integration testing' },
  ]},
]

const SUBTITLE_FONTS = [
  { value: 'sans-serif', label: '无衬线' },
  { value: 'serif', label: '衬线体' },
  { value: 'monospace', label: '等宽体' },
  { value: 'cursive', label: '手写体' },
]

const SUBTITLE_POSITIONS = [
  { value: 'bottom', label: '底部居中' },
  { value: 'top', label: '顶部居中' },
  { value: 'center', label: '画面居中' },
]

const SUBTITLE_COLORS = ['#FFFFFF', '#FFD700', '#00FF00', '#FF6B6B', '#4FC3F7', '#3f4558']

const SUBTITLE_SIZES = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
]

const STROKE_COLORS = ['#000000', '#3f4558', '#FFFFFF', '#FF6B6B']

const BG_STYLES = [
  { value: 'none', label: '无背景' },
  { value: 'semi', label: '半透明背景' },
  { value: 'rounded-semi', label: '圆角半透明' },
]

interface SubtitleEntry {
  id: string
  timeStart: string
  timeEnd: string
  original: string
  translation: string
}

const mockSubtitles: SubtitleEntry[] = [
  { id: 's1', timeStart: '00:00:01,000', timeEnd: '00:00:04,500', original: '欢迎收看本期教程视频', translation: 'Welcome to this tutorial video' },
  { id: 's2', timeStart: '00:00:05,000', timeEnd: '00:00:08,200', original: '今天我们将学习如何使用AI工具', translation: 'Today we will learn how to use AI tools' },
  { id: 's3', timeStart: '00:00:09,000', timeEnd: '00:00:12,800', original: '首先打开软件界面', translation: 'First, open the software interface' },
  { id: 's4', timeStart: '00:00:13,500', timeEnd: '00:00:17,000', original: '然后上传你需要处理的视频文件', translation: 'Then upload the video file you need to process' },
]

export function VideoSubtitleExperience({ agent, onBack, onViewResult }: VideoSubtitleExperienceProps) {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('zh-CN')
  const [bilingual, setBilingual] = useState(true)

  // 字幕样式设置
  const [subtitleFont, setSubtitleFont] = useState('sans-serif')
  const [subtitlePosition, setSubtitlePosition] = useState('bottom')
  const [subtitleColor, setSubtitleColor] = useState('#FFFFFF')
  const [subtitleSize, setSubtitleSize] = useState('medium')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [bgStyle, setBgStyle] = useState('rounded-semi')

  // 字幕文本编辑
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>(mockSubtitles)

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (uploadedVideo && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [uploadedVideo])

  const resultRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    setResultVideoTitle(uploadedFileName.replace(/\.[^/.]+$/, '') + ' 字幕版')
    toast.success('字幕生成完成！')
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
              <Subtitles className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 字幕生成</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentVideoSubtitleIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传视频，AI 自动识别语音内容并生成精准字幕，支持多语言识别和翻译，可在线编辑字幕内容和样式，一键导出 SRT 文件。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-video-subtitle.jpg" alt="AI字幕生成封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 视频上传卡片 | 参数设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-stretch">

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

          {/* 参数设置卡片 + 立即生成按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW} ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">参数设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">源语言</span>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>{SOURCE_LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">目标语言</span>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>{TARGET_LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">双语字幕</span>
                  <Switch checked={bilingual} onCheckedChange={setBilingual} />
                </div>
              </div>
              {uploadedVideo && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在生成...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />立即生成</span>)}
                  </Button>
                  <p className="text-[11px] text-[#b7becf] mt-3">{COST_TEXT}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CARD 3 — 字幕生成结果 */}
        {isProcessing && (
          <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
            <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-4">生成结果</h3>
            </div>
            <div className="p-6 pt-4 pb-6">
              <div className="p-10 text-center">
                <SpinnerGap className="h-10 w-10 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在生成字幕…</p>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
                  <span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-stretch">
                {/* 左侧：字幕文本编辑区 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">字幕文本 <span className="text-xs text-[#a0a7b8] font-normal">（点击可编辑）</span></h4>
                  <div className="flex-1 rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden divide-y divide-[#e7ebf5]">
                    {subtitles.map((sub, idx) => (
                      <div key={sub.id} className="px-4 py-3 hover:bg-[#f0f4ff]/50 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-mono text-[#4f55ec] bg-[#eef1ff] px-1.5 py-0.5 rounded">#{idx + 1}</span>
                          <span className="text-[11px] font-mono text-[#8a91a6]">{sub.timeStart} → {sub.timeEnd}</span>
                        </div>
                        <textarea
                          value={sub.original}
                          onChange={(e) => {
                            const val = e.target.value
                            setSubtitles(prev => prev.map(s => s.id === sub.id ? { ...s, original: val } : s))
                          }}
                          className="w-full text-sm text-[#3f4558] bg-transparent border-0 resize-none focus:outline-none focus:ring-0 p-0 leading-relaxed min-h-[28px]"
                          rows={1}
                        />
                        <textarea
                          value={sub.translation}
                          onChange={(e) => {
                            const val = e.target.value
                            setSubtitles(prev => prev.map(s => s.id === sub.id ? { ...s, translation: val } : s))
                          }}
                          className="w-full text-xs text-[#8a91a6] bg-transparent border-0 resize-none focus:outline-none focus:ring-0 p-0 leading-relaxed min-h-[24px]"
                          rows={1}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    {/* 字幕样式设置弹窗 */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5"><GearSix className="h-3.5 w-3.5" />字幕样式</Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[340px] rounded-[14px] border-[#e7ebf5] p-0 overflow-hidden" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                        <div className="px-4 py-3 border-b border-[#e7ebf5]" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
                          <span className="text-sm font-medium text-[#3f4558]">字幕样式设置</span>
                        </div>
                        <div className="p-4 flex flex-col gap-3.5">
                          {/* 字幕字体 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">字幕字体</span>
                            <Select value={subtitleFont} onValueChange={setSubtitleFont}>
                              <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_FONTS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          {/* 字幕位置 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">字幕位置</span>
                            <Select value={subtitlePosition} onValueChange={setSubtitlePosition}>
                              <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_POSITIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          {/* 字幕颜色 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">字幕颜色</span>
                            <div className="flex items-center gap-1.5">
                              {SUBTITLE_COLORS.map(c => (
                                <button key={c} onClick={() => setSubtitleColor(c)} className={cn('w-6 h-6 rounded-full border-2 transition-all', subtitleColor === c ? 'border-[#4f55ec] scale-110' : 'border-transparent')} style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </div>
                          {/* 字幕大小 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">字幕大小</span>
                            <Select value={subtitleSize} onValueChange={setSubtitleSize}>
                              <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          {/* 描边颜色 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">描边颜色</span>
                            <div className="flex items-center gap-1.5">
                              {STROKE_COLORS.map(c => (
                                <button key={c} onClick={() => setStrokeColor(c)} className={cn('w-6 h-6 rounded-full border-2 transition-all', strokeColor === c ? 'border-[#4f55ec] scale-110' : 'border-transparent')} style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #e7ebf5' : undefined }} />
                              ))}
                            </div>
                          </div>
                          {/* 描边粗细 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">描边粗细</span>
                            <div className="flex items-center gap-2">
                              <input type="range" min={0} max={4} step={1} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-[100px] accent-[#4f55ec]" />
                              <span className="text-xs text-[#697185] w-6 text-right">{strokeWidth}px</span>
                            </div>
                          </div>
                          {/* 字幕背景 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#3f4558]">字幕背景</span>
                            <Select value={bgStyle} onValueChange={setBgStyle}>
                              <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-[10px] border-[#E5E9F6]">{BG_STYLES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('SRT 文件已导出')}><FileText className="h-3.5 w-3.5" />导出 SRT</Button>
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('已复制全部字幕文本')}><Copy className="h-3.5 w-3.5" />复制全部</Button>
                  </div>
                </div>
                {/* 右侧：视频预览 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                  <div className="flex-1 rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                          <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                        </div>
                        <p className="text-sm font-medium text-[#3f4558]">{resultVideoTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">源语言：{sourceLang === 'auto' ? '智能识别' : SOURCE_LANGUAGES.find(l => l.value === sourceLang)?.label} | 目标语言：{TARGET_LANGUAGES.find(l => l.value === targetLang)?.label}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
            </div>
          </div>
        )}

        {/* CARD 4 — 字幕生成历史 */}
        <div className="rounded-[18px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
          <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-[18px] font-medium text-[#3f4558]">生成历史</h3><span className="text-sm text-muted-foreground">历史记录将为您保留 3 天。为避免过期丢失，请及时下载到本地设备。</span></div>
          </div>
          {history.length === 0 ? (
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><Subtitles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">上传视频后，字幕生成结果将显示在这里</p></div></div>
          ) : (
            <div className="px-6 pb-6">
              <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
              {history.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                  <img src={item.thumbnail} alt={item.title} className="w-[76px] h-[58px] rounded-[8px] shrink-0 object-cover" />
                  <div className="w-[160px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">视频名称</span>
                    <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">时长</span>
                    <span className="text-sm text-[#697185]">{item.duration}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">字幕数量</span>
                    <span className="text-sm text-[#697185]">{item.subtitleCount}</span>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                    <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto shrink-0">
                    <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-white text-[#596176] hover:bg-[#f3f5ff] hover:border-[#dfe3ff] hover:text-[#596176] shadow-none" onClick={(e) => { e.stopPropagation(); toast.success('下载完成'); }}><ArrowLineDown className="h-3.5 w-3.5" />下载</Button>
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
          <AlertDialogContent className="rounded-[12px] max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base text-foreground">确认删除</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">删除后无法恢复。确认要删除这条记录吗？</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-9 rounded-[10px] text-sm">取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="h-9 rounded-[10px] text-sm bg-destructive hover:bg-destructive/90 text-white">删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 历史记录详情弹窗 */}
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedHistoryItem(null)}>
            <div className="bg-white rounded-[16px] shadow-2xl max-w-[850px] w-full mx-4 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-stretch">
                  {/* 左侧：字幕文本编辑区 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">字幕文本</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-y-auto divide-y divide-[#e7ebf5] h-[309px]">
                      {(selectedHistoryItem.result || mockSubtitles).map((sub: SubtitleEntry, idx: number) => (
                        <div key={sub.id} className="px-4 py-3 hover:bg-[#f0f4ff]/50 transition-colors">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] font-mono text-[#4f55ec] bg-[#eef1ff] px-1.5 py-0.5 rounded">#{idx + 1}</span>
                            <span className="text-[11px] font-mono text-[#8a91a6]">{sub.timeStart} {String.fromCharCode(8594)} {sub.timeEnd}</span>
                          </div>
                          <div className="text-sm text-[#3f4558] leading-relaxed mb-1">{sub.original}</div>
                          <div className="text-xs text-[#8a91a6] leading-relaxed">{sub.translation}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {/* 字幕样式设置弹窗 */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5"><GearSix className="h-3.5 w-3.5" />字幕样式</Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[340px] rounded-[14px] border-[#e7ebf5] p-0 overflow-hidden" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                          <div className="px-4 py-3 border-b border-[#e7ebf5]" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
                            <span className="text-sm font-medium text-[#3f4558]">字幕样式设置</span>
                          </div>
                          <div className="p-4 flex flex-col gap-3.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">字幕字体</span>
                              <Select value={subtitleFont} onValueChange={setSubtitleFont}>
                                <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_FONTS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">字幕位置</span>
                              <Select value={subtitlePosition} onValueChange={setSubtitlePosition}>
                                <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_POSITIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">字幕颜色</span>
                              <div className="flex items-center gap-1.5">
                                {SUBTITLE_COLORS.map(c => (
                                  <button key={c} onClick={() => setSubtitleColor(c)} className={cn('w-6 h-6 rounded-full border-2 transition-all', subtitleColor === c ? 'border-[#4f55ec] scale-110' : 'border-transparent')} style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">字幕大小</span>
                              <Select value={subtitleSize} onValueChange={setSubtitleSize}>
                                <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-[10px] border-[#E5E9F6]">{SUBTITLE_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">描边颜色</span>
                              <div className="flex items-center gap-1.5">
                                {STROKE_COLORS.map(c => (
                                  <button key={c} onClick={() => setStrokeColor(c)} className={cn('w-6 h-6 rounded-full border-2 transition-all', strokeColor === c ? 'border-[#4f55ec] scale-110' : 'border-transparent')} style={{ backgroundColor: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #e7ebf5' : undefined }} />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">描边粗细</span>
                              <div className="flex items-center gap-2">
                                <input type="range" min={0} max={4} step={1} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-[100px] accent-[#4f55ec]" />
                                <span className="text-xs text-[#697185] w-6 text-right">{strokeWidth}px</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#3f4558]">字幕背景</span>
                              <Select value={bgStyle} onValueChange={setBgStyle}>
                                <SelectTrigger className="w-[140px] h-8 rounded-[8px] border-[#e7ebf5] text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-[10px] border-[#E5E9F6]">{BG_STYLES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('SRT 文件已导出')}><FileText className="h-3.5 w-3.5" />导出 SRT</Button>
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('已复制全部字幕文本')}><Copy className="h-3.5 w-3.5" />复制全部</Button>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                  </div>
                  {/* 右侧：视频预览 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden h-[309px]">
                      <div className="w-full h-full bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                            <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                          </div>
                          <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">源语言：{sourceLang === 'auto' ? '智能识别' : SOURCE_LANGUAGES.find(l => l.value === sourceLang)?.label} | 目标语言：{TARGET_LANGUAGES.find(l => l.value === targetLang)?.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
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
