'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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
import { AgentSpeechToTextIntro } from '@/components/agent/agent-speech-to-text-intro'
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
  PlusCircle, FileAudio, Star,
  ShareNetwork, WarningCircle,
  CheckCircle, SpinnerGap, Calendar, Trash, Copy,
  Lightning, MagicWand, CaretLeft, Play, Pause,
  PencilSimple, FileText, Robot,
  MusicNote, VideoCamera, ArrowLineDown, X,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COST_POINTS_DEFAULT = 20
const COST_POINTS_SUMMARY = 30
const COST_PRICE_DEFAULT = 0.02
const COST_PRICE_SUMMARY = 0.03

interface SpeechToTextExperienceProps {
  agent: Agent
  onBack: () => void
  onViewResult?: (resultId: string, fileName?: string) => void
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const s = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]
}
function formatDuration(seconds: number) { const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60); return `${m}:${String(s).padStart(2, '0')}` }

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return `今天 ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const mockHistory = [
  { id: 'h1', title: 'meeting-recording.mp3', status: 'completed' as const, time: '2026-06-15 14:30', size: '12.3 MB', result: '会议讨论了 Q4 产品规划，确定了三个主要方向……', resultId: 'result-speech-to-text' },
  { id: 'h2', title: 'interview-zhang.mp3', status: 'completed' as const, time: '2026-06-12 09:15', size: '8.7 MB', result: '受访者张总介绍了公司数字化转型的三个阶段……', resultId: 'result-speech-to-text' },
  { id: 'h3', title: 'lecture-ai.mp3', status: 'completed' as const, time: '2026-06-10 16:00', size: '22.1 MB', result: '大家好，欢迎来到 AI 基础入门课程……', resultId: 'result-speech-to-text' },
]

export function SpeechToTextExperience({ agent, onBack, onViewResult }: SpeechToTextExperienceProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const [language, setLanguage] = useState('auto')
  const [summarize, setSummarize] = useState(true)

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultText, setResultText] = useState('')
  const [summaryText, setSummaryText] = useState('')

  const [history, setHistory] = useState(mockHistory)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<typeof history[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'experience'>('experience')

  // 音频播放
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(12) // 模拟 12 秒
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [audioDuration, setAudioDuration] = useState(0) // 模拟音频时长
  const audioTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // 转写编辑
  const [isEditingTranscript, setIsEditingTranscript] = useState(false)
  const [transcriptEditText, setTranscriptEditText] = useState('')

  // 智能总结
  const [summaryStarted, setSummaryStarted] = useState(false)

  // 切换生成内容摘要时重置总结状态
  useEffect(() => {
    setSummaryStarted(false)
  }, [summarize])

  function getFileExtension(name: string) { const last = name.lastIndexOf('.'); return last > -1 ? name.slice(last + 1).toUpperCase() : '' }
  function getFileType(ext: string) { const audio = ['MP3','WAV','M4A','AAC','FLAC']; return audio.includes(ext) ? '音频' : '视频' }

  const handleDrag = useCallback((e: React.DragEvent, active: boolean) => {
    e.preventDefault()
    setIsDragging(active)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSet(f)
  }, [])

  const handleFilePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) validateAndSet(f)
    e.target.value = ''
  }, [])

  function validateAndSet(f: File) {
    setError('')
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    const valid = ['.mp3', '.wav', '.m4a', '.aac', '.flac', '.mp4', '.mov', '.webm']
    if (!valid.includes(ext)) {
      setError(`不支持 ${ext} 格式，请上传 ${valid.join('、')}`)
      return
    }
    if (f.size > 500 * 1024 * 1024) {
      setError('文件大小不能超过 500MB')
      return
    }
    setFile(f)
    setError('')
    setResultText('')
    setSummaryText('')
    setLanguage('zh')
    setAudioDuration(Math.floor(Math.random() * 180) + 30) // 模拟 30-210 秒
    toast.success(`已选择：${f.name}`)
  }

  function handleRemove() {
    setFile(null)
    setResultText('')
    setError('')
    setProgress(0)
    setIsProcessing(false)
    setLanguage('auto')
    if (fileInput.current) fileInput.current.value = ''
  }

  function handleGenerate() {
    if (!file) { setError('请先上传音视频文件'); return }
    setError('')
    setIsProcessing(true)
    setProgress(0)
    setResultText('')
    setSummaryText('')
    setSummaryStarted(false)
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioTimer.current) { clearInterval(audioTimer.current); audioTimer.current = null }
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
    setResultText('会议纪要\n\n发言人1（14:00-14:05）：各位好，今天的会议主要讨论Q4产品规划。首先回顾一下我们Q3的整体表现，AI语音助手V1的市场占有率从15%提升到22%，这个成绩非常令人振奋。\n\n发言人2（14:06-14:12）：确实，企业级AI中台的客户续费率达到了91%，证明我们的产品是真正解决客户痛点的。我建议Q4重点发力海外市场，技术团队已经完成了多语言模型的预训练。\n\n发言人1（14:13-14:18）：同意。另一个方向是垂直行业深耕，特别是医疗和教育领域，我们已经积累了足够多的标杆案例，可以在这个基础上做产品化。\n\n发言人2（14:19-14:25）：关于算力方面，建议推进模型蒸馏和量化压缩，这样可以在有限的资源下覆盖更多客户。预计Q4完成内部测试版并向部分客户开放试点。\n\n📌 核心结论：\n1. Q4重点：海外市场拓展 + 垂直行业深耕\n2. 技术方向：多语言模型 + 模型蒸馏\n3. 里程碑：Q4向部分客户开放试点')
    setSummaryText('📊 会议智能总结\n\n本次会议为Q4产品规划讨论会，参会人员2人，时长约25分钟。\n\n🎯 核心议题\n• Q3成绩回顾：AI语音助手V1市占率从15%升至22%\n• 企业级AI中台客户续费率91%\n• Q4战略方向确定\n\n💡 关键决策\n1. Q4重点发力海外市场，多语言模型已完成预训练\n2. 垂直行业深耕：医疗 + 教育领域\n3. 推进模型蒸馏与量化压缩\n\n⏱️ 时间节点\n• Q4完成内部测试版\n• 向部分客户开放试点\n\n📈 预期目标\n• 海外市场首批上线3个语种\n• 教育行业签约至少5个标杆客户\n• 模型推理成本降低40%')
    setSummaryStarted(summarize)
    toast.success('转写完成！')
  }

  function handleDeleteHistory(id: string) { setDeleteConfirmId(id) }
  function confirmDelete() { if (deleteConfirmId) { setHistory(prev => prev.filter(h => h.id !== deleteConfirmId)); setDeleteConfirmId(null) } }
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
  function formatAudioTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    const ms = Math.floor((s % 1) * 100)
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(ms).padStart(2, '0')}`
  }
  function handleProgressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const wasPlaying = isPlaying
    if (audioTimer.current) { clearInterval(audioTimer.current); audioTimer.current = null }
    setIsPlaying(false)
    const t = parseFloat(e.target.value)
    setCurrentTime(t)
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
    if (isPlaying && audioTimer.current) {
      clearInterval(audioTimer.current)
      audioTimer.current = setInterval(() => {
        setCurrentTime(prev => {
          const n = prev + (100 * next / 1000)
          if (n >= duration) { clearInterval(audioTimer.current!); audioTimer.current = null; setIsPlaying(false); return duration }
          return n
        })
      }, 100)
    }
  }

  // 智能总结
  function handleStartSummary() { setSummaryStarted(true) }

  // 导出转写
  function handleExportTxt() { toast.success('已导出 TXT 文件') }

  // 进入编辑
  function startEditTranscript() {
    setTranscriptEditText(resultText)
    setIsEditingTranscript(true)
  }
  function saveEditTranscript() {
    setResultText(transcriptEditText)
    setIsEditingTranscript(false)
    toast.success('已保存')
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (file && scrollRef.current) { setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200) }
  }, [file])

  const resultRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (resultText && resultRef.current) { setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) }
  }, [resultText])

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
              <FileAudio className="h-6 w-6 text-[#4f55ec]" weight="fill" />
              <span className="text-[18px] font-medium text-[#3f4558]">AI语音转文字</span>
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
        <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16"><AgentSpeechToTextIntro /></div>
      ) : (
      <div className="max-w-[1440px] mx-auto px-[34px] pt-9 pb-16 flex flex-col gap-6">

        {/* CARD 1 — 使用指南 + 封面图 */}
        <div className="rounded-[16px] border border-[#e0e5ff]" style={{ background: '#fdfdff' }}>
          <div className="h-[230px] px-[26px] py-[22px] grid grid-cols-1 md:grid-cols-[0.74fr_1fr] gap-6 items-center">
            <div>
              <span className="text-[17px] font-normal text-[#3f4558] mb-2 inline-block">使用指南</span>
              <p className="text-[16px] text-muted-foreground leading-[1.7] mb-2.5">上传音频或视频文件，AI 自动识别语音并转写为高精度文字稿。支持多人对话区分、自动添加标点符号、生成内容摘要，让音频内容即时变文字。</p>
              <small className="text-[14px] text-[#9ca3b8]">使用费用：{summarize ? `${COST_POINTS_SUMMARY} 智点/次（约 ${COST_PRICE_SUMMARY} 元）` : `${COST_POINTS_DEFAULT} 智点/次（约 ${COST_PRICE_DEFAULT} 元）`}</small>
            </div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-full h-[180px] rounded-[18px] bg-white flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0px 16px 42px rgba(87,92,233,0.08)' }}
              >
                <img src="/covers/agent-speech-to-text.jpg" alt="AI语音转文字封面图" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2A + 2B — 上传卡片 | 生成设置卡片，等高 */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 items-stretch">

          {/* 上传区卡片 — 卡片白底，上传区域 #f8faff */}
          <div className="rounded-[12px] border border-[#f0f2f8] bg-white overflow-hidden" style={CARD_SHADOW}>
            <div className="p-6 h-full flex flex-col">
              {!file ? (
                <div onDragOver={e => handleDrag(e, true)} onDragLeave={e => handleDrag(e, false)} onDrop={handleDrop} onClick={() => fileInput.current?.click()} className={cn('flex-1 border-2 border-dashed rounded-[12px] py-10 px-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3', isDragging ? 'border-primary bg-primary/[0.04]' : 'border-[#e7ebf5] hover:border-primary/30')} style={{ background: '#f8faff' }}>
                  <PlusCircle className="text-[#4f55ec]" style={{ fontSize: '60px' }} />
                  <p className="text-[17px] text-[#3f4558]">点击或拖拽上传音视频文件</p>
                  <div className="flex flex-col items-center gap-1 text-[13px] text-muted-foreground"><span>支持 MP3、WAV、M4A、AAC、MP4、WebM</span><span>单文件不超过 500MB</span></div>
                  <input ref={fileInput} type="file" accept=".mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.webm" className="hidden" onChange={handleFilePick} />
                </div>
              ) : (
                (() => {
                  const ext = getFileExtension(file!.name)
                  const fType = getFileType(ext)
                  return (
                <div className="flex-1 rounded-[12px] border border-[#e7ebf5] p-5 flex flex-col items-center justify-center relative group cursor-pointer" onClick={() => fileInput.current?.click()} style={{ background: '#f8faff' }}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
                      {fType === '音频' ? (
                        <MusicNote className="h-7 w-7 text-sky-500" weight="fill" />
                      ) : (
                        <VideoCamera className="h-7 w-7 text-sky-500" weight="fill" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{file!.name}</p>
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-muted/60">
                        {fType === '音频' ? <MusicNote className="h-3 w-3" /> : <VideoCamera className="h-3 w-3" />}
                        {ext}
                      </span>
                      <span>{fType}</span>
                      <span>{formatSize(file!.size)}</span>
                      {audioDuration > 0 && <span>时长 {formatDuration(audioDuration)}</span>}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">重新上传</span>
                  </div>
                  <input ref={fileInput} type="file" accept=".mp3,.wav,.m4a,.aac,.flac,.mp4,.mov,.webm" className="hidden" onChange={handleFilePick} />
                </div>
                  )
                })()
              )}
              <p className="flex items-center gap-1.5 mt-3 text-[12px] text-muted-foreground/70 shrink-0"><WarningCircle className="h-3 w-3 shrink-0" />上传即表示您确认拥有该文件的合法授权，并承诺不用于违法违规用途。</p>
              {error && (<div className="flex items-center gap-2 p-3 rounded-[10px] bg-destructive/10 text-destructive text-sm mt-2 shrink-0"><WarningCircle className="h-4 w-4 shrink-0" />{error}</div>)}
            </div>
          </div>

          {/* 生成设置卡片 + 立即生成按钮 */}
          <div className="rounded-[16px] border border-[#f0f2f8] bg-white overflow-hidden" ref={scrollRef}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-[18px] font-medium text-[#3f4558] mb-3 shrink-0">生成设置</h3>
              <div className="rounded-[14px] border border-[#e7ebf5] bg-muted/20 divide-y divide-[#e7ebf5] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5"><span className="text-sm text-[#3f4558]">识别语言</span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[140px] h-9 rounded-[11px] border-[#e7ebf5] text-sm hover:bg-[#4f55ec]/[0.04] focus:ring-2 focus:ring-[#4f55ec]/20 focus:border-[#4f55ec]/40 shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent style={{ boxShadow: 'rgba(43,49,78,0.11) 0px 18px 38px 0px' }}><SelectItem value="zh">中文</SelectItem><SelectItem value="en">英语</SelectItem><SelectItem value="ja">日语</SelectItem><SelectItem value="auto">智能识别</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5"><div><span className="text-sm text-[#3f4558]">生成内容摘要</span><p className="text-[11px] text-muted-foreground mt-0.5">自动提炼核心观点和待办事项</p></div><Switch checked={summarize} onCheckedChange={setSummarize} /></div>
              </div>
              {file && (
                <div className="flex flex-col items-center pt-4 mt-auto shrink-0">
                  <Button onClick={handleGenerate} disabled={isProcessing} className="h-[46px] px-12 rounded-[10px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white font-medium text-[15px] min-w-[200px]" style={{ boxShadow: '0px 12px 28px rgba(87,92,233,0.22)' }}>
                    {isProcessing ? (<span className="flex items-center gap-2"><SpinnerGap className="h-4 w-4 animate-spin" />正在生成...</span>) : (<span className="flex items-center gap-2"><MagicWand className="h-4 w-4" weight="fill" />立即生成</span>)}
                  </Button>
                  <p className="text-[11px] text-[#b7becf] mt-3">使用费用：{summarize ? `${COST_POINTS_SUMMARY} 智点/次（约 ${COST_PRICE_SUMMARY} 元）` : `${COST_POINTS_DEFAULT} 智点/次（约 ${COST_PRICE_DEFAULT} 元）`}</p>
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
                <p className="text-[15px] font-medium text-foreground mb-1.5">AI 正在转写中…</p>
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
              <div className="flex items-center justify-between"><h3 className="text-[18px] font-medium text-[#3f4558]">生成结果</h3><span className="text-xs text-[#8a91a6]">消耗 {summarize ? COST_POINTS_SUMMARY : COST_POINTS_DEFAULT} 智点</span></div>
            </div>
            <div className="p-6 pt-4">
              <div className={`grid grid-cols-1 ${summarize ? 'md:grid-cols-[3fr_2fr]' : ''} gap-6`}>
                {/* 左侧：转写内容 */}
                <div>
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">转写内容</h4>
                  {isEditingTranscript ? (
                    <div className="space-y-3">
                      <textarea value={transcriptEditText} onChange={e => setTranscriptEditText(e.target.value)} className="w-full rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 text-sm text-foreground leading-relaxed font-sans h-[600px] resize-none outline-none focus:border-primary/50" />
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-[46px] rounded-[10px] text-[15px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white px-6" style={{ boxShadow: '0px 8px 16px rgba(87,92,233,0.14)' }} onClick={saveEditTranscript}>保存</Button>
                        <Button size="sm" variant="outline" className="h-[46px] rounded-[10px] text-[15px] px-6" onClick={() => setIsEditingTranscript(false)}>取消</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 h-[600px] overflow-y-auto"><pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{resultText}</pre></div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={startEditTranscript}><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => handleCopy(resultText)}><Copy className="h-3.5 w-3.5" />复制</Button>
                        <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={handleExportTxt}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                      </div>
                    </>
                  )}
                  {/* 音频播放器 */}
                  <div className="mt-4 rounded-[8px] border border-[#e7ebf5] bg-[#f8faff] px-3 py-2 flex items-center gap-3 h-10">
                    <button onClick={togglePlay} className="w-6 h-6 rounded-full bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white flex items-center justify-center shrink-0 transition-colors">
                      {isPlaying ? <Pause className="h-3 w-3" weight="fill" /> : <Play className="h-3 w-3 ml-0.5" weight="fill" />}
                    </button>
                    <div className="flex-1 relative">
                      <input type="range" min={0} max={duration} step={0.01} value={currentTime} onChange={handleProgressChange} className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #4f55ec ${(currentTime/duration)*100}%, #e7ebf5 ${(currentTime/duration)*100}%)`, WebkitAppearance: 'none' }} />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 w-[112px] text-right">{formatAudioTime(currentTime)}/{formatAudioTime(duration)}</span>
                    <button onClick={changePlaybackRate} className="h-7 px-2.5 rounded-[6px] border border-[#e7ebf5] bg-white text-xs text-foreground hover:bg-[#f8faff] shrink-0 transition-colors">{playbackRate.toFixed(1)}x</button>
                  </div>
                  <p className="text-xs text-muted-foreground/80 mt-[7px] flex items-center gap-1"><WarningCircle className="h-3 w-3" />AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                </div>
                {/* 右侧：智能总结 */}
                {summarize && (
                <div>
                  <h4 className="text-sm font-medium text-[#3f4558] mb-3">智能总结</h4>
                  {!summaryStarted ? (
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-10 text-center flex flex-col items-center justify-center h-[600px]">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Robot className="h-7 w-7 text-primary" /></div>
                      <p className="text-sm font-medium text-foreground mb-1.5">转写完成后，一键生成智能总结</p>
                      <p className="text-xs text-muted-foreground mb-6">支持要点提取、待办生成、会议纪要等多种总结模式</p>
                      <Button size="sm" className="h-[46px] px-6 rounded-[10px] text-[15px] bg-[#4f55ec] hover:bg-[#4f55ec]/80 text-white" style={{ boxShadow: '0px 8px 16px rgba(87,92,233,0.14)' }} onClick={handleStartSummary}>开始总结</Button>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-[12px] border border-[#e7ebf5] bg-[#f8faff] p-5 h-[600px] overflow-y-auto"><pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{summaryText}</pre></div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => handleCopy(summaryText)}><Copy className="h-3.5 w-3.5" />复制</Button>
                      </div>
                    </>
                  )}
                </div>
                )}
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
            <div className="px-6 pb-6"><div className="rounded-[12px] bg-white p-10 text-center"><FileAudio className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" /><p className="text-[18px] text-foreground mb-1.5">暂无生成记录</p><p className="text-sm text-muted-foreground">上传文件后，生成结果将显示在这里</p></div></div>
          ) : (
            <div className="px-6 pb-6">
              <div className="rounded-[14px] border border-[#e7ebf5] divide-y divide-[#e7ebf5] overflow-hidden [&>*:last-child]:border-b-0">
              {history.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-4 hover:bg-[#fbfcff] transition-colors bg-white cursor-pointer" onClick={() => setSelectedHistoryItem(item)}>
                  <div className="w-[76px] h-[58px] rounded-[8px] bg-gradient-to-br from-[#f3f0ff] to-[#f8faff] border border-[#e7ebf5] flex items-center justify-center shrink-0 overflow-hidden relative"><FileAudio className="h-5 w-5 text-[#7c3aed]/50" weight="fill" /></div>
                  <div className="w-[180px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">文件名称</span>
                    <span className="text-sm text-[#697185] truncate block">{item.title}</span>
                  </div>
                  <div className="w-[500px] shrink-0 min-w-0">
                    <span className="text-xs text-[#a0a7b8] block">转写内容</span>
                    <span className="text-sm text-[#697185] truncate block">{item.result}</span>
                  </div>
                  <div className="w-[130px] shrink-0">
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
                  <span className="text-xs text-[#8a91a6]">消耗 {summarize ? COST_POINTS_SUMMARY : COST_POINTS_DEFAULT} 智点</span>
                </div>
                <button onClick={() => setSelectedHistoryItem(null)} className="text-[#8a91a6] hover:text-[#3f4558] transition-colors"><X className="h-5 w-5" /></button>
              </div>
              {/* 内容区域 */}
              <div className="p-6 overflow-y-auto max-h-[65vh]">
                <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
                  {/* 左侧：转写内容 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">转写内容</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 h-[350px] overflow-y-auto">
                      <pre className="text-sm text-[#3f4558] leading-relaxed whitespace-pre-wrap font-sans">{selectedHistoryItem.result}</pre>
                    </div>
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5"><PencilSimple className="h-3.5 w-3.5" />编辑</Button>
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => { navigator.clipboard.writeText(selectedHistoryItem.result); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
                      <Button variant="outline" size="sm" className="h-[34px] px-3 rounded-[8px] text-[13px] gap-1.5 border-[#e2e6f3] text-[#596176] bg-white hover:bg-[#4f55ec]/[0.06] shadow-none" onClick={() => toast.success('已导出 TXT 文件')}><FileText className="h-3.5 w-3.5" />导出 TXT</Button>
                    </div>
                  </div>
                  {/* 右侧：智能总结 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#3f4558] mb-3">智能总结</h4>
                    <div className="rounded-[12px] border border-[#e7ebf5] bg-[#F8FAFF] p-5 h-[350px] overflow-y-auto">
                      <pre className="text-sm text-[#3f4558] leading-relaxed whitespace-pre-wrap font-sans">{summaryText}</pre>
                    </div>
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="ghost" size="sm" className="h-[34px] px-3 rounded-[7px] text-sm text-muted-foreground hover:text-foreground gap-1.5" onClick={() => { navigator.clipboard.writeText(summaryText); toast.success('已复制到剪贴板'); }}><Copy className="h-3.5 w-3.5" />复制</Button>
                    </div>
                  </div>
                </div>
                {/* 文件信息 - 靠在一起 */}
                <div className="mt-4 flex items-center gap-4 text-xs text-[#8a91a6]">
                  <span>文件：{selectedHistoryItem.title}</span>
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
