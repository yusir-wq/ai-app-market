'use client'

import { useState } from 'react'
import {
  UserCircle,
  Waveform,
  MusicNote,
  GlobeHemisphereWest,
  PlayCircle,
  Export,
  FileText,
  CaretDown,
  MagicWand,
  SpeakerHigh,
  FilmStrip,
  BookOpen,
  GraduationCap,
  ApplePodcastsLogo,
  Megaphone,
  Newspaper,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const CARD_SHADOW: React.CSSProperties = { boxShadow: '0 8px 22px rgba(38,44,72,0.028)' }

// ============================================================
// Hero
// ============================================================

function HeroSection() {
  return (
    <div className="mb-8">
      <h1 className="text-[20px] font-medium text-[#3f4558] mb-2">AI文字转语音</h1>
      <p className="text-sm text-[#8a91a6] leading-relaxed max-w-xl">
        输入文案即可生成自然流畅的人声语音，支持多音色、情感控制与背景音乐，满足配音、有声书、视频旁白等多样创作需求。
      </p>
    </div>
  )
}

// ============================================================
// Steps
// ============================================================

const steps = [
  {
    icon: FileText,
    title: '输入文案',
    desc: '直接输入或上传文本文件，支持AI辅助写作与故事灵感快速填充。',
  },
  {
    icon: SpeakerHigh,
    title: '选择音色与参数',
    desc: '30+真实人声随心切换，语速、音量、情感风格自由调节。',
  },
  {
    icon: MagicWand,
    title: '一键生成语音',
    desc: 'AI即刻完成文本分析与语音合成，秒级获得自然流畅的人声音频。',
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
  { icon: UserCircle, title: '多音色切换', desc: '温柔女声、沉稳男声、活泼童声等30+真实人声，心仪之声一键即达' },
  { icon: Waveform, title: '情感控制', desc: '支持朗读、激动、悲伤、轻柔等多种情感风格，让配音更具表现力' },
  { icon: MusicNote, title: '背景音乐', desc: '内置丰富BGM素材库，支持自定义上传，一键叠加背景音乐' },
  { icon: GlobeHemisphereWest, title: '多语种支持', desc: '覆盖中文、英语、日语、韩语等20+种语言，满足全球化内容创作' },
  { icon: PlayCircle, title: '实时预览', desc: '生成前可试听效果，快速调整参数，确保每段配音都符合预期' },
  { icon: Export, title: '批量导出', desc: '支持MP3、WAV、M4A多格式导出，批量处理长文案，高效产出' },
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
  { icon: FilmStrip, title: '短视频配音', desc: '为抖音、快手等短视频生成生动配音，抓住观众注意力，提升完播率', bg: 'bg-gradient-to-br from-indigo-50 to-violet-50', iconColor: 'text-indigo-600', iconBg: 'bg-white/70' },
  { icon: BookOpen, title: '有声读物', desc: '将小说、散文、故事自动转换为有声书，支持多角色分声朗读', bg: 'bg-gradient-to-br from-teal-50 to-cyan-50', iconColor: 'text-teal-600', iconBg: 'bg-white/70' },
  { icon: GraduationCap, title: '课程录制', desc: '搭配清晰权威的AI旁白，快速制作在线课程音频，提升学习体验', bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50', iconColor: 'text-fuchsia-600', iconBg: 'bg-white/70' },
  { icon: ApplePodcastsLogo, title: '播客制作', desc: '生成极具辨识度的播客开场与过渡语音，用声音营造专业氛围', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', iconColor: 'text-amber-600', iconBg: 'bg-white/70' },
  { icon: Megaphone, title: '广告配音', desc: '一键生成多音色广告推销音频，让互动与转化效果最大化', bg: 'bg-gradient-to-br from-rose-50 to-red-50', iconColor: 'text-rose-600', iconBg: 'bg-white/70' },
  { icon: Newspaper, title: '新闻播报', desc: '将新闻稿件自动转为标准播报语音，适用于资讯平台与智能助手', bg: 'bg-gradient-to-br from-slate-100 to-gray-100', iconColor: 'text-slate-600', iconBg: 'bg-white/70' },
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
  { q: '如何使用AI文字转语音？', a: '输入或粘贴文案，选择音色和语速等参数，点击"开始处理"，AI即刻进行文本分析与语音合成，10-30秒即可获得自然流畅的人声朗读音频，支持在线预览和下载。' },
  { q: '支持哪些语言？', a: '支持中文、英语、日语、韩语、法语、德语、西班牙语等20+种主流语种，满足全球化内容创作需求。' },
  { q: '生成的语音听起来自然吗？', a: '非常自然。采用领先的AI语音合成技术，能够还原温暖、富有表现力的真人级声音，告别生硬机械音，让听众沉浸其中。' },
  { q: '可以控制情感和语调吗？', a: '可以。支持朗读、激动、悲伤、轻柔等多种情感风格切换，让每段配音都精准匹配内容氛围。' },
  { q: '支持添加背景音乐吗？', a: '支持。内置丰富BGM素材库，也可自定义上传背景音乐，一键叠加到生成语音中。' },
  { q: '一次能处理多少字？', a: '单次支持处理5000字以内的文案。也支持上传.txt文件，或使用AI辅助写作快速填充内容。' },
  { q: '生成的音频可以商用吗？', a: '可以。VIP会员生成的音频可用于商业用途，包括短视频配音、广告推广、在线课程等场景，助你内容变现无忧。' },
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

export function AgentTextToSpeechIntro() {
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