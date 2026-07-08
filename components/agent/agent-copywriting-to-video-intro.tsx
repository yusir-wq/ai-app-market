'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Wand2,
  Upload,
  FileText,
  Video,
  Sparkles,
  Zap,
  Cpu,
  ShoppingBag,
  GraduationCap,
  Film,
  TrendingUp,
  HeartPulse,
  BadgeCheck,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Hero — compact, functional
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        视频生成器
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        简单、创新、高效，任意文本、图片都能快速生成高质量视频，让每一个想法都大放异彩！
      </p>
    </div>
  )
}

// ============================================================
// Steps — visual stepper with order guidance
// ============================================================

const steps = [
  {
    icon: Upload,
    title: '输入素材',
    desc: '输入文本或上传图片，选择视频比例、时长等参数，即可开始生成。',
  },
  {
    icon: Wand2,
    title: 'AI分镜创作',
    desc: 'AI自动理解素材含义，生成分镜脚本和视频画面，搭配智能配音。',
  },
  {
    icon: Video,
    title: '合成预览',
    desc: '一键合成完整视频，预览效果后可下载导出，即生成即用。',
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
    icon: Cpu,
    title: '世界顶级AI模型',
    desc: '采用最尖端的AI模型，仅需输入提示词，即可生成细节丰富、逼真度极高的视频内容',
  },
  {
    icon: Wand2,
    title: '无需拍摄剪辑',
    desc: '采用先进的AI技术，只需输入文本或图片，即可自动生成高质量视频内容',
  },
  {
    icon: Clock,
    title: '快速生成视频',
    desc: '支持生成3-15秒的视频，无需繁琐的视频制作流程，节省时间和资源',
  },
  {
    icon: Zap,
    title: '效率提升',
    desc: '视频创作效率大幅提升，无需专业设备和团队，一个人就能完成',
  },
  {
    icon: Sparkles,
    title: '创意无边界',
    desc: 'AI帮您实现各种创意想法，支持多种视频比例和清晰度选择',
  },
  {
    icon: BadgeCheck,
    title: '专业级品质',
    desc: '视频画质清晰、视觉效果精美，支持最高1080P的分辨率选择',
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
    icon: ShoppingBag,
    title: '广告&营销视频',
    desc: '产品演示、品牌故事、社交广告，AI快速制作吸引眼球的视频，扩大品牌&个人曝光度',
    bg: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: GraduationCap,
    title: '教育&培训视频',
    desc: '在线课程、公共教育、企业培训，AI制作内容丰富的教学视频，提升学习效果',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Film,
    title: '影视&创意视频',
    desc: '视频故事、创意内容、概念演示，AI简化视频制作流程，降低创作门槛',
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: TrendingUp,
    title: '短视频创作',
    desc: '抖音、快手等短视频平台，AI快速制作精美内容，吸引眼球，提升播放量',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
  {
    icon: HeartPulse,
    title: '个人纪念视频',
    desc: '旅行记录、家庭回忆、节日祝福，AI制作温馨视频，保留珍贵回忆',
    bg: 'bg-gradient-to-br from-rose-50 to-red-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Sparkles,
    title: '创意想法实现',
    desc: 'AI支持各种创意想法的实现，无需担心技术门槛，轻松将创意变成现实',
    bg: 'bg-gradient-to-br from-slate-100 to-gray-100',
    iconColor: 'text-slate-600',
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
    q: '如何使用？',
    a: '输入文本或上传图片，选择视频参数（比例、时长、清晰度、背景音），AI自动生成分镜脚本和视频，预览后可下载导出。',
  },
  {
    q: '视频质量如何？',
    a: '采用世界顶级AI模型，生成的视频画质清晰、视觉效果精美，支持最高1080P的分辨率选择。',
  },
  {
    q: '支持哪些素材？',
    a: '支持文本、图片作为输入素材，任意文本、图片都能快速生成高质量视频。',
  },
  {
    q: '视频时长限制？',
    a: '支持生成3-15秒的视频，满足绝大多数短视频场景需求。',
  },
  {
    q: '需要专业设备吗？',
    a: '无需专业设备和团队，一个人一台电脑就能完成视频创作，大幅降低门槛。',
  },
  {
    q: '能编辑视频吗？',
    a: 'AI自动生成视频，生成后可直接预览和下载。',
  },
  {
    q: '数据安全吗？',
    a: '采用端到端加密存储，符合国际合规标准，所有素材仅用于生成视频，绝不外泄。',
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

export function AgentCopywritingToVideoIntro() {
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
