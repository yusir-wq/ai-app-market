'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Agent } from '@/lib/mock-data'
import { AgentVideoTranslateIntro } from '@/components/agent/agent-video-translate-intro'
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
  Translate, ArrowLineDown, Play, X,
  Copy, PlusCircle, CheckCircle,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS = 30
const COST_PRICE = 0.03
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface VideoTranslateExperienceProps {
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

const LANGUAGES = [
  { value: 'auto', label: '智能识别' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
  { value: 'ko', label: '韩文' },
  { value: 'fr', label: '法语' },
]

const mockHistory = [
  { id: 'h1', title: '产品介绍视频翻译.mp4', status: 'completed' as const, time: '2026-06-15 14:30', duration: '2:30', sourceLang: '中文', targetLang: '英文', resultId: 'result-video-translate', thumbnail: '/thumbnails/thumb-smartwatch.jpg', result: '翻译完成\n\n源语言：中文\n目标语言：英文\n翻译模式：仅字幕\n\n已生成英文字幕文件。' },
  { id: 'h2', title: '教程视频翻译.mp4', status: 'completed' as const, time: '2026-06-12 09:15', duration: '5:20', sourceLang: '英文', targetLang: '中文', resultId: 'result-video-translate', thumbnail: '/thumbnails/thumb-online-course.jpg', result: '翻译完成\n\n源语言：英文\n目标语言：中文\n翻译模式：仅字幕\n\n已生成中文字幕文件。' },
  { id: 'h3', title: '会议录像翻译.mov', status: 'completed' as const, time: '2026-06-10 16:00', duration: '15:00', sourceLang: '中文', targetLang: '日文', resultId: 'result-video-translate', thumbnail: '/thumbnails/thumb-business-conference.jpg', result: '翻译完成\n\n源语言：中文\n目标语言：日文\n翻译模式：仅字幕\n\n已生成日文字幕文件。' },
  { id: 'h4', title: '产品发布会视频.mp4', status: 'expired' as const, time: '2024-12-01 10:00', duration: '8:30', sourceLang: '中文', targetLang: '韩文', resultId: '', thumbnail: '/thumbnails/thumb-product-launch.jpg', result: '产品发布会视频翻译（超过30天已失效）' },
  { id: 'h5', title: '培训课程视频.mp4', status: 'expired' as const, time: '2024-11-15 14:30', duration: '12:00', sourceLang: '英文', targetLang: '中文', resultId: '', thumbnail: '/thumbnails/thumb-training.jpg', result: '培训课程视频翻译（超过30天已失效）' },
]

export function VideoTranslateExperience({ agent, onBack, onViewResult }: VideoTranslateExperienceProps) {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')

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
    setResultVideoTitle(uploadedFileName.replace(/\.[^/.]+$/, '') + ' 翻译版')
    toast.success('视频翻译完成！')
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
              <Translate className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 视频翻译</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentVideoTranslateIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传视频，AI 自动识别语音并翻译为目标语言，生成逐句对齐的翻译字幕，让视频内容跨越语言障碍。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-video-translate.jpg" alt="AI视频翻译封面图" className="w-full h-full object-cover" />
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

          {/* 翻译设置卡片 + 立即翻译按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden w-[428px]" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">参数设置</h3>
              {/* 翻译模式（固定为仅字幕，只读展示） */}
              <div className="shrink-0 mb-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">翻译模式</span>
                <div className="w-[380px] h-9 flex items-center rounded-[11px] border border-[#e7ebf5] bg-[#f8faff] px-3 text-sm text-[#697185] select-none cursor-default">仅字幕</div>
              </div>
              {/* 源语言 */}
              <div className="shrink-0 mb-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">源语言</span>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-[380px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>{LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {/* 目标语言 */}
              <div className="shrink-0 mb-3">
                <span className="text-[13px] font-medium text-[#3f4558]/60 mb-2 block">目标语言</span>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-[380px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>{LANGUAGES.filter(l => l.value !== 'auto').map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {uploadedVideo && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在翻译...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />立即翻译</span>)}
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
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在翻译视频…</p>
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
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 items-stretch">
                {/* 左侧：字幕文本 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">翻译字幕</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 flex-1 overflow-y-auto max-h-[400px]">
                    <div className="space-y-4">
                      <div className="group">
                        <p className="text-xs text-[#4f55ec] font-medium mb-1">00:00 → 00:05</p>
                        <p className="text-sm text-[#3f4558] mb-1">Welcome to today's lecture on machine learning</p>
                        <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="欢迎来到今天的机器学习讲座" rows={1} />
                      </div>
                      <div className="group">
                        <p className="text-xs text-[#4f55ec] font-medium mb-1">00:05 → 00:10</p>
                        <p className="text-sm text-[#3f4558] mb-1">In this session, we will explore the basics of AI</p>
                        <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="在本次课程中，我们将探索AI的基础知识" rows={1} />
                      </div>
                      <div className="group">
                        <p className="text-xs text-[#4f55ec] font-medium mb-1">00:10 → 00:15</p>
                        <p className="text-sm text-[#3f4558] mb-1">Let's start with the definition of machine learning</p>
                        <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="让我们从机器学习的定义开始" rows={1} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('已复制到剪贴板')}><Copy className="h-3.5 w-3.5" />复制</Button>
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载字幕</Button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
                {/* 右侧：视频预览 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden flex-1">
                    <div className="aspect-video bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                          <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                        </div>
                        <p className="text-sm font-medium text-[#3f4558]">{resultVideoTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sourceLang === 'auto' ? '智能识别' : sourceLang} → {targetLang}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
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
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><Translate className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无翻译记录</p><p className="text-sm text-muted-foreground">上传视频后，翻译结果将显示在这里</p></div></div>
          ) : (
            <div className="px-6 pb-6">
              <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
              {history.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                  <img src={item.thumbnail} alt={item.title} className="w-[76px] h-[58px] rounded-[8px] shrink-0 object-cover" />
                  <div className="w-[180px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">文件名</span>
                    <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">时长</span>
                    <span className="text-sm text-[#697185]">{item.duration}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">源语言</span>
                    <span className="text-sm text-[#697185]">{item.sourceLang}</span>
                  </div>
                  <div className="w-[80px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">目标语言</span>
                    <span className="text-sm text-[#697185]">{item.targetLang}</span>
                  </div>
                  <div className="w-[130px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                    <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                  </div>
                  <div className="w-[90px] shrink-0">
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
                      <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-white text-[#596176] hover:bg-[#f3f5ff] hover:border-[#dfe3ff] hover:text-[#596176] shadow-none" onClick={(e) => { e.stopPropagation(); setDownloadConfirmId(item.id); }}><ArrowLineDown className="h-3.5 w-3.5" />下载</Button>
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
            <div className="bg-white rounded-[16px] shadow-2xl max-w-[900px] w-full mx-4 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* 标题区域 - 带渐变背景 */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
                  <span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span>
                </div>
                <button onClick={() => setSelectedHistoryItem(null)} className="text-[#8a91a6] hover:text-[#3f4558] transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {/* 内容区域 */}
              <div className="p-6 pt-4 overflow-y-auto max-h-[65vh]">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 items-stretch">
                  {/* 左侧：字幕列表 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">翻译字幕</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 overflow-y-auto max-h-[400px]">
                      <div className="space-y-4">
                        <div className="group">
                          <p className="text-xs text-[#4f55ec] font-medium mb-1">00:00 → 00:05</p>
                          <p className="text-sm text-[#3f4558] mb-1">Welcome to today's lecture on machine learning</p>
                          <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="欢迎来到今天的机器学习讲座" rows={1} />
                        </div>
                        <div className="group">
                          <p className="text-xs text-[#4f55ec] font-medium mb-1">00:05 → 00:10</p>
                          <p className="text-sm text-[#3f4558] mb-1">In this session, we will explore the basics of AI</p>
                          <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="在本次课程中，我们将探索AI的基础知识" rows={1} />
                        </div>
                        <div className="group">
                          <p className="text-xs text-[#4f55ec] font-medium mb-1">00:10 → 00:15</p>
                          <p className="text-sm text-[#3f4558] mb-1">Let's start with the definition of machine learning</p>
                          <textarea className="w-full text-sm text-[#697185] bg-transparent border-none outline-none resize-none" defaultValue="让我们从机器学习的定义开始" rows={1} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => toast.success('已复制到剪贴板')}><Copy className="h-3.5 w-3.5" />复制</Button>
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载字幕</Button>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                  </div>
                  {/* 右侧：视频预览 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden flex-1">
                      <div className="aspect-video bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                            <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                          </div>
                          <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{selectedHistoryItem.sourceLang} → {selectedHistoryItem.targetLang}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                    </div>
                    <div className="mt-[7px] h-[16px]"></div>
                  </div>
                </div>
                {/* 文件信息 */}
                <div className="mt-4 flex items-center gap-4 text-xs text-[#8a91a6]">
                  <span>文件名称：{selectedHistoryItem.title}</span>
                  <span>创建时间：{formatTime(selectedHistoryItem.time)}</span>
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
