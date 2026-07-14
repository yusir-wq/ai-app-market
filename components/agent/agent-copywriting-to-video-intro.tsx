'use client'

import { useState } from 'react'
import {
  MagicWand,
  UploadSimple,
  VideoCamera,
  Sparkle,
  Lightning,
  Cpu,
  ShoppingBag,
  GraduationCap,
  FilmStrip,
  TrendUp,
  Heart,
  SealCheck,
  Clock,
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
        简单、创新、高效，任意文本、图片都能快速生成高质量视频，让每一个想法都大放异彩！
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
    title: '输入素材',
    desc: '输入文本或上传图片，选择视频比例、时长等参数，即可开始生成。',
  },
  {
    icon: MagicWand,
    title: 'AI分镜创作',
    desc: 'AI自动理解素材含义，生成分镜脚本和视频画面，搭配智能配音。',
  },
  {
    icon: VideoCamera,
    title: '合成预览',
    desc: '一键合成完整视频，预览效果后可下载导出，即生成即用。',
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
  { icon: Cpu, title: '世界顶级AI模型', desc: '采用最尖端的AI模型，仅需输入提示词，即可生成细节丰富、逼真度极高的视频内容' },
  { icon: MagicWand, title: '无需拍摄剪辑', desc: '采用先进的AI技术，只需输入文本或图片，即可自动生成高质量视频内容' },
  { icon: Clock, title: '快速生成视频', desc: '支持生成3-15秒的视频，无需繁琐的视频制作流程，节省时间和资源' },
  { icon: Lightning, title: '效率提升', desc: '视频创作效率大幅提升，无需专业设备和团队，一个人就能完成' },
  { icon: Sparkle, title: '创意无边界', desc: 'AI帮您实现各种创意想法，支持多种视频比例和清晰度选择' },
  { icon: SealCheck, title: '专业级品质', desc: '视频画质清晰、视觉效果精美，支持最高1080P的分辨率选择' },
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
  { icon: ShoppingBag, title: '广告营销', desc: '产品演示、品牌故事、社交广告，AI快速制作吸引眼球的视频，扩大品牌曝光度', bg: 'bg-gradient-to-br from-indigo-50 to-violet-50', iconColor: 'text-indigo-600', iconBg: 'bg-white/70' },
  { icon: GraduationCap, title: '教育培训', desc: '在线课程、公共教育、企业培训，AI制作内容丰富的教学视频，提升学习效果', bg: 'bg-gradient-to-br from-teal-50 to-cyan-50', iconColor: 'text-teal-600', iconBg: 'bg-white/70' },
  { icon: FilmStrip, title: '影视创意', desc: '视频故事、创意内容、概念演示，AI简化视频制作流程，降低创作门槛', bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50', iconColor: 'text-fuchsia-600', iconBg: 'bg-white/70' },
  { icon: TrendUp, title: '短视频创作', desc: '抖音、快手等短视频平台，AI快速制作精美内容，吸引眼球，提升播放量', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', iconColor: 'text-amber-600', iconBg: 'bg-white/70' },
  { icon: Heart, title: '个人纪念', desc: '旅行记录、家庭回忆、节日祝福，AI制作温馨视频，保留珍贵回忆', bg: 'bg-gradient-to-br from-rose-50 to-red-50', iconColor: 'text-rose-600', iconBg: 'bg-white/70' },
  { icon: Sparkle, title: '创意实现', desc: 'AI支持各种创意想法的实现，无需担心技术门槛，轻松将创意变成现实', bg: 'bg-gradient-to-br from-slate-100 to-gray-100', iconColor: 'text-slate-600', iconBg: 'bg-white/70' },
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
  { q: '如何使用？', a: '输入文本或上传图片，选择视频参数（比例、时长、清晰度、背景音），AI自动生成分镜脚本和视频，预览后可下载导出。' },
  { q: '视频质量如何？', a: '采用世界顶级AI模型，生成的视频画质清晰、视觉效果精美，支持最高1080P的分辨率选择。' },
  { q: '支持哪些素材？', a: '支持文本、图片作为输入素材，任意文本、图片都能快速生成高质量视频。' },
  { q: '视频时长限制？', a: '支持生成3-15秒的视频，满足绝大多数短视频场景需求。' },
  { q: '需要专业设备吗？', a: '无需专业设备和团队，一个人一台电脑就能完成视频创作，大幅降低门槛。' },
  { q: '数据安全吗？', a: '采用端到端加密存储，符合国际合规标准，所有素材仅用于生成视频，绝不外泄。' },
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

export function AgentCopywritingToVideoIntro() {
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
