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
import { AgentImageToVideoIntro } from '@/components/agent/agent-image-to-video-intro'
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
  Images, ArrowLineDown, Play, X,
  Upload,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS = 30
const COST_PRICE = 0.03
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface ImageToVideoExperienceProps {
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

const mockHistory = [
  { id: 'h1', title: '瀑布动态效果.mp4', status: 'completed' as const, time: '2026-06-15 14:30', duration: '15s', resolution: '1080P', resultId: 'result-image-to-video', thumbnail: '/thumbnails/thumb-waterfall.jpg', result: '图片动态效果描述\n\n画面内容：瀑布水流从静止状态逐渐加速，水流倾泻而下，水雾在阳光下形成彩虹效果。\n运镜方式：镜头缓慢推进，从远景逐渐拉近至瀑布中景。\n动态效果：水流粒子模拟，水雾扩散效果，光影变化。' },
  { id: 'h2', title: '产品揭幕动画.mp4', status: 'completed' as const, time: '2026-06-12 09:15', duration: '10s', resolution: '1080P', resultId: 'result-image-to-video', thumbnail: '/thumbnails/thumb-product-lights.jpg', result: '图片动态效果描述\n\n画面内容：产品图从左到右缓慢推进，灯光逐一亮起，营造科技感揭幕仪式。\n运镜方式：水平平移镜头，从左至右。\n动态效果：灯光渐亮效果，金属反光变化。' },
  { id: 'h3', title: '风景延时效果.mp4', status: 'completed' as const, time: '2026-06-10 16:00', duration: '8s', resolution: '720P', resultId: 'result-image-to-video', thumbnail: '/thumbnails/thumb-landscape-clouds.jpg', result: '图片动态效果描述\n\n画面内容：风景照中的云朵缓缓飘动，湖面泛起微波，打造延时摄影效果。\n运镜方式：固定机位，延时拍摄。\n动态效果：云朵流动，水面波纹，光影变化。' },
]

export function ImageToVideoExperience({ agent, onBack, onViewResult }: ImageToVideoExperienceProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [aspectRatio, setAspectRatio] = useState('auto')
  const [resolution, setResolution] = useState('1080P')
  const [videoDuration, setVideoDuration] = useState(10)
  const [backgroundMusic, setBackgroundMusic] = useState(true)
  const [prompt, setPrompt] = useState('')

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (uploadedImage && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [uploadedImage])

  const resultRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (resultVideoTitle && resultRef.current) { setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) }
  }, [resultVideoTitle])

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      toast.error('仅支持 JPG、PNG、WebP、GIF、BMP 格式')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('图片大小不能超过 100MB')
      return
    }
    setUploadedFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleGenerate() {
    if (!uploadedImage) { toast.error('请先上传图片'); return }
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
    setResultVideoTitle(uploadedFileName.replace(/\.[^/.]+$/, '') + ' 动态视频')
    toast.success('视频生成完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }

  const CARD_SHADOW = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' } as React.CSSProperties

  return (
    <>
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #4f55ec;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #4f55ec;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
      `}</style>
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
              <Images className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 图生视频</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentImageToVideoIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传一张图片，AI 自动分析画面并生成高质量动态视频，支持多种画面比例与动态效果，让静态图片焕发动态生命力。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-image-to-video.jpg" alt="AI图生视频封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 左侧(图片上传+提示词) | 右侧(生成设置)，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-stretch">

          {/* 左侧：图片上传区 + 提示词输入，PC左右 / 移动端上下 */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">输入参考图与文案</h3>
              <div className="flex-1 flex flex-col md:flex-row gap-4" style={{ maxHeight: '319.5px' }}>
                {/* 参考图上传区 */}
                <div className="flex flex-col shrink-0 md:w-[220px]">
                  <div className="h-full relative">
                    {uploadedImage ? (
                      <div className="relative w-full h-full rounded-[10px] border border-[#e7ebf5] bg-[#F8FAFF] overflow-hidden">
                        <img src={uploadedImage} alt="已上传图片" className="w-full h-full object-contain" />
                        <button
                          onClick={() => { setUploadedImage(null); setUploadedFileName('') }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full border-2 border-dashed rounded-[10px] py-4 px-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 border-[#e7ebf5] hover:border-primary/30" style={{ background: '#f8faff' }} onClick={() => fileInputRef.current?.click()}>
                        <Images className="text-[#4f55ec]" style={{ fontSize: '40px' }} />
                        <p className="text-[14px] text-[#3f4558]">点击上传</p>
                        <span className="text-[12px] text-muted-foreground">最大 100MB</span>
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" className="hidden" onChange={handleImageUpload} />
                      </div>
                    )}
                  </div>
                </div>
                {/* 提示词输入 */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex-1 relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
                      placeholder="描述你想要的动态效果，例如：水流缓缓流动，云朵飘动，树叶摇曳..."
                      className="w-full h-full min-h-[120px] rounded-[10px] border border-[#e7ebf5] bg-[#F8FAFF] p-3 text-sm text-foreground leading-relaxed resize-none outline-none focus:border-[#4f55ec]/50 placeholder:text-muted-foreground/35"
                    />
                    <span className="absolute bottom-3 right-3 text-[11px] text-[#b7becf]">{prompt.length}/1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：生成设置卡片 + 生成按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">生成设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">画面比例</span>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="w-[120px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                      <SelectItem value="auto">自适应</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">清晰度</span>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="w-[120px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                      <SelectItem value="720P">720P</SelectItem>
                      <SelectItem value="1080P">1080P</SelectItem>
                      <SelectItem value="2K">2K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">视频时长</span>
                  <div className="flex items-center gap-2">
                    <input type="range" min={5} max={30} step={1} value={videoDuration} onChange={(e) => setVideoDuration(Number(e.target.value))} className="w-[80px] accent-[#4f55ec]" />
                    <span className="text-sm text-[#3f4558] w-8 text-right">{videoDuration}s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">背景音乐</span>
                  <Switch checked={backgroundMusic} onCheckedChange={setBackgroundMusic} />
                </div>
              </div>
              {uploadedImage && (
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

        {/* CARD 3 — 生成结果 */}
        {isProcessing && (
          <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
            <div className="p-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-4">生成结果</h3>
            </div>
            <div className="p-6 pt-4 pb-6">
              <div className="p-10 text-center">
                <SpinnerGap className="h-10 w-10 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在生成视频…</p>
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
                        <p className="text-sm font-medium text-[#3f4558]">{resultVideoTitle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
                {/* 右侧：输入参数 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">输入参数</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 h-[309px] overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* 左侧列：参考图片 + 生成设置（上下） */}
                      <div className="flex flex-col gap-4 md:flex-[3]">
                        {/* 参考图片 */}
                        {uploadedImage && (
                          <div>
                            <span className="text-xs text-[#697185] block mb-2">参考图片</span>
                            <div className="w-full rounded-[8px] overflow-hidden border border-[#e7ebf5] bg-[#f0f0f0] flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                              <img src={uploadedImage} alt="参考图片" className="w-full h-full object-contain" />
                            </div>
                          </div>
                        )}
                        {/* 生成设置 */}
                        <div>
                          <span className="text-xs text-[#697185] block mb-2">生成设置</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{videoDuration}s</span>
                            <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{aspectRatio === 'auto' ? '16:9' : aspectRatio}</span>
                            <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{resolution}</span>
                            {backgroundMusic && <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">BGM</span>}
                          </div>
                        </div>
                      </div>
                      {/* 右侧列：提示词 */}
                      <div className="flex-1 min-w-0">
                        {prompt ? (
                          <div className="h-full">
                            <span className="text-xs text-[#697185] block mb-2">提示词</span>
                            <p className="text-sm text-[#3f4558] bg-white rounded-[8px] p-3 border border-[#e7ebf5] h-[calc(100%-22px)]">{prompt}</p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">暂无提示词</span>
                          </div>
                        )}
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
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><Images className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">上传图片后，生成结果将显示在这里</p></div></div>
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
                    <span className="text-xs text-[#a0a7b8] block">清晰度</span>
                    <span className="text-sm text-[#697185]">{item.resolution}</span>
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
                          <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                  </div>
                  {/* 右侧：输入参数 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">输入参数</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-4 h-[309px] overflow-y-auto">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* 左侧列：参考图片 + 生成设置 */}
                        <div className="flex flex-col gap-4 md:flex-[3]">
                          {/* 参考图片 */}
                          {selectedHistoryItem.thumbnail && (
                            <div>
                              <span className="text-xs text-[#697185] block mb-2">参考图片</span>
                              <div className="flex items-center gap-2 text-[13px] text-[#3f4558]/60">
                                <ImageSquare className="h-4 w-4 text-[#8a91a6]" />
                                <span>图片文件已上传</span>
                              </div>
                            </div>
                          )}
                          {/* 生成设置 */}
                          <div>
                            <span className="text-xs text-[#697185] block mb-2">生成设置</span>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{videoDuration}s</span>
                              <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{aspectRatio === 'auto' ? '16:9' : aspectRatio}</span>
                              <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">{resolution}</span>
                              {backgroundMusic && <span className="inline-flex items-center text-[11px] font-medium text-[#4f55ec] bg-[#4f55ec]/[0.06] px-2 py-0.5 rounded-md">BGM</span>}
                            </div>
                          </div>
                        </div>
                        {/* 右侧列：提示词 */}
                        <div className="flex-1 min-w-0">
                          {prompt ? (
                            <div className="h-full">
                              <span className="text-xs text-[#697185] block mb-2">提示词</span>
                              <p className="text-sm text-[#3f4558] bg-white rounded-[8px] p-3 border border-[#e7ebf5] h-[calc(100%-22px)]">{prompt}</p>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">暂无提示词</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
