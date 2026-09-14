'use client'

import { AgentScene } from '@/lib/mock-data'
import * as PhosphorIcons from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// Lucide to Phosphor icon name mapping
const iconMapping: Record<string, string> = {
  // Audio
  Mic: 'Microphone',
  Headphones: 'Headphones',
  AudioLines: 'Waveform',
  BookAudio: 'BookOpenText',
  Podcast: 'Broadcast',
  Volume2: 'SpeakerHigh',
  // Video
  Film: 'FilmStrip',
  Video: 'VideoCamera',
  ImagePlay: 'PlayCircle',
  Camera: 'Camera',
  Clapperboard: 'FilmStrip',
  // Image
  Image: 'Image',
  Album: 'Images',
  ShoppingBag: 'ShoppingBag',
  // Text
  Pencil: 'PencilSimple',
  PenTool: 'PenNib',
  ScrollText: 'Scroll',
  Sparkles: 'Sparkle',
  Wand2: 'MagicWand',
  // UI
  Globe: 'Globe',
  GraduationCap: 'GraduationCap',
  Users: 'Users',
  Megaphone: 'Megaphone',
  BookMarked: 'BookmarkSimple',
  BookOpen: 'BookOpen',
  Languages: 'Translate',
  Subtitles: 'Subtitles',
  Eraser: 'Eraser',
  // Video process
  Building2: 'Buildings',
  Package: 'Package',
  PartyPopper: 'Confetti',
  Youtube: 'YoutubeLogo',
  Accessibility: 'Hand',
  Store: 'Storefront',
  // Fallback
  Circle: 'Circle',
}

// Get Phosphor icon by name (with fallback)
function getPhosphorIcon(iconName: string) {
  const mappedName = iconMapping[iconName] || iconName
  const Icon = (PhosphorIcons as any)[mappedName]
  return Icon || PhosphorIcons.Circle
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AgentSceneCardsProps {
  scenes: AgentScene[]
}

// ---------------------------------------------------------------------------
// Per-color design tokens — icon gradient ring, icon colour, hover glow, tags
// ---------------------------------------------------------------------------

type SceneColor = 'rose' | 'sky' | 'amber' | 'emerald' | 'violet'

interface ColorSlot {
  gradient: string // applied to icon container as bg-gradient-to-br
  iconColor: string // text-* for the Lucide icon
  glow: string // group-hover shadow colour
  tagBg: string // bg for highlight pills
  tagText: string // text for highlight pills
  borderHover: string // hover border tint
}

const colorSlots: Record<SceneColor, ColorSlot> = {
  rose: {
    gradient: 'from-rose-400/30 via-pink-400/20 to-rose-300/25',
    iconColor: 'text-rose-600 dark:text-rose-400',
    glow: 'group-hover:shadow-rose-400/15',
    tagBg: 'bg-rose-100 dark:bg-rose-950/60',
    tagText: 'text-rose-700 dark:text-rose-300',
    borderHover: 'group-hover:border-rose-300/60',
  },
  sky: {
    gradient: 'from-sky-400/30 via-blue-400/20 to-cyan-300/25',
    iconColor: 'text-sky-600 dark:text-sky-400',
    glow: 'group-hover:shadow-sky-400/15',
    tagBg: 'bg-sky-100 dark:bg-sky-950/60',
    tagText: 'text-sky-700 dark:text-sky-300',
    borderHover: 'group-hover:border-sky-300/60',
  },
  amber: {
    gradient: 'from-amber-400/30 via-orange-400/20 to-yellow-300/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
    glow: 'group-hover:shadow-amber-400/15',
    tagBg: 'bg-amber-100 dark:bg-amber-950/60',
    tagText: 'text-amber-700 dark:text-amber-300',
    borderHover: 'group-hover:border-amber-300/60',
  },
  emerald: {
    gradient: 'from-emerald-400/30 via-green-400/20 to-teal-300/25',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glow: 'group-hover:shadow-emerald-400/15',
    tagBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    tagText: 'text-emerald-700 dark:text-emerald-300',
    borderHover: 'group-hover:border-emerald-300/60',
  },
  violet: {
    gradient: 'from-violet-400/30 via-purple-400/20 to-fuchsia-300/25',
    iconColor: 'text-violet-600 dark:text-violet-400',
    glow: 'group-hover:shadow-violet-400/15',
    tagBg: 'bg-violet-100 dark:bg-violet-950/60',
    tagText: 'text-violet-700 dark:text-violet-300',
    borderHover: 'group-hover:border-violet-300/60',
  },
}

const defaultColor: SceneColor = 'rose'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AgentSceneCards({ scenes }: AgentSceneCardsProps) {
  return (
    <div className="w-full mb-6">
      {/* ── Section heading ── */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-indigo-400/20 to-violet-400/20 text-[11px] leading-none">
          🎯
        </span>
        <h2 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase select-none">
          适用场景
        </h2>
      </div>

      {/* ── Responsive grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {scenes.map((scene, index) => {
          const IconComponent = getPhosphorIcon(scene.icon)
          const slot = colorSlots[scene.color ?? defaultColor]

          return (
            <div
              key={index}
              className={cn(
                'group relative',
                // Subtle staggered entrance (CSS-only, no JS)
                'animate-[fade-in-up_0.4s_ease-out_both]',
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Card */}
              <div
                className={cn(
                  // Base
                  'relative flex flex-col gap-3 rounded-xl border bg-card p-5',
                  'border-border/50',
                  // Transitions
                  'transition-all duration-300 ease-out',
                  // Hover: lift + shadow + border glow
                  'hover:-translate-y-1',
                  'hover:shadow-lg hover:shadow-zinc-950/[0.06]',
                  slot.glow,
                  slot.borderHover,
                  // Cursor
                  'cursor-default select-none',
                )}
              >
                {/* ── Top row: icon + title ── */}
                <div className="flex items-center gap-3">
                  {/* Gradient icon circle */}
                  <div
                    className={cn(
                      'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      'bg-gradient-to-br',
                      slot.gradient,
                      'ring-1 ring-inset ring-white/20 dark:ring-white/10',
                      'shadow-sm',
                    )}
                  >
                    <IconComponent className={cn('h-[22px] w-[22px]', slot.iconColor)} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-foreground leading-tight">
                    {scene.title}
                  </h3>
                </div>

                {/* ── Description ── */}
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {scene.description}
                </p>

                {/* ── Highlight tags ── */}
                {scene.highlights && scene.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {scene.highlights.map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-0.5',
                          'text-[11px] font-medium leading-relaxed',
                          'transition-colors duration-200',
                          slot.tagBg,
                          slot.tagText,
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
