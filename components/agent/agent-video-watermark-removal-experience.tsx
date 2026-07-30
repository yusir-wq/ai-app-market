'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Agent } from '@/lib/mock-data'
import { AgentVideoWatermarkRemovalIntro } from '@/components/agent/agent-video-watermark-removal-intro'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Star, ShareNetwork, WarningCircle, SpinnerGap, Trash, MagicWand, CaretLeft, Eraser, ArrowLineDown, Play, X, Upload, Subtitles, PlusCircle, CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS = 25
const COST_PRICE = 0.025
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface VideoWatermarkRemovalExperienceProps {
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

const REMOVAL_TYPES = [
  { value: 'subtitle', label: '去字幕' },
  { value: 'watermark', label: '去水印' },
]

const FILL_MODES = [
  { value: 'ai-inpaint', label: 'AI智能填充' },
  { value: 'blur', label: '模糊处理' },
  { value: 'edge-blend', label: '边缘融合' },
]

const mockHistory = [
  { id: 'h1', title: '教程视频去水印.mp4', status: 'completed' as const, time: '2026-06-15 14:30', duration: '5:20', removalType: '去水印', resultId: 'result-video-watermark-removal', thumbnail: '/thumbnails/thumb-online-course.jpg' },
  { id: 'h2', title: '品牌视频清理.mp4', status: 'completed' as const, time: '2026-06-12 09:15', duration: '2:30', removalType: '去字幕', resultId: 'result-video-watermark-removal', thumbnail: '/thumbnails/thumb-brand-story.jpg' },
  { id: 'h3', title: 'VLOG去标记.mov', status: 'completed' as const, time: '2026-06-10 16:00', duration: '8:45', removalType: '智能识别', resultId: 'result-video-watermark-removal', thumbnail: '/thumbnails/thumb-vlog-social.jpg' },
  { id: 'h4', title: '会议视频去水印.mp4', status: 'expired' as const, time: '2024-12-01 10:00', duration: '12:30', removalType: '去水印', resultId: '', thumbnail: '/thumbnails/thumb-team-meeting.jpg' },
  { id: 'h5', title: '产品发布会清理.mov', status: 'expired' as const, time: '2024-11-15 14:30', duration: '45:00', removalType: '去字幕', resultId: '', thumbnail: '/thumbnails/thumb-product-launch.jpg' },
]

export function VideoWatermarkRemovalExperience({ agent, onBack, onViewResult }: VideoWatermarkRemovalExperienceProps) {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [removalType, setRemovalType] = useState('subtitle')
  const [fillMode, setFillMode] = useState('ai-inpaint')
  const [resultTab, setResultTab] = useState<'before' | 'after'>('after')

  // 框选区域
  interface DrawnRect {
    id: string
    x: number; y: number; width: number; height: number
    type: 'watermark' | 'subtitle'
  }
  const [rects, setRects] = useState<DrawnRect[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [downloadConfirmId, setDownloadConfirmId] = useState<string | null>(null)
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
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska']
    if (!validTypes.includes(file.type)) {
      toast.error('仅支持 MP4、MOV、AVI、MKV 格式')
      return
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error('视频大小不能超过 2GB')
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
    setResultVideoTitle(uploadedFileName.replace(/\.[^/.]+$/, '') + ' 无水印版')
    toast.success('视频去水印完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }

  // 框选绘制处理
  const canDraw = !!uploadedVideo
  function getRelativePos(e: React.MouseEvent) {
    if (!previewRef.current) return { x: 0, y: 0 }
    const rect = previewRef.current.getBoundingClientRect()
    return { x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) }
  }
  function handleDrawStart(e: React.MouseEvent) {
    if (!canDraw) return
    e.preventDefault()
    const pos = getRelativePos(e)
    setIsDrawing(true)
    setDrawStart(pos)
    setDrawCurrent(pos)
  }
  function handleDrawMove(e: React.MouseEvent) {
    if (!isDrawing) return
    setDrawCurrent(getRelativePos(e))
  }
  function handleDrawEnd() {
    if (!isDrawing || !drawStart || !drawCurrent) { setIsDrawing(false); return }
    const x = Math.min(drawStart.x, drawCurrent.x)
    const y = Math.min(drawStart.y, drawCurrent.y)
    const w = Math.abs(drawCurrent.x - drawStart.x)
    const h = Math.abs(drawCurrent.y - drawStart.y)
    if (w > 0.02 && h > 0.02) {
      const newRect: DrawnRect = {
        id: `rect-${Date.now()}`,
        x, y, width: w, height: h,
        type: removalType as 'watermark' | 'subtitle',
      }
      setRects(prev => [...prev, newRect])
    }
    setIsDrawing(false)
    setDrawStart(null)
    setDrawCurrent(null)
  }
  function handleDeleteRect(id: string) {
    setRects(prev => prev.filter(r => r.id !== id))
  }

  const CARD_SHADOW = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' } as React.CSSProperties

  const removalTypeLabel = REMOVAL_TYPES.find(r => r.value === removalType)?.label || '去字幕'

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
              <Eraser className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 视频去水印</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentVideoWatermarkRemovalIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传视频，AI 智能识别画面中的水印和字幕区域，自动分析并填充去除，支持手动框选精确指定去除区域，还原干净画面。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-video-watermark-removal.jpg" alt="AI视频去水印封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 视频上传卡片 | 参数设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1.2fr] gap-6 items-stretch">

          {/* 视频上传区卡片 */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1 relative">
                {uploadedVideo ? (
                  <div
                    ref={previewRef}
                    className={cn(
                      'relative w-full h-full min-h-[280px] rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] overflow-hidden flex items-center justify-center',
                      canDraw && 'cursor-crosshair'
                    )}
                    onMouseDown={handleDrawStart}
                    onMouseMove={handleDrawMove}
                    onMouseUp={handleDrawEnd}
                    onMouseLeave={handleDrawEnd}
                  >
                    <video src={uploadedVideo} controls className="max-w-full max-h-full pointer-events-none" />
                    {/* 框选区域覆盖层 */}
                    {rects.map(r => (
                      <div
                        key={r.id}
                        className="absolute border-2 border-dashed pointer-events-auto"
                        style={{
                          left: `${r.x * 100}%`, top: `${r.y * 100}%`,
                          width: `${r.width * 100}%`, height: `${r.height * 100}%`,
                          borderColor: r.type === 'watermark' ? '#ef4444' : '#3b82f6',
                          background: r.type === 'watermark' ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                        }}
                      >
                        <span className={cn(
                          'absolute -top-5 left-0 text-[10px] px-1.5 py-0.5 rounded font-medium leading-none whitespace-nowrap',
                          r.type === 'watermark' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        )}>
                          {r.type === 'watermark' ? '去水印' : '去字幕'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteRect(r.id) }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {/* 正在绘制的矩形 */}
                    {isDrawing && drawStart && drawCurrent && (
                      <div
                        className="absolute border-2 border-dashed border-[#4f55ec] bg-[#4f55ec]/10 pointer-events-none"
                        style={{
                          left: `${Math.min(drawStart.x, drawCurrent.x) * 100}%`,
                          top: `${Math.min(drawStart.y, drawCurrent.y) * 100}%`,
                          width: `${Math.abs(drawCurrent.x - drawStart.x) * 100}%`,
                          height: `${Math.abs(drawCurrent.y - drawStart.y) * 100}%`,
                        }}
                      />
                    )}
                    <button
                      onClick={() => { setUploadedVideo(null); setUploadedFileName(''); setRects([]) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs">
                      {uploadedFileName}
                    </div>
                    {/* 绘制模式提示 */}
                    {canDraw && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#4f55ec]/90 text-white text-[11px] font-medium flex items-center gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        在视频上拖拽框选{removalType === 'watermark' ? '水印' : '字幕'}区域
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[280px] border-2 border-dashed rounded-[12px] py-10 px-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 border-[#e7ebf5] hover:border-primary/30" style={{ background: '#f8faff' }} onClick={() => fileInputRef.current?.click()}>
                    <PlusCircle className="text-[#4f55ec]" style={{ fontSize: '60px' }} />
                    <p className="text-[17px] text-[#3f4558]">点击或拖拽上传视频</p>
                    <div className="flex flex-col items-center gap-1 text-[13px] text-muted-foreground"><span>支持 MP4、MOV、AVI、MKV</span><span>最大 2GB</span></div>
                    <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska" className="hidden" onChange={handleVideoUpload} />
                  </div>
                )}
              </div>
              <p className="flex items-center gap-1.5 mt-3 text-[12px] text-muted-foreground/70 shrink-0"><WarningCircle className="h-3 w-3 shrink-0" />请确保视频内容合法合规，不包含侵权或违规信息。</p>
            </div>
          </div>

          {/* 参数设置卡片 + 开始去水印按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">参数设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">去除类型</span>
                  <Tabs value={removalType} onValueChange={setRemovalType}>
                    <TabsList className="h-8 p-0.5 rounded-[8px] bg-[#eef1ff] border-0">
                      <TabsTrigger value="subtitle" className="h-7 px-3 rounded-[6px] text-[12px] data-[state=active]:bg-white data-[state=active]:text-[#4f55ec] data-[state=active]:shadow-sm data-[state=inactive]:text-[#3f4558]/60 data-[state=inactive]:bg-transparent">去字幕（0/5）</TabsTrigger>
                      <TabsTrigger value="watermark" className="h-7 px-3 rounded-[6px] text-[12px] data-[state=active]:bg-white data-[state=active]:text-[#4f55ec] data-[state=active]:shadow-sm data-[state=inactive]:text-[#3f4558]/60 data-[state=inactive]:bg-transparent">去水印（0/5）</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">填充方式</span>
                  <Select value={fillMode} onValueChange={setFillMode}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>{FILL_MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              {uploadedVideo && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在处理...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />开始去水印</span>)}
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
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在去除水印…</p>
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
                <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
                <span className="text-xs text-[#8a91a6]">消耗 {COST_POINTS} 智点</span>
              </div>
            </div>
            <div className="p-6 pt-4">
              <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                    {/* 处理前/处理后 Tabs — 右上角悬浮 */}
                    <Tabs value={resultTab} onValueChange={(v) => setResultTab(v as 'before' | 'after')} className="absolute top-3 right-3 z-10">
                      <TabsList className="h-8 p-0.5 rounded-[8px] bg-[#eef1ff] border-0 shadow-md">
                        <TabsTrigger value="before" className="h-7 px-3 rounded-[6px] text-[12px] data-[state=active]:bg-white data-[state=active]:text-[#4f55ec] data-[state=active]:shadow-sm data-[state=inactive]:text-[#3f4558]/60 data-[state=inactive]:bg-transparent">处理前</TabsTrigger>
                        <TabsTrigger value="after" className="h-7 px-3 rounded-[6px] text-[12px] data-[state=active]:bg-white data-[state=active]:text-[#4f55ec] data-[state=active]:shadow-sm data-[state=inactive]:text-[#3f4558]/60 data-[state=inactive]:bg-transparent">处理后</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                        <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                      </div>
                      <p className="text-sm font-medium text-[#3f4558]">
                        {resultTab === 'before' ? uploadedFileName : resultVideoTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resultTab === 'before' ? '原始视频' : `去除类型：${removalTypeLabel}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                </div>
                <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
            </div>
          </div>
        )}

        {/* CARD 4 — 生成历史 */}
        <div className="rounded-[18px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
          <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-[18px] font-medium text-[#3f4558]">生成历史</h3><span className="text-sm text-muted-foreground">历史记录将为您保留 3 天。为避免过期丢失，请及时下载到本地设备。</span></div>
          </div>
          {history.length === 0 ? (
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><Eraser className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无去水印记录</p><p className="text-sm text-muted-foreground">上传视频后，处理结果将显示在这里</p></div></div>
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
                  <div className="w-[80px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">去除类型</span>
                    <span className="text-sm text-[#697185]">{item.removalType}</span>
                  </div>
                  <div className="w-[120px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                    <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                  </div>
                  <div className="w-[70px] shrink-0">
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
            <div className="bg-white rounded-[16px] shadow-2xl max-w-[750px] w-full mx-4 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
                <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                          <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                        </div>
                        <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">去除类型：{selectedHistoryItem.removalType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
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
