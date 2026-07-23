'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Agent } from '@/lib/mock-data'
import { AgentCopywritingIntro } from '@/components/agent/agent-copywriting-intro'
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
  MagicWand, CaretLeft, PencilSimple, FileText, ArrowLineDown,
  Lightbulb, VideoCamera, X,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS = 15
const COST_PRICE = 0.015
const COST_TEXT = `使用费用：${COST_POINTS} 智点/次（约 ${COST_PRICE} 元）`

interface CopywritingExperienceProps {
  agent: Agent
  onBack: () => void
  onViewResult?: (resultId: string, fileName?: string) => void
  onNavigateToAgent?: (agentId: string, params?: Record<string, string>) => void
}

// ============================================================
// Language options
// ============================================================

const languageOptions = [
  { value: 'auto', label: '自动检测' },
  { value: 'zh', label: '简体中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
]

// ============================================================
// Example topic tags
// ============================================================

const exampleTopics = [
  '新品智能耳机发布',
  '夏季防晒霜推广',
  '周末亲子露营攻略',
  '春季穿搭灵感',
  'AI 技术科普',
]

// ============================================================
// Recommended keywords
// ============================================================

const recommendedKeywords = [
  '产品亮点', '用户痛点', '场景化描述', '行动号召', '限时优惠',
  '品牌故事', '使用教程', '对比评测', '用户证言', '创意开头',
]

// ============================================================
// Mock History
// ============================================================

const mockHistory = [
  { id: 'h1', title: '新品智能耳机发布脚本', status: 'completed' as const, time: '2026-06-15 14:30', result: '【开场】你是否厌倦了嘈杂的通勤路上，无法享受一刻宁静？全新 SoundPro X1 智能降噪耳机，为你重新定义聆听体验……', resultId: 'result-topic-to-copywriting' },
  { id: 'h2', title: '夏季防晒霜推广文案', status: 'completed' as const, time: '2026-06-12 09:15', result: '烈日当空，你的肌肤准备好了吗？SunShield 清透防晒乳 SPF50+，轻薄不油腻，12 小时持久防护……', resultId: 'result-topic-to-copywriting' },
  { id: 'h3', title: '周末亲子露营攻略脚本', status: 'completed' as const, time: '2026-06-10 16:00', result: '这个周末，带上孩子逃离城市的喧嚣！精选三大露营宝地，装备清单一键搞定，让亲子时光更惬意……', resultId: 'result-topic-to-copywriting' },
]

// ============================================================
// Helpers
// ============================================================

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return `今天 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// ============================================================
// Main Component
// ============================================================

export function CopywritingExperience({ agent, onBack, onViewResult, onNavigateToAgent }: CopywritingExperienceProps) {
  // Input state
  const [inputText, setInputText] = useState('')
  const [error, setError] = useState('')

  // Settings state
  const [language, setLanguage] = useState('auto')
  const [paragraphCount, setParagraphCount] = useState(5)
  const [customRequirements, setCustomRequirements] = useState('')

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultText, setResultText] = useState('')

  // History state
  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  // Custom requirements auto-resize
  const customRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = customRef.current
    if (!el) return
    el.style.height = 'auto'
    const lineHeight = 24
    const minHeight = lineHeight * 2
    const maxHeight = lineHeight * 6
    const newHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight)
    el.style.height = `${newHeight}px`
  }, [customRequirements])

  // Scroll refs
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (inputText && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [inputText])

  const resultRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (resultText && resultRef.current) { setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) }
  }, [resultText])

  // Handlers
  function handleTopicClick(topic: string) {
    setInputText(prev => prev ? `${prev}、${topic}` : topic)
  }

  function handleGenerate() {
    if (!inputText.trim()) { setError('请输入文案主题'); return }
    setError('')
    setIsProcessing(true)
    setProgress(0)
    setResultText('')
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
    setResultText(`【开场引入】
你是否也有这样的经历——每天通勤两小时，耳机里的音乐总是被地铁的轰鸣声淹没？今天，我要给大家介绍一款彻底改变我通勤体验的产品：SoundPro X1 智能降噪耳机。

【产品亮点】
SoundPro X1 搭载了全新一代自适应主动降噪芯片，能够实时感知环境噪音并智能调节降噪深度。无论是嘈杂的地铁车厢，还是繁忙的开放式办公室，它都能为你营造一片宁静的听觉空间。续航方面，单次充电即可享受长达 36 小时的连续播放，搭配充电盒更可延长至 120 小时。

【使用场景】
想象一下：清晨出门，戴上 SoundPro X1，地铁的嘈杂瞬间消失，取而代之的是你最爱的播客节目。到了公司，开启通透模式，不用摘下耳机就能和同事自然交流。午休时分，切换到音乐模式，让舒缓的旋律帮你放松身心。

【用户证言】
"用了两周，再也回不去了。"——来自资深通勤族小李的评价。在社交平台上，已有超过 5000 位用户分享了他们的 SoundPro X1 使用体验，好评率高达 97%。

【行动号召】
现在下单即享首发优惠价 599 元（原价 799 元），前 1000 名用户还将获赠定制耳机收纳包。限时三天，错过不再！点击链接，让 SoundPro X1 重新定义你的每一天。

【推荐关键词】
#产品亮点 #用户痛点 #核心功能 #使用场景 #行动号召`)
    toast.success('文案生成完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }
  function handleCopy(text: string) { navigator.clipboard.writeText(text); toast.success('已复制到剪贴板') }

  // Export
  function handleExportTxt() { toast.success('已导出 TXT 文件') }

  // Edit
  function startEdit() {
    setEditText(resultText)
    setIsEditing(true)
  }
  function saveEdit() {
    setResultText(editText)
    setIsEditing(false)
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
        style={{ background: 'rgba(255,255,255,0.96)', borderColor: '#e7ebf5' }}
      >
        <div className="flex items-center justify-between h-16 px-[34px] relative">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2.5">
              <PencilSimple className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI文案生成</span>
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
              <Star className="h-4 w-4" />收藏
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e7ebf5] bg-white text-[#596176] hover:bg-[#4f55ec]/[0.06] px-[14px] shadow-none"
            >
              <ShareNetwork className="h-4 w-4" />分享
            </Button>
          </div>
        </div>
      </header>

      {activeTab === 'intro' ? (
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentCopywritingIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">输入视频主题、产品名称或创意关键词，AI 即刻生成完整脚本。支持多语言输出、自定义段落数量和风格要求，让文案创作高效又精准。</p>
              <small className="text-[14px] text-[#9ca3b8]">{COST_TEXT}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-topic-to-copywriting.jpg" alt="AI 文案生成封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 输入卡片 | 生成设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-stretch">

          {/* 输入区卡片 */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">输入文案主题</h3>
              <div className="flex-1 relative flex flex-col">
                {/* 示例话题标签 */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  <Lightbulb className="h-4 w-4 text-amber-400/70 shrink-0" weight="fill" />
                  {exampleTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className="text-[12px] px-2.5 py-1 rounded-[6px] border border-[#e7ebf5] bg-white hover:border-[#4f55ec]/30 hover:text-[#4f55ec] transition-colors text-muted-foreground cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                {/* Textarea */}
                <div className="flex-1 relative h-[320px]">
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="输入视频主题、产品名称或创意关键词，AI 即刻生成完整脚本…"
                    maxLength={100}
                    className="w-full h-full rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 text-sm text-foreground leading-relaxed resize-none outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"
                  />
                  <span className={cn(
                    'absolute bottom-3 right-3 text-[11px] font-medium tabular-nums',
                    inputText.length > 4500 ? 'text-destructive/80' : 'text-muted-foreground/40'
                  )}>
                    {inputText.length}/100
                  </span>
                </div>
              </div>
              {error && (<div className="flex items-center gap-2 p-3 rounded-[10px] bg-destructive/10 text-destructive text-sm mt-3 shrink-0"><WarningCircle className="h-4 w-4 shrink-0" />{error}</div>)}
            </div>
          </div>

          {/* 生成设置卡片 + 立即生成按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">生成设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                {/* 语言选择 */}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm text-[#3f4558]">生成语言</span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}>
                      {languageOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 段落数量 */}
                <div className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#3f4558]">段落数量</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[paragraphCount]}
                      onValueChange={vals => setParagraphCount(vals[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="inline-flex items-center justify-center min-w-[36px] h-5 px-1.5 text-[11px] font-medium text-muted-foreground bg-muted/60 rounded-md tabular-nums shrink-0">{paragraphCount}段</span>
                  </div>
                </div>
                {/* 自定义要求 */}
                <div className="px-4 py-3.5">
                  <span className="text-sm text-[#3f4558] block mb-2">自定义要求</span>
                  <textarea
                    ref={customRef}
                    value={customRequirements}
                    onChange={e => setCustomRequirements(e.target.value)}
                    placeholder="例如：语气更轻松，适合小红书风格…"
                    rows={2}
                    className="w-full rounded-[10px] border border-[#e7ebf5] bg-[#F8FAFF] p-3 text-sm text-foreground leading-relaxed resize-none outline-none focus:border-primary/50 placeholder:text-muted-foreground/35 overflow-y-auto"
                  />
                </div>
              </div>
              {inputText.trim() && (
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
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在生成文案…</p>
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
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea value={editText} onChange={e => setEditText(e.target.value)} className="w-full rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 text-sm text-foreground leading-relaxed font-sans h-[500px] resize-none outline-none focus:border-primary/50" />
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="h-[46px] rounded-[10px] text-[15px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white px-6" style={{ boxShadow: '0px 8px 16px rgba(87,92,233,0.14)' }} onClick={saveEdit}>保存</Button>
                      <Button size="sm" variant="outline" className="h-[46px] rounded-[10px] text-[15px] px-6" onClick={() => setIsEditing(false)}>取消</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 min-h-[300px] overflow-y-auto">
                      <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{resultText}</pre>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={startEdit}><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => handleCopy(resultText)}><Copy className="h-3.5 w-3.5" />复制</Button>
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={handleExportTxt}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                      {/* 生成视频按钮 - 视觉强调 */}
                      <Button size="sm" className="h-[34px] px-4 rounded-[7px] text-sm bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white gap-1.5 ml-auto" style={{ boxShadow: '0px 4px 12px rgba(87,92,233,0.2)' }} onClick={() => {
                        if (onNavigateToAgent) {
                          onNavigateToAgent('copywriting-to-video', {
                            text: resultText,
                            source: 'copywriting'
                          })
                        } else {
                          toast.success('即将跳转到 AI 文案生视频')
                        }
                      }}><VideoCamera className="h-3.5 w-3.5" weight="fill" />生成视频</Button>
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground/80 mt-3 flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成文案，仅供参考，请勿用于违法违规用途。</p>
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
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><PencilSimple className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">输入文案主题后，生成结果将显示在这里</p></div></div>
          ) : (
            <div className="px-6 pb-6">
              <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
              {history.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                  <div className="w-[76px] h-[58px] rounded-[8px] bg-gradient-to-br from-[#eef1ff] to-[#f8faff] border border-[#e7ebf5] flex items-center justify-center shrink-0 overflow-hidden relative"><PencilSimple className="h-5 w-5 text-[#4f55ec]/50" weight="fill" /></div>
                  <div className="w-[180px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">文案主题</span>
                    <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                  </div>
                  <div className="w-[500px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">生成内容</span>
                    <span className="text-sm text-[#697185] truncate block">{item.result}</span>
                  </div>
                  <div className="w-[130px] shrink-0">
                    <span className="text-xs text-[#a0a7b8] block">创建时间</span>
                    <span className="text-xs text-[#697185]">{formatTime(item.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto shrink-0">
                    <Button variant="outline" size="sm" className="h-[34px] px-[14px] rounded-[8px] text-[13px] font-normal gap-1.5 border-[#e2e6f3] bg-white text-[#596176] hover:bg-[#f3f5ff] hover:border-[#dfe3ff] hover:text-[#596176] shadow-none" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item.result); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
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
                <div>
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">生成文案</h4>
                  <div className="rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 h-[450px] overflow-y-auto">
                    <pre className="text-sm text-[#3f4558] leading-relaxed whitespace-pre-wrap font-sans">{selectedHistoryItem.result}</pre>
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5"><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                    <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => { navigator.clipboard.writeText(selectedHistoryItem.result); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
                    <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('已导出 TXT 文件')}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                  </div>
                </div>
                {/* 文件信息 - 靠在一起 */}
                <div className="mt-4 flex items-center gap-4 text-xs text-[#8a91a6]">
                  <span>主题：{selectedHistoryItem.title}</span>
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
