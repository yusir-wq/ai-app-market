'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  Eraser,
  Download,
  Target,
  Zap,
  Monitor,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Video,
  Gamepad2,
  Share2,
  Clapperboard,
  CropIcon,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        AI视频去水印
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
        极速处理，秒获干净视频。视频去水印不留痕，分享更自在。
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
    desc: '拖拽或点击上传MP4、MOV等格式视频文件，无需安装任何软件。',
  },
  {
    icon: CropIcon,
    title: '框选 & 去除',
    desc: '简单框选视频水印区域，AI将智能无痕擦除水印。',
  },
  {
    icon: Download,
    title: '下载视频',
    desc: '直接下载无水印视频，即可分享至各平台。',
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
    icon: Eraser,
    title: 'AI无痕擦除',
    desc: 'AI智能移除水印，分析周边画面并重建背景，实现无缝填充与自然修复，编辑痕迹彻底消失。',
  },
  {
    icon: Zap,
    title: '一键极速操作',
    desc: '简单圈选水印即可启动智能去水印流程，全程自动化，人人皆可快速制作专业级无水印视频。',
  },
  {
    icon: Monitor,
    title: '画质无损输出',
    desc: '严格保持视频原始画质，分辨率不变、动态范围完整、画面清晰如初，真正实现无损编辑。',
  },
  {
    icon: ShieldCheck,
    title: '安全隐私保护',
    desc: '采用企业级加密与隐私优先架构，每一份视频处理全程安全，数据永不外泄。',
  },
]

function FeaturesSection() {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-foreground mb-4">功能特性</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    icon: Share2,
    title: '内容再利用',
    desc: '轻松擦除素材网站或社交平台视频的品牌水印，让精彩片段得以合规、无痕地融入你的创作。',
    bg: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Clapperboard,
    title: '专业品牌制作',
    desc: '获取干净无标的备用镜头，无缝叠加你的品牌标识与信息，塑造统一、专业的品牌形象。',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Video,
    title: '个人视频修复',
    desc: '从家庭录像与珍贵回忆中，智能移除日期戳、相机商标等时间痕迹，只留下清晰温情画面。',
    bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: GraduationCap,
    title: '教育课程制作',
    desc: '为教程视频去水印，清除界面水印与干扰文字，打造无干扰的知识传递体验。',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Gamepad2,
    title: '游戏直播集锦',
    desc: '对游戏与直播内容视频去水印，剪除各类叠加元素，呈现纯粹精彩片段。',
    bg: 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Briefcase,
    title: '社交媒体短片',
    desc: '移除短视频原有平台标记，让内容无缝适配不同社交媒体平台。',
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
    q: 'AI视频去水印是怎样实现的？',
    a: 'AI会智能分析你圈选的水印区域，并基于周围画面进行像素级重建，实现背景无缝填充，最终输出干净无痕的视频。',
  },
  {
    q: '视频去水印会影响原画面质吗？',
    a: '不会。AI专为画质无损而去水印设计，输出视频将完整保留原始分辨率、清晰度与动态范围。',
  },
  {
    q: '支持哪些视频格式？',
    a: '支持MP4、MOV、AVI、MKV、WMV等多种常见视频格式，可直接上传设备中的任何视频文件进行去水印处理。',
  },
  {
    q: '处理后的视频会添加新水印吗？',
    a: '不会。AI不会在你已经去水印的视频中添加任何新水印，你将获得完全干净的文件。',
  },
  {
    q: '复杂背景上的水印也能去除吗？',
    a: '可以。AI针对复杂场景深度优化，能有效处理动态背景、纹理区域等。建议仔细圈定水印范围以获得最佳效果。',
  },
  {
    q: '处理一个视频需要多长时间？',
    a: 'AI加速处理流程，通常1-3分钟即可完成，具体时间取决于视频长度和所选区域复杂度。',
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

export function AgentVideoWatermarkRemovalIntro() {
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
