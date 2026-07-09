'use client'

import { useState } from 'react'
import {
  Microphone,
  Lightning,
  Users,
  Sparkle,
  GlobeHemisphereWest,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  VideoCamera,
  Phone,
  ClipboardText,
  Scales,
  UploadSimple,
  MagicWand,
  FileText,
  CaretDown,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const CARD_SHADOW: React.CSSProperties = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' }

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-[20px] font-medium text-[#3f4558] mb-2">场景介绍</h1>
      <p className="text-sm text-[#8a91a6] leading-relaxed max-w-xl">
        上传音视频，AI自动转写为文字，支持自动区分发言人、智能摘要提炼。
      </p>
    </div>
  )
}

// ============================================================
// Steps
// ============================================================

const steps = [
  {
    icon: UploadSimple,
    title: '上传音视频',
    desc: '点击上传或拖拽文件上传，支持MP3、MP4、WAV等格式。',
  },
  {
    icon: MagicWand,
    title: 'AI转写提炼',
    desc: 'AI高精度识别转文字，自动区分说话人，智能提炼要点。',
  },
  {
    icon: FileText,
    title: '校对导出',
    desc: '内容可在线编辑调整，一键复制导出文本，即转即用。',
  },
]

function StepsSection() {
  return (
    <section className="mb-10">
      <h2 className="text-[18px] font-medium text-[#3f4558] mb-6">使用流程</h2>
      <div className="relative flex flex-col md:flex-row md:items-start gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <div key={index} className="relative flex md:flex-1 md:flex-col items-start md:items-center">
              {!isLast && (
                <div className="hidden md:block absolute top-[18px] left-[calc(50%+22px)] w-[calc(100%-44px)] h-[2px] bg-[#e7ebf5]" />
              )}
              {!isLast && (
                <div className="md:hidden absolute left-[18px] top-[44px] w-[2px] h-[calc(100%-36px)] bg-[#e7ebf5]" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#4f55ec] text-white flex items-center justify-center text-xs font-medium">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 w-9 h-9 rounded-[10px] bg-[#4f55ec]/[0.08] border border-[#4f55ec]/20 flex items-center justify-center">
                  <Icon className="h-[22px] w-[22px] text-[#4f55ec]" />
                </div>
              </div>
              <div className="ml-4 md:ml-0 md:mt-3 md:text-center md:px-2 pb-6 md:pb-0 flex-1">
                <h3 className="text-sm font-medium text-[#3f4558] mb-1">{step.title}</h3>
                <p className="text-[13px] text-[#8a91a6] leading-relaxed max-w-[220px] md:mx-auto">{step.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================
// Features
// ============================================================

const features = [
  { icon: Microphone, title: '高精度识别', desc: '针对专业术语、口音差异深度优化，准确率高达98%' },
  { icon: Lightning, title: '高速转写引擎', desc: '领先的AI加速技术，转写速度比播放快10倍，大幅节省等待时间' },
  { icon: Users, title: '智能区分说话人', desc: '自动识别并标注不同发言人，避免内容混淆' },
  { icon: Sparkle, title: '智能摘要', desc: '自动提炼核心结论与待办' },
  { icon: GlobeHemisphereWest, title: '20+语言支持', desc: '覆盖主流语种及常用方言，满足全球化场景' },
  { icon: ShieldCheck, title: '端到端加密', desc: '全程加密传输与存储，数据主权由用户掌控' },
]

function FeaturesSection() {
  return (
    <section className="mb-10">
      <h2 className="text-[18px] font-medium text-[#3f4558] mb-5">功能特性</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="rounded-[16px] bg-white p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(38,44,72,0.06)]"
              style={CARD_SHADOW}
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#4f55ec]/[0.08] border border-[#4f55ec]/10 flex items-center justify-center shrink-0">
                <Icon className="h-[22px] w-[22px] text-[#4f55ec]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-[#3f4558] mb-1">{item.title}</h3>
                <p className="text-[13px] text-[#8a91a6] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================
// Scenarios
// ============================================================

const scenarios = [
  { icon: Briefcase, title: '会议纪要', desc: '自动区分发言人，生成结构化纪要，一键提取待办事项与决议', bg: 'bg-gradient-to-br from-indigo-50 to-violet-50', iconColor: 'text-indigo-600', iconBg: 'bg-white/70' },
  { icon: GraduationCap, title: '课程笔记', desc: '完整捕捉知识点，智能识别重点与难点，生成结构化课堂笔记', bg: 'bg-gradient-to-br from-teal-50 to-cyan-50', iconColor: 'text-teal-600', iconBg: 'bg-white/70' },
  { icon: VideoCamera, title: '视频文案提取', desc: '一键提取视频文案，解析爆款结构，快速生成仿写内容', bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50', iconColor: 'text-fuchsia-600', iconBg: 'bg-white/70' },
  { icon: Phone, title: '销售复盘', desc: '记录客户沟通细节，分析需求痛点，自动生成拜访报告', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', iconColor: 'text-amber-600', iconBg: 'bg-white/70' },
  { icon: ClipboardText, title: '访谈转录', desc: '智能标识不同受访对象，保留原始语料价值，支撑定性研究', bg: 'bg-gradient-to-br from-rose-50 to-red-50', iconColor: 'text-rose-600', iconBg: 'bg-white/70' },
  { icon: Scales, title: '法律取证', desc: '高精度转录每个对话细节，形成具有法律效力的文字凭证', bg: 'bg-gradient-to-br from-slate-100 to-gray-100', iconColor: 'text-slate-600', iconBg: 'bg-white/70' },
]

function ScenariosSection() {
  return (
    <section className="mb-10">
      <h2 className="text-[18px] font-medium text-[#3f4558] mb-5">适用场景</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className={cn('rounded-[16px] p-4 transition-all duration-200', item.bg)}
              style={CARD_SHADOW}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn('w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0', item.iconBg)}>
                  <Icon className={cn('h-[22px] w-[22px]', item.iconColor)} />
                </div>
                <h3 className="text-sm font-medium text-[#3f4558]">{item.title}</h3>
              </div>
              <p className="text-[13px] text-[#8a91a6] leading-relaxed pl-[52px]">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================
// FAQ
// ============================================================

const faqs = [
  { q: '如何使用？', a: '上传音视频文件或选择实时录音，AI自动识别并生成文字稿与智能总结，支持在线编辑、复制和导出。' },
  { q: '准确率如何？', a: '采用领先的AI识别引擎，普通话和常见方言场景下准确率达98%，满足会议记录等专业需求。' },
  { q: '支持哪些格式？', a: '支持MP4、MP3、WAV、M4A等19种主流音视频格式，覆盖绝大多数转写需求。' },
  { q: '能否区分说话人？', a: '具备自动声纹识别功能，可智能区分不同发言人并标注，支持手动修改人物名称。' },
  { q: '数据安全吗？', a: '采用端到端加密存储，符合国际合规标准，所有文件仅用于转写处理，绝不外泄。' },
  { q: '支持多语种吗？', a: '支持中文、英语、日语、韩语、法语、德语、西班牙语等20+种主流语言，满足全球化场景需求。' },
]

function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section>
      <h2 className="text-[18px] font-medium text-[#3f4558] mb-4">常见问题</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = expandedIndex === index
          return (
            <div
              key={index}
              className="rounded-[14px] bg-white overflow-hidden"
              style={CARD_SHADOW}
            >
              <button
                onClick={() => setExpandedIndex(isOpen ? null : index)}
                className="w-full flex items-center gap-2.5 px-4 py-[14px] text-left"
              >
                <CaretDown className={cn(
                  'h-5 w-5 text-[#8a91a6] shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} />
                <span className="flex-1 text-sm font-medium text-[#3f4558]">{faq.q}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pl-[34px]">
                  <p className="text-[13px] text-[#8a91a6] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================
// Main Component
// ============================================================

export function AgentSpeechToTextIntro() {
  return (
    <div>
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <ScenariosSection />
      <FAQSection />
    </div>
  )
}