'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mic,
  User,
  Zap,
  Globe,
  Clock,
  Sparkles,
  Video,
  Megaphone,
  Package,
  Building2,
  GraduationCap,
  Podcast,
  FileText,
  Wand2,
  Volume2,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Hero — compact, left-aligned
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        AI文字转语音
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
        秒级生成带情感的真人级文字朗读，言随己心，音如你愿。
      </p>
    </div>
  )
}

// ============================================================
// Steps — visual stepper with order guidance
// ============================================================

const steps = [
  {
    icon: FileText,
    title: '输入文案',
    desc: '直接输入或上传txt文件，AI帮你写、随机故事灵感，多种方式快速填充内容',
  },
  {
    icon: Volume2,
    title: '选择音色 & 参数',
    desc: '30+真实人声随心切换，语速、音量自由调节',
  },
  {
    icon: Wand2,
    title: '一键生成',
    desc: '点击开始处理，AI即刻文本分析→语音合成→音频渲染，秒级获得自然流畅的人声',
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
              {/* Connector line - desktop horizontal */}
              {!isLast && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2px] bg-gradient-to-r from-primary/40 to-primary/10" />
              )}
              {/* Connector line - mobile vertical */}
              {!isLast && (
                <div className="md:hidden absolute left-5 top-12 w-[2px] h-[calc(100%-32px)] bg-gradient-to-b from-primary/40 to-primary/10" />
              )}

              {/* Step circle with icon */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm shadow-primary/25">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Step content */}
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
// Features — compact grid, short descriptions
// ============================================================

const features = [
  {
    icon: Mic,
    title: '自然人声',
    desc: '告别生硬机械音，还原温暖、富有表现力的真实人声',
  },
  {
    icon: User,
    title: '30+真实声音',
    desc: '温柔女声、沉稳男声、活泼童声，心仪之声一键即达',
  },
  {
    icon: Zap,
    title: '操作简单流畅',
    desc: '输入文案一键生成，即时预览，全心投入创作无忧',
  },
  {
    icon: Globe,
    title: '多音色切换',
    desc: '温柔女声、沉稳男声、活泼童声，心仪之声一键即达',
  },
  {
    icon: Clock,
    title: '秒级生成',
    desc: '输入文案一键生成，即时预览，全心投入创作无忧',
  },
  {
    icon: Sparkles,
    title: '情感丰富',
    desc: '秒级生成带情感的朗读，让每段配音"声"动人心',
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
// Scenarios — colorful gradient cards
// ============================================================

const scenarios = [
  {
    icon: Video,
    title: '短视频',
    desc: '用生动配音抓住观众注意力，提升完播率，让您的视频脱颖而出',
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Megaphone,
    title: '带货广告',
    desc: '一键生成多语言、多音色的广告推销音频，让互动与转化效果最大化',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Package,
    title: '产品解说',
    desc: '以清晰、富有感染力的语音，将复杂功能娓娓道来，让用户轻松理解产品价值',
    bg: 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Building2,
    title: '品牌视频',
    desc: '塑造专属、统一的品牌音色，建立声音标识，增强品牌辨识度与用户信任',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: GraduationCap,
    title: '在线课程',
    desc: '搭配权威且清晰的AI旁白，打造沉浸式学习体验，提升课程学习效率',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Podcast,
    title: '播客开场',
    desc: '打造极具辨识度的开场白，用声音营造氛围，在三秒内牢牢抓住听众的耳朵',
    bg: 'bg-gradient-to-br from-indigo-50 to-fuchsia-50 dark:from-indigo-950/30 dark:to-fuchsia-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
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
// FAQ — compact accordion
// ============================================================

const faqs = [
  {
    q: '如何使用AI文字转语音？',
    a: '非常简单：输入或粘贴文案→选择音色和语速等参数→点击"开始处理"，AI即刻进行文本分析、语音合成与音频渲染，10-30秒即可获得自然流畅的人声朗读音频，支持在线预览和下载。',
  },
  {
    q: '支持哪些语言？',
    a: '支持中文、英语、日语、韩语、法语、德语、西班牙语等20+种主流语种',
  },
  {
    q: '生成的语音听起来自然吗？',
    a: '非常自然。我们采用领先的AI语音合成技术，能够还原温暖、富有表现力的自然人声，告别生硬冰冷的机械音，让听众沉浸其中。',
  },
  {
    q: '可以自定义语速和音量吗？',
    a: '可以。支持自由调节语速（0.5x-2.0x）和音量（50%-150%），让每一段配音都精准匹配你的内容风格。',
  },
  {
    q: '支持哪些输出格式？',
    a: '支持MP3、WAV、M4A三种主流音频格式导出，兼容各类视频编辑软件、播客平台和社交媒体。',
  },
  {
    q: '一次能处理多少字？',
    a: '单次支持处理5000字以内的文案。同时也支持上传.txt文件，AI帮你写或随机故事灵感快速填充内容。',
  },
  {
    q: '生成的音频可以商用吗？',
    a: '可以。VIP会员生成的音频可用于商业用途，包括短视频配音、广告推广、品牌视频、在线课程等场景，助你内容变现无忧。',
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

export function AgentTextToSpeechIntro() {
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
