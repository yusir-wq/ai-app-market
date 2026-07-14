'use client'

import { useState } from 'react'
import {
  PencilSimple,
  Sparkle,
  FileText,
  MagicWand,
  Lightbulb,
  Hash,
  GlobeHemisphereWest,
  VideoCamera,
  Storefront,
  Megaphone,
  Leaf,
  Newspaper,
  Building,
  ChatCircleText,
  SlidersHorizontal,
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
        输入一段视频主题，AI即可自动生成完整的视频脚本与推荐发布关键词，支持多语言输出和自定义文案要求。
      </p>
    </div>
  )
}

// ============================================================
// Steps
// ============================================================

const steps = [
  {
    icon: PencilSimple,
    title: '输入主题',
    desc: '输入视频主题、产品名称或创意关键词，AI自动理解你的创作意图与目标受众。',
  },
  {
    icon: MagicWand,
    title: 'AI智能生成',
    desc: '一键生成完整视频脚本，附带推荐关键词，可直接用于内容发布。',
  },
  {
    icon: FileText,
    title: '编辑使用',
    desc: '在线编辑文案内容，一键复制或导出TXT，也可以直接基于脚本生成视频。',
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
                <div className="mt-2 w-9 h-9 rounded-[12px] bg-[#4f55ec]/[0.08] border border-[#4f55ec]/20 flex items-center justify-center">
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
  { icon: GlobeHemisphereWest, title: '多语言输出', desc: '支持简体中文、English、日本語、한국어、Español 五种语言，也可以选择自动检测' },
  { icon: Hash, title: '段落灵活控制', desc: '1-10 段自由调节，精准控制文案篇幅，适配不同时长和平台的发布需求' },
  { icon: ChatCircleText, title: '自定义文案要求', desc: '自由描述语气、风格、目标受众等偏好，AI按需生成最贴合需求的脚本' },
  { icon: Sparkle, title: '附带视频关键词', desc: '生成脚本的同时自动匹配热搜标签，可直接复制用于视频发布获得更多曝光' },
  { icon: SlidersHorizontal, title: '编辑后生成视频', desc: '对生成结果在线编辑调整，满意后一键跳转AI文案生视频，完成出片流程' },
  { icon: Lightbulb, title: '灵感枯竭救星', desc: '只需输入一个主题即可获得完整脚本与关键词，告别创作焦虑' },
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
              <div className="w-10 h-10 rounded-[12px] bg-[#4f55ec]/[0.08] border border-[#4f55ec]/10 flex items-center justify-center shrink-0">
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
  { icon: VideoCamera, title: '短视频脚本', desc: '输入产品卖点或话题方向，自动生成带节奏感的脚本，附带平台热门标签', bg: 'bg-gradient-to-br from-rose-50 to-pink-50', iconColor: 'text-rose-600', iconBg: 'bg-white/70' },
  { icon: Storefront, title: '产品推广', desc: '输入产品名称与核心卖点，快速生成展示型脚本及营销关键词', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', iconColor: 'text-amber-600', iconBg: 'bg-white/70' },
  { icon: Megaphone, title: '品牌宣传', desc: '输入品牌理念与价值主张，生成有感染力的品牌叙事脚本', bg: 'bg-gradient-to-br from-violet-50 to-purple-50', iconColor: 'text-violet-600', iconBg: 'bg-white/70' },
  { icon: Leaf, title: '生活方式内容', desc: '输入穿搭、美食、旅行等生活类主题，生成打卡式 VLOG 脚本', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', iconColor: 'text-emerald-600', iconBg: 'bg-white/70' },
  { icon: Newspaper, title: '知识科普', desc: '输入知识点或行业热点，自动生成通俗易懂的科普讲解脚本', bg: 'bg-gradient-to-br from-sky-50 to-blue-50', iconColor: 'text-sky-600', iconBg: 'bg-white/70' },
  { icon: Building, title: '品牌故事', desc: '输入品牌背景，生成打动人心的品牌叙事，建立用户深层情感连接', bg: 'bg-gradient-to-br from-indigo-50 to-fuchsia-50', iconColor: 'text-indigo-600', iconBg: 'bg-white/70' },
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
                <div className={cn('w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0', item.iconBg)}>
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
  { q: '如何使用AI生成视频文案？', a: '非常简单：输入视频主题或产品关键词 → 设置生成语言、段落数量和自定义要求 → 点击"开始生成"，AI即刻生成完整视频脚本与推荐关键词，支持在线编辑、复制导出以及一键跳转生成视频。' },
  { q: '生成的文案是原创的吗？', a: '是的。AI基于大语言模型进行语义理解和创意生成，每篇文案都是独立创作，不会直接复制网络上的已有内容。同时支持查重校验，确保内容原创度。' },
  { q: '支持哪些使用场景？', a: '覆盖短视频脚本、产品推广、品牌宣传、生活方式 VLOG、知识科普、品牌故事等多种内容创作场景。只需输入一个主题，AI即可匹配合适的脚本结构。' },
  { q: '如何自定义文案的风格和语气？', a: '在右侧参数区的"自定义要求"输入框中，你可以自由描述期望的语气、面向的用户类型、内容风格等偏好，比如"轻松幽默，面向年轻用户，开头要有悬念"，AI会据此精准生成。' },
  { q: '生成的文案长度能控制吗？', a: '可以。通过"段落数量"滑块（1-10段）灵活控制脚本篇幅：1-3段适合15秒短视频，4-6段适合1-3分钟内容，7-10段适合深度长视频。' },
  { q: '不满意可以重新生成吗？', a: '可以。你可以调整参数后再次生成，也可以在结果页直接编辑脚本内容后再点击"生成视频"跳转到文案生视频应用，完成出片流程。' },
  { q: '生成的文案可以商用吗？', a: '可以。VIP会员生成的文案可用于商业用途，包括短视频发布、广告投放、品牌宣传等商业化场景，助你内容变现无忧。' },
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

export function AgentCopywritingIntro() {
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
