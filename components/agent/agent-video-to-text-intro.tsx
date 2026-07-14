'use client'

import { useState } from 'react'
import {
  Lightning,
  GlobeHemisphereWest,
  ShieldCheck,
  CursorClick,
  UploadSimple,
  MagicWand,
  FileText,
  CaretDown,
  Users,
  GraduationCap,
  VideoCamera,
  ClipboardText,
  Camera,
  Scales,
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
        无需下载或安装程序，即可快速将视频转为精确文字稿。
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
    title: '上传视频',
    desc: '拖放MP4、MOV等常见格式的视频至上方输入框，即可开始使用。',
  },
  {
    icon: MagicWand,
    title: 'AI自动转写',
    desc: '系统全自动辨识语音，生成文字内容。',
  },
  {
    icon: FileText,
    title: '下载或复制',
    desc: '预览转写结果后，可直接下载或复制使用。',
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
  { icon: Lightning, title: '智能语音识别', desc: '基于深度学习的语音识别引擎，准确率达98%，支持多人对话场景' },
  { icon: GlobeHemisphereWest, title: '多语言转写', desc: '支持中、英、日、韩等20+种语言的自动识别与转写' },
  { icon: ShieldCheck, title: '说话人分离', desc: '自动区分不同发言人，生成带角色标注的结构化文字稿' },
  { icon: CursorClick, title: '一键导出', desc: '支持TXT、SRT字幕等多种格式导出，无缝对接剪辑工作流' },
]

function FeaturesSection() {
  return (
    <section className="mb-10">
      <h2 className="text-[18px] font-medium text-[#3f4558] mb-5">功能特性</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  { icon: Users, title: '会议纪要', desc: '上传会议录像，自动识别每位发言人，生成带时间戳的结构化会议纪要', bg: 'bg-gradient-to-br from-indigo-50 to-violet-50', iconColor: 'text-indigo-600', iconBg: 'bg-white/70' },
  { icon: GraduationCap, title: '课程笔记', desc: '将教学视频转为文字，自动提取知识点与重点，生成可搜索的学习笔记', bg: 'bg-gradient-to-br from-teal-50 to-cyan-50', iconColor: 'text-teal-600', iconBg: 'bg-white/70' },
  { icon: VideoCamera, title: '字幕生成', desc: '一键为视频生成精准字幕文件（SRT），支持多语言，大幅提升剪辑效率', bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50', iconColor: 'text-fuchsia-600', iconBg: 'bg-white/70' },
  { icon: ClipboardText, title: '采访整理', desc: '自动区分采访者与受访者，保留原始对话内容，快速输出采访文字稿', bg: 'bg-gradient-to-br from-rose-50 to-red-50', iconColor: 'text-rose-600', iconBg: 'bg-white/70' },
  { icon: Camera, title: '短视频文案', desc: '从Vlog、教程视频中提取口述文案，快速整理为图文内容或脚本素材', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', iconColor: 'text-amber-600', iconBg: 'bg-white/70' },
  { icon: Scales, title: '庭审记录', desc: '高精度转录庭审视频中的每一句发言，形成完整、可追溯的文字档案', bg: 'bg-gradient-to-br from-slate-100 to-gray-100', iconColor: 'text-slate-600', iconBg: 'bg-white/70' },
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
  {
    q: '视频转文字的准确率如何？',
    a: '我们的AI语音识别引擎对清晰音频的转写准确率达98%。实际效果受视频音质、背景噪音、说话人口音及专业术语等因素影响，建议上传音质较好的视频以获得最佳效果。',
  },
  {
    q: '支持哪些视频格式和语言？',
    a: '支持MP4、MOV、WebM、AVI、MKV等主流视频格式。语言方面支持中文、英语、日语、韩语、法语、德语、西班牙语等20+种语言的自动识别与转写。',
  },
  {
    q: '能自动区分不同的发言人吗？',
    a: '可以。开启"区分说话人"功能后，系统会自动识别并标注不同发言人的对话内容，生成带角色标签的结构化文字稿，非常适合会议和访谈场景。',
  },
  {
    q: '上传的视频数据安全吗？',
    a: '我们采用端到端加密传输，所有视频文件仅在转写过程中临时处理，完成后24小时内自动从服务器删除，绝不与第三方共享您的内容。',
  },
  {
    q: '转写结果可以导出为字幕文件吗？',
    a: '当然可以！除了纯文本（TXT）格式外，还支持导出为SRT字幕格式，包含精确的时间轴信息，可直接导入视频剪辑软件使用。',
  },
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

export function AgentVideoToTextIntro() {
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
