'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// Types
// ============================================================

interface Subtitle {
  id: number
  startTime: string
  endTime: string
  text: string
  translatedText: string
}

interface VideoTranslateResult {
  subtitles: Subtitle[]
  videoUrl: string
  originalFile: File
}

interface VideoTranslateResultPageProps {
  result: VideoTranslateResult
  onBackToEdit?: () => void
}

// ============================================================
// Subtitle List Component
// ============================================================

function SubtitleList({ subtitles }: { subtitles: Subtitle[] }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {subtitles.map((subtitle) => (
        <div
          key={subtitle.id}
          className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground/60 bg-muted/60 px-1.5 py-0.5 rounded">
              {subtitle.startTime} → {subtitle.endTime}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[13px] text-foreground/80 leading-relaxed">{subtitle.text}</p>
            <p className="text-[13px] text-primary/80 leading-relaxed">{subtitle.translatedText}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Video Player Component
// ============================================================

function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true) }
      else { videoRef.current.pause(); setIsPlaying(false) }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value); setCurrentTime(time)
    if (videoRef.current) videoRef.current.currentTime = time
  }

  const ft = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border border-border/20 bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onEnded={() => setIsPlaying(false)}
          controls
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground/50 w-10">{ft(currentTime)}</span>
          <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek}
            className="flex-1 h-1.5 bg-muted/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
          <span className="text-[11px] text-muted-foreground/50 w-10 text-right">{duration ? ft(duration) : '00:00'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-foreground" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1.5 rounded-md">
            <Download className="h-3 w-3" />导出视频
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

export function VideoTranslateResultPage({
  result,
  onBackToEdit
}: VideoTranslateResultPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 左: 生成结果 */}
      <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden gap-0">
        <div className="flex items-center px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
          <span className="w-1.5 h-4 rounded-full bg-blue-400 dark:bg-blue-500 shrink-0" />
          <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight ml-2">生成结果</h3>
        </div>
        <CardContent className="p-4">
          <SubtitleList subtitles={result.subtitles} />
        </CardContent>
      </Card>

      {/* 右: 视频预览 */}
      <Card className="border border-border/30 shadow-none bg-[#FBFBFD] dark:bg-[#0F0F12] overflow-hidden gap-0">
        <div className="flex items-center px-4 py-2.5 border-b border-border/20 bg-[#F8F9FB] dark:bg-[#131418]">
          <span className="w-1.5 h-4 rounded-full bg-violet-400 dark:bg-violet-500 shrink-0" />
          <h3 className="text-[13px] font-medium text-foreground/80 tracking-tight ml-2">视频预览</h3>
        </div>
        <CardContent className="p-4">
          <VideoPlayer videoUrl={result.videoUrl} />
        </CardContent>
      </Card>
    </div>
  )
}