'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  Wand2,
  FileText,
  Target,
  Zap,
  Languages,
  Palette,
  Clock,
  Video,
  GraduationCap,
  Clapperboard,
  Accessibility,
  Briefcase,
  Scale,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        AI字幕生成
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        自动生成字幕，支持翻译为20+种语言。让视频内容更易懂，吸引全球观众。
      </p>
    </div>
  )
}

// ============================================================
// Steps
// ============================================================

const steps = [
  {
    icon: Upload,
    title: '上传文件',
    desc: '拖拽或点击上传音视频文件，支持MP4、MOV、MP3等主流格式。',
  },
  {
    icon: Wand2,
    title: '生成字幕',
    desc: 'AI自动识别20+种语言，实现精准字幕生成，支持一键字幕翻译。',
  },
  {
    icon: FileText,
    title: '编辑和下载',
    desc: '内置字幕编辑器调整样式，支持导出视频和SRT字幕文件。',
  },
]

function StepsSection() {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-foreground mb-5">使用流程</h2>
      <div className="relative flex flex-col md:flex-row md:items-start gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <div key={index} className="relative flex md:flex-1 md:flex-col items-start md:items-center">
              {!isLast && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2px] bg-gradient-to-r from-primary/40 to-primary/10" />
              )}
              {!isLast && (
                <div className="md:hidden absolute left-5 top-12 w-[2px] h-[calc(100%-32px)] bg-gradient-to-b from-primary/40 to-primary/10" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm shadow-primary/25">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="ml-4 md:ml-0 md:mt-3 md:text-center md:px-2 pb-6 md:pb-0 flex-1">
                <h3 className="text-sm font-bold text-foreground mb-1 tracking-wide">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed tracking-wide max-w-[220px] md:mx-auto">{step.desc}</p>
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
  {
    icon: Target,
    title: '高准确度',
    desc: '精准识别视频或音频文件中的语音，即使是复杂音视频也能快速捕捉每一个词。',
  },
  {
    icon: Zap,
    title: 'AI快速上字幕',
    desc: '告别繁琐的人工处理，极速完成字幕生成，为视频制作者节省大量时间。',
  },
  {
    icon: Languages,
    title: '一键翻译字幕',
    desc: '内置AI字幕翻译功能，可立即将字幕翻译成20+种语言，轻松服务全球观众。',
  },
  {
    icon: Palette,
    title: '字幕样式随心选',
    desc: '支持自定义字体、颜色、大小和位置，让字幕更符合品牌风格，保证美观与专业。',
  },
  {
    icon: Clock,
    title: '在线编辑字幕样式',
    desc: '支持在线修改字幕样式，字体大小颜色随心调整，无需导出到第三方软件。',
  },
]

function FeaturesSection() {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-foreground mb-4">功能特性</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <Card
              key={index}
              className="group p-0 bg-white dark:bg-card border-border/40 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground mb-1 tracking-wide">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
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
  {
    icon: Video,
    title: '短视频制作',
    desc: '一键生成精准字幕，让视频在社交平台无声播放时依然吸睛，提升传播效果。',
    bg: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: GraduationCap,
    title: '在线课程制作',
    desc: '为教学视频快速加上字幕，帮助学生更好理解内容，也便于二次整理课件。',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Clapperboard,
    title: '影视后期制作',
    desc: '支持多语言字幕输出，方便影视作品出海发行或在多语环境中使用。',
    bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Accessibility,
    title: '无障碍观看',
    desc: '为听障人士和静音观看场景提供清晰字幕，打造更包容的观看体验。',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Briefcase,
    title: '企业内部使用',
    desc: '将会议、培训等音视频内容快速转写为字幕和文本，助力知识沉淀与高效沟通。',
    bg: 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Scale,
    title: '专业辅助场景',
    desc: '适用于法律庭审、医学病例分析等专业场景，为视频资料添加准确字幕，便于存档与研究。',
    bg: 'bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/30',
    iconColor: 'text-slate-600 dark:text-slate-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
]

function ScenariosSection() {
  return (
    <section className="mt-12 pt-12 mb-8 border-t border-border/30">
      <h2 className="text-base font-semibold text-foreground mb-4">适用场景</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((item, index) => {
          const Icon = item.icon
          return (
            <Card
              key={index}
              className={cn(
                'group p-0 border-0 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300',
                item.bg
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm',
                    item.iconBg
                  )}>
                    <Icon className={cn('h-4 w-4', item.iconColor)} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-wide">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground/90 leading-relaxed tracking-wide pl-[52px]">{item.desc}</p>
              </CardContent>
            </Card>
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
    q: '如何使用AI字幕生成？',
    a: '非常简单：1.上传或拖拽视频/音频文件；2.AI自动生成字幕，可在线编辑文字和样式；3.下载SRT格式字幕文件或带字幕的视频。',
  },
  {
    q: '字幕生成后可以编辑吗？',
    a: '可以，使用内置字幕编辑器即可调整文字、修正错误、调整字幕样式（字体、颜色、大小、位置）。',
  },
  {
    q: '支持哪些文件格式？',
    a: '支持MP4、MOV、M4V、WAV等视频格式，MP3等音频文件也支持自动上字幕，支持SRT、ASS等常见字幕格式',
  },
  {
    q: '可以自动翻译字幕吗？',
    a: '可以，生成字幕后支持一键翻译为20+种其他语言，覆盖英语、西班牙语、法语、德语、日语等全球主流语言。',
  },
  {
    q: '支持商用吗？',
    a: '完全可以，许多用户用于教程、广告、电商和在线教育生成字幕，满足商业级需求。',
  },
  {
    q: '准确率如何？',
    a: '基于深度训练的AI模型，能提供20+种语言的高精度字幕识别，即使是复杂音视频也能快速捕捉每一个词。',
  },
  {
    q: '可以直接在网页调整字幕时间戳吗？',
    a: '可以，字幕编辑器支持在线修改字幕样式和文字内容，无需下载任何软件。',
  },
]

function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-4">常见问题</h2>
      <div className="max-w-2xl space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = expandedIndex === index
          return (
            <div
              key={index}
              className="rounded-lg border border-border/40 bg-card overflow-hidden transition-colors hover:border-border"
            >
              <button
                onClick={() => setExpandedIndex(isOpen ? null : index)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-secondary/30"
              >
                <ChevronDown className={cn(
                  'h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} />
                <span className="flex-1 text-sm font-medium text-foreground">{faq.q}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pl-10">
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
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

export function AgentVideoSubtitleIntro() {
  return (
    <div className="w-full space-y-0">
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <ScenariosSection />
      <FAQSection />
    </div>
  )
}
