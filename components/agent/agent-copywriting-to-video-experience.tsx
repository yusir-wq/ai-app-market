'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Agent } from '@/lib/mock-data'
import { AgentCopywritingToVideoIntro } from '@/components/agent/agent-copywriting-to-video-intro'
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
  SpinnerGap, Trash, Copy,
  MagicWand, CaretLeft,
  PencilSimple, FileText,
  VideoCamera, ArrowLineDown, Play, X,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function getCostText(promptOptimize: boolean) {
  if (promptOptimize) {
    return '预估费用：10010智点/次（约10.10元）'
  }
  return '预估费用：10000智点/次（约10.00元）'
}
function getCostPoints(promptOptimize: boolean) {
  return promptOptimize ? 10010 : 10000
}

interface CopywritingToVideoExperienceProps {
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
  { id: 'h1', title: '产品宣传视频', copywriting: '全新产品发布，展示创新科技与轻薄设计...', status: 'completed' as const, time: '2026-06-15 14:30', duration: '15s', resolution: '1080P', aspectRatio: '16:9', hasSound: true, resultId: 'result-copywriting-to-video', thumbnail: '/thumbnails/thumb-product-lights.jpg', result: '视频文案\n\n【第1镜】开场（0-3秒）\n画面：黑色背景渐亮，产品 Logo 缓缓浮现\n旁白：「创新科技，触手可及」\n\n【第2镜】产品外观展示（3-7秒）\n画面：产品 360 度旋转展示，白色极简背景\n旁白：「全新设计，轻薄机身仅 6.9mm」' },
  { id: 'h2', title: '教育课程介绍视频', copywriting: '在线教育平台推广，突出名师授课和个性化学习...', status: 'completed' as const, time: '2026-06-12 09:15', duration: '12s', resolution: '720P', aspectRatio: '16:9', hasSound: true, resultId: 'result-copywriting-to-video', thumbnail: '/thumbnails/thumb-online-course.jpg', result: '分镜脚本\n\n【第1镜】开场（0-3秒）\n画面：校园全景，阳光洒在教学楼上\n旁白：「知识改变命运，教育成就未来」\n\n【第2镜】课程特色展示（3-7秒）\n画面：师生互动场景，多媒体教室\n旁白：「名师在线授课，个性化学习方案」' },
  { id: 'h3', title: '电商商品展示视频', copywriting: '商品特写展示，强调品质工艺和使用场景...', status: 'completed' as const, time: '2026-06-10 16:00', duration: '8s', resolution: '1080P', aspectRatio: '1:1', hasSound: false, resultId: 'result-copywriting-to-video', thumbnail: '/thumbnails/thumb-smartwatch.jpg', result: '分镜脚本\n\n【第1镜】开场（0-2秒）\n画面：商品特写，缓慢旋转展示\n旁白：「品质生活，从细节开始」\n\n【第2镜】功能展示（2-5秒）\n画面：使用场景演示，多角度切换\n旁白：「匠心工艺，每一个细节都经过精心打磨」' },
]

export function CopywritingToVideoExperience({ agent, onBack, onViewResult }: CopywritingToVideoExperienceProps) {
  const [copywriting, setCopywriting] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultScript, setResultScript] = useState('')
  const [resultVideoTitle, setResultVideoTitle] = useState('')

  const [resolution, setResolution] = useState('1080P')
  const [videoDuration, setVideoDuration] = useState(10)
  const [promptOptimize, setPromptOptimize] = useState(true)

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  // 分镜脚本编辑
  const [isEditingScript, setIsEditingScript] = useState(false)
  const [scriptEditText, setScriptEditText] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (copywriting && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [copywriting])

  const resultRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (resultScript && resultRef.current) { setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) }
  }, [resultScript])

  function handleGenerate() {
    if (!copywriting.trim()) { toast.error('请先输入视频文案'); return }
    if (isProcessing) { return }
    setIsProcessing(true)
    setProgress(0)
    setResultScript('')
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
    setResultVideoTitle('产品宣传视频')
    setResultScript('分镜脚本\n\n【第1镜】开场（0-3秒）\n画面：黑色背景渐亮，产品 Logo 缓缓浮现，光效粒子环绕\n旁白：「创新科技，触手可及」\n\n【第2镜】产品外观展示（3-7秒）\n画面：产品 360 度旋转展示，白色极简背景，柔和灯光\n旁白：「全新设计，轻薄机身仅 6.9mm，采用航空级铝合金材质」\n\n【第3镜】核心功能演示（7-12秒）\n画面：分屏展示智能手表健康监测、运动识别功能，动态数据可视化\n旁白：「全天候健康监测，精准运动识别，让每一刻都被记录」\n\n【第4镜】使用场景（12-18秒）\n画面：都市白领佩戴手表通勤、会议、运动的快切镜头\n旁白：「从办公室到健身房，无缝切换你的生活节奏」\n\n【第5镜】结尾（18-22秒）\n画面：产品特写 + 品牌 Slogan + 购买引导信息\n旁白：「XX 智能手表，定义你的智能生活」\n字幕：限时优惠 ¥1299 | 官方商城有售')
    toast.success('视频生成完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }
  function handleCopy(text: string) { navigator.clipboard.writeText(text); toast.success('已复制到剪贴板') }

  // 导出分镜脚本
  function handleExportScript() { toast.success('已导出分镜脚本文件') }

  // 进入编辑
  function startEditScript() {
    setScriptEditText(resultScript)
    setIsEditingScript(true)
  }
  function saveEditScript() {
    setResultScript(scriptEditText)
    setIsEditingScript(false)
    toast.success('已保存')
  }

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
              <VideoCamera className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI 文案生视频</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentCopywritingToVideoIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">输入视频文案内容，AI 自动生成分镜脚本并合成视频画面。支持多种画面比例和清晰度选择，让文字创意快速变为生动视频。</p>
              <small className="text-[14px] text-[#9ca3b8]">{getCostText(promptOptimize)}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-copywriting-to-video.jpg" alt="AI文案生视频封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 文案输入卡片 | 生成设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-stretch">

          {/* 文案输入区卡片 */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1 relative">
                <Textarea value={copywriting} onChange={e => setCopywriting(e.target.value)} placeholder="输入文案内容，AI 自动生成分镜脚本和视频画面…" className="min-h-[280px] h-full resize-none rounded-[12px] border border-[#e7ebf5] shadow-none bg-[#F8FAFF] focus-visible:ring-0 text-[13px] leading-7 placeholder:text-[#3f4558]/35" />
                <span className="absolute bottom-3 right-3 text-[11px] font-medium tabular-nums tracking-tight text-[#3f4558]/40">{copywriting.length}/5000</span>
              </div>
              <p className="flex items-center gap-1.5 mt-3 text-[12px] text-muted-foreground/70 shrink-0"><WarningCircle className="h-3 w-3 shrink-0" />请确保文案内容合法合规，不包含侵权或违规信息。</p>
            </div>
          </div>

          {/* 生成设置卡片 + 立即生成按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">生成设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">清晰度</span>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-[12px] border-[#E5E9F6]" style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}><SelectItem value="540P">540P</SelectItem><SelectItem value="720P">720P</SelectItem><SelectItem value="1080P">1080P</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">提示词优化</span><Switch checked={promptOptimize} onCheckedChange={setPromptOptimize} /></div>
                <div className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm text-[#3f4558]">视频时长</span></div>
                  <div className="flex items-center gap-3">
                    <input type="range" min={3} max={15} step={1} value={videoDuration} onChange={e => setVideoDuration(parseInt(e.target.value))} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #4f55ec ${((videoDuration - 3) / 12) * 100}%, #e7ebf5 ${((videoDuration - 3) / 12) * 100}%)`, WebkitAppearance: 'none' }} />
                    <span className="inline-flex items-center justify-center min-w-[36px] h-5 px-1.5 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md tabular-nums shrink-0">{videoDuration}秒</span>
                  </div>
                </div>
              </div>
              {copywriting.trim() && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在生成...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />立即生成</span>)}
                  </Button>
                  <p className="text-[11px] text-[#b7becf] mt-3">{getCostText(promptOptimize)}</p>
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
        {resultScript && !isProcessing && (
          <div className="rounded-[18px] border border-[#f0f2f8] overflow-hidden" style={{ ...CARD_SHADOW, background: 'rgba(255,255,255,0.96)' }} ref={resultRef}>
            <div className="px-6 pt-6 pb-2" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)' }}>
              <div className="flex items-center justify-between"><h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3><span className="text-xs text-[#8a91a6]">消耗 {getCostPoints(promptOptimize)} 智点</span></div>
            </div>
            <div className="p-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-stretch">
                {/* 左侧：视频预览 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden flex-1">
                    <div className="h-full bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                          <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                        </div>
                        <p className="text-sm font-medium text-[#3f4558]">{resultVideoTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{videoDuration}s · {resolution}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
                {/* 右侧：分镜脚本 */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频文案</h4>
                  {isEditingScript ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <textarea value={scriptEditText} onChange={e => setScriptEditText(e.target.value)} className="w-full rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 text-sm text-foreground leading-relaxed font-sans flex-1 resize-none outline-none focus:border-primary/50" />
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-[46px] rounded-[10px] text-[15px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white px-6" style={{ boxShadow: '0px 8px 16px rgba(87,92,233,0.14)' }} onClick={saveEditScript}>保存</Button>
                        <Button size="sm" variant="outline" className="h-[46px] rounded-[10px] text-[15px] px-6" onClick={() => setIsEditingScript(false)}>取消</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 flex-1 overflow-y-auto"><pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{promptOptimize ? resultScript : copywriting}</pre></div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={startEditScript}><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => handleCopy(promptOptimize ? resultScript : copywriting)}><Copy className="h-3.5 w-3.5" />复制</Button>
                        <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={handleExportScript}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                      </div>
                      <div className="mt-[7px] h-[16px]"></div>
                    </>
                  )}
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
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><VideoCamera className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">输入文案后，生成结果将显示在这里</p></div></div>
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
                  <div className="w-[180px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">视频文案</span>
                    <span className="text-sm text-[#697185] truncate block">{item.copywriting}</span>
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
            <div className="bg-white rounded-[16px] shadow-2xl max-w-[900px] w-full mx-4 max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* 标题区域 - 带渐变背景 */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}>
                <div className="flex items-center gap-3">
                  <h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3>
                  <span className="text-xs text-[#8a91a6]">消耗 {getCostPoints(promptOptimize)} 智点</span>
                </div>
                <button onClick={() => setSelectedHistoryItem(null)} className="text-[#8a91a6] hover:text-[#3f4558] transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {/* 内容区域 */}
              <div className="p-6 overflow-y-auto max-h-[65vh]">
                <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-stretch">
                  {/* 左侧：视频预览 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频预览</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] overflow-hidden flex-1">
                      <div className="h-full bg-gradient-to-br from-[#eef1ff] to-[#f8faff] flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 16px rgba(79,85,236,0.12)' }}>
                            <Play className="h-7 w-7 text-[#4f55ec] ml-1" weight="fill" />
                          </div>
                          <p className="text-sm font-medium text-[#3f4558]">{selectedHistoryItem.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{selectedHistoryItem.duration} · {selectedHistoryItem.resolution}</p>
                        </div>
                      </div>
                    </div>
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('下载完成')}><ArrowLineDown className="h-3.5 w-3.5" />下载视频</Button>
                    </div>
                  </div>
                  {/* 右侧：分镜脚本 */}
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">视频文案</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 flex-1 overflow-y-auto">
                      <pre className="text-sm text-[#3f4558] leading-relaxed whitespace-pre-wrap font-sans">{selectedHistoryItem.result}</pre>
                    </div>
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5"><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => { navigator.clipboard.writeText(selectedHistoryItem.result); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('已导出 TXT 文件')}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                    </div>
                  </div>
                </div>
                {/* 文件信息 - 靠在一起 */}
                <div className="mt-4 flex items-center gap-4 text-xs text-[#8a91a6]">
                  <span>文案：{selectedHistoryItem.copywriting}</span>
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
    </>
  )
}
