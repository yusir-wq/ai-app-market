'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Languages,
  Upload,
  Settings2,
  FileVideo,
  Globe,
  Sparkles,
  Subtitles,
  Volume2,
  GraduationCap,
  TrendingUp,
  Building2,
  Newspaper,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        AI视频翻译
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        跨越语言障碍，让视频轻松翻译全球任何语言。支持70余种全球主流语言，精准翻译，保留原声情感。
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
    desc: '拖拽或点击上传视频文件，支持MP4、MOV、MKV等主流格式。',
  },
  {
    icon: Settings2,
    title: '选择翻译语言',
    desc: '选择目标语言，AI自动翻译',
  },
  {
    icon: Languages,
    title: 'AI翻译处理',
    desc: 'AI自动翻译语音内容，同步生成字幕与配音，保留原视频风格。',
  },
  {
    icon: FileVideo,
    title: '生成并下载',
    desc: '下载翻译后的视频或字幕文件',
  },
]

function StepsSection() {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-foreground mb-5">使用流程</h2>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <div key={index} className="relative flex items-start gap-3">
              {/* Step number + icon */}
              <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm shadow-primary/25">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground mb-1 tracking-wide">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed tracking-wide">{step.desc}</p>
              </div>

              {/* Arrow connector (desktop only) */}
              {!isLast && (
                <div className="hidden lg:flex absolute -right-2 top-4 items-center text-muted-foreground/30">
                  <ArrowRight className="h-4 w-4" />
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
// Features
// ============================================================

const features = [
  {
    icon: Languages,
    title: '70+语言支持',
    desc: '覆盖英语、中文、法语、德语、日语、韩语等全球主流语言及方言。',
  },
  {
    icon: Sparkles,
    title: '精准翻译',
    desc: '高精度AI翻译技术，确保视频原始信息在不同语言间准确无误地传递。',
  },
  {
    icon: Volume2,
    title: '配音与字幕同步',
    desc: '一站式完成视频翻译、字幕生成与AI配音，多种音色任你选。',
  },
  {
    icon: Subtitles,
    title: '字幕灵活编辑',
    desc: '翻译字幕与配音同步生成，字幕样式可自定义',
  },
  {
    icon: Globe,
    title: '智能语音识别',
    desc: '精准识别视频中的语音内容，高效翻译，沟通无国界',
  },
  {
    icon: FileVideo,
    title: '多格式兼容',
    desc: '支持MP4、MOV、MKV、WEBM等常见视频格式',
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
    icon: GraduationCap,
    title: '教学视频翻译',
    desc: '课堂扩展教学视频一键翻译，让更多学生听懂看懂，打破语言学习壁垒。',
    bg: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: TrendingUp,
    title: '内容出海',
    desc: '一键将视频翻译成多种语言，发布到海外平台，快速涨粉拓展全球市场。',
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Building2,
    title: '企业营销',
    desc: '产品宣传视频无需额外找专业翻译，AI全搞定，助力业务拓展到全球市场。',
    bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
  {
    icon: Newspaper,
    title: '新闻传媒',
    desc: '新闻视频快速翻译，速度快、准确率高，大大提升跨语言新闻生产效率。',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-white/70 dark:bg-white/10',
  },
]

function ScenariosSection() {
  return (
    <section className="mt-12 pt-12 mb-8 border-t border-border/30">
      <h2 className="text-base font-semibold text-foreground mb-4">适用场景</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    q: '如何使用AI视频翻译？',
    a: '只需4步即可完成视频翻译：1.上传视频文件；2.选择源语言和目标语言以及配音音色；3.试听视频配音并调整字幕；4.生成完整视频并下载保存。',
  },
  {
    q: '支持哪些语言？',
    a: '支持70余种语言进行视频翻译，包括英语、西班牙语、法语、中文（简体/繁体）、德语、日语、韩语等主要全球语言，以及其他小众语言。',
  },
  {
    q: '上传的视频有什么限制？',
    a: '支持常见视频格式，具体限制取决于上传文件的大小和网络环境',
  },
  {
    q: '翻译后可以只保留字幕不配音吗？',
    a: '支持灵活选择输出类型，可选择字幕+配音版本或仅字幕版本，满足不同场景需求',
  },
  {
    q: '翻译准确率如何？',
    a: '采用高精度AI翻译技术，针对视频场景深度优化，即使是不同口音与方言也能精准翻译，确保原意无误传达。',
  },
  {
    q: '翻译后的字幕可以编辑吗？',
    a: '翻译完成后可下载字幕文件进行编辑',
  },
  {
    q: '支持哪些语言？',
    a: '支持中文（简体/繁体）、英语、日语、韩语、法语、德语、西班牙语、葡萄牙语、意大利语、俄语、阿拉伯语、泰语、越南语、马来语、印地语、荷兰语、希腊语、土耳其语、波兰语、瑞典语、挪威语、丹麦语、芬兰语、捷克语、匈牙利语、罗马尼亚语、保加利亚语、克罗地亚语、塞尔维亚语、斯洛文尼亚语、斯洛伐克语、立陶宛语、拉脱维亚语、爱沙尼亚语、乌克兰语、白俄罗斯语、格鲁吉亚语、亚美尼亚语、阿塞拜疆语、哈萨克语、乌兹别克语、塔吉克语、吉尔吉斯语、土库曼语、蒙古语、波斯语、普什图语、乌尔都语、孟加拉语、泰米尔语、泰卢固语、马拉地语、古吉拉特语、卡纳达语、马拉雅拉姆语、奥里亚语、旁遮普语、僧伽罗语、缅甸语、老挝语、高棉语、菲律宾语、印尼语、希伯来语、斯瓦希里语、豪萨语、阿姆哈拉语、祖鲁语、南非荷兰语、冰岛语、阿尔巴尼亚语、波斯尼亚语、马其顿语等70余种全球主流语言。',
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

export function AgentVideoTranslateIntro() {
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
