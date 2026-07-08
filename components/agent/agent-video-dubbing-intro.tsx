'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  Volume2,
  Download,
  Music,
  Mic,
  Users,
  Zap,
  Globe,
  Sparkles,
  Video,
  Megaphone,
  GraduationCap,
  Podcast,
  BookMarked,
  Clapperboard,
  FileText,
  Wand2,
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
        AI视频配音
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
        上传视频，AI自动提取文字并替换为多音色AI配音，支持背景音乐混音。
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
    title: '上传视频',
    desc: '拖拽或点击上传MP4、MOV等格式视频文件，支持多种主流格式。',
  },
  {
    icon: Volume2,
    title: '选择音色 & 参数',
    desc: '5种高品质AI音色随心切换，语速、音量、背景音乐自由搭配。',
  },
  {
    icon: Download,
    title: '生成下载',
    desc: '一键生成带AI配音的视频，支持下载配音视频和独立音频文件。',
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
    icon: Mic,
    title: '多音色配音',
    desc: '温柔女声、沉稳男声、活泼童声等5种高品质AI音色，满足不同场景需求。',
  },
  {
    icon: Music,
    title: '背景音乐混音',
    desc: '内置8种背景音乐风格：轻音乐、励志、欢快、电影感等，一键为配音增色。',
  },
  {
    icon: Users,
    title: '多音色选择',
    desc: '5种专业配音音色，满足不同风格需求',
  },
  {
    icon: Zap,
    title: '极速生成',
    desc: 'AI自动提取原视频文字并生成配音，AI秒级完成配音合成',
  },
  {
    icon: Globe,
    title: '专业音色库',
    desc: '30+真实人声，覆盖多种风格与场景',
  },
  {
    icon: Sparkles,
    title: '精细参数调节',
    desc: '语速与音量自由控制，精细打磨每一句配音。',
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
    title: '短视频创作',
    desc: '为短视频快速配上专业配音，告别原生音质限制，提升作品质感和完播率。',
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Megaphone,
    title: '营销推广',
    desc: '用具有感染力的AI配音为产品宣传视频注入情感，提升品牌传播力和转化率。',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: GraduationCap,
    title: '在线教育',
    desc: '为教学视频替换标准配音，清晰传达知识要点，打造专业课程形象。',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Podcast,
    title: '播客/有声内容',
    desc: '为视频内容生成带感情的播客级配音，让听众沉浸于声音的世界。',
    bg: 'bg-gradient-to-br from-indigo-50 to-fuchsia-50 dark:from-indigo-950/30 dark:to-fuchsia-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Clapperboard,
    title: '影视解说',
    desc: '为电影、电视剧解说视频配上富有表现力的旁白配音，增强内容吸引力。',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: BookMarked,
    title: '企业培训',
    desc: '统一企业内部培训视频的配音风格，打造专业、规范的学习内容体系。',
    bg: 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
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
    q: '如何使用AI视频配音？',
    a: '1.上传视频文件；2.选择你喜欢的配音音色和背景音乐；3.调整语速、音量等参数；4.点击开始处理，AI自动生成配音视频。',
  },
  {
    q: '支持哪些音色类型？',
    a: '提供5种高品质AI音色：温柔女声、活泼女声、沉稳男声、磁性男声、可爱童声，每种音色都经过专业调校。',
  },
  {
    q: '可以添加背景音乐吗？',
    a: '可以。内置8种背景音乐风格，包括轻音乐、励志、欢快、电影感、Lo-fi等，也可在结果页重新选择背景音乐重新生成。',
  },
  {
    q: '配音效果可以调节吗？',
    a: '可以。支持语速（0.5x-2.0x）、音量（50%-150%）两个维度的精细调节，满足不同场景需求。',
  },
  {
    q: '生成后可以修改配音吗？',
    a: '可以。在结果页右侧配置区重新选择音色或调节参数后，点击"开始处理"即可重新生成配音，直到满意为止。',
  },
  {
    q: '支持哪些视频格式？',
    a: '支持MP4、MOV等主流视频格式，最大支持500MB的视频文件。',
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

export function AgentVideoDubbingIntro() {
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
