'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  ShieldCheck,
  Globe,
  Zap,
  MousePointerClick,
  Upload,
  Wand2,
  FileText,
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
        AI视频转文字
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
        无需下载或安装程序，即可快速将视频转为精确文字稿。
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
    title: '上传视频',
    desc: '拖放MP4、MOV等常见格式的视频至上方输入框，即可开始使用。',
  },
  {
    icon: Wand2,
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
    icon: Zap,
    title: '高精准度',
    desc: '前沿AI技术提供98%的转换准确率',
  },
  {
    icon: Globe,
    title: '多语言支持',
    desc: '支持20+种世界主流语言',
  },
  {
    icon: ShieldCheck,
    title: '隐私保障',
    desc: '端对端加密保护您的内容',
  },
  {
    icon: MousePointerClick,
    title: '使用便利',
    desc: '只需一键即可将视频转为文字',
  },
]

function FeaturesSection() {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-foreground mb-4">功能特性</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
// FAQ — compact accordion
// ============================================================

const faqs = [
  {
    q: '视频转文字工具有多准确？',
    a: '我们先进的AI系统对大多数清晰发音视频达到98%准确率。当然也受音频品质、背景噪音、口音和专业术语等因素影响准确度。',
  },
  {
    q: '可以转写多种语言的视频吗？',
    a: '可以！我们的在线视频转文字服务支持中文、英语、日语、韩语、法语、德语、西班牙语等20+种语言。',
  },
  {
    q: '视频转文字有免费试用吗？',
    a: '新用户可免费转写最长10分钟视频，对于更长的视频，您可以选择分割视频或升级vip。',
  },
  {
    q: '我上传的视频内容安全吗？',
    a: '我们非常重视数据安全。所有上传的视频都通过加密连接处理，不与第三方共享，并在24小时后自动从我们的服务器删除。',
  },
  {
    q: '可以将转写文本导出为不同格式吗？',
    a: '当然可以！一旦您的视频被转为文字，您可以下载纯文本(txt)格式。您也可以复制文字并粘贴到任何地方。',
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

export function AgentVideoToTextIntro() {
  return (
    <div className="w-full space-y-0">
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  )
}
