'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Play,
  Pause,
  Maximize2,
  Download,
  X,
  Copy,
  CheckCircle,
} from 'lucide-react'

interface VideoPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video: string | null
  onDownload?: () => void
  onCopyLink?: () => void
  onUsePrompt?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
}

export function VideoPreviewDialog({
  open,
  onOpenChange,
  video,
  onDownload,
  onCopyLink,
  onUsePrompt,
  onRegenerate,
  onDelete,
}: VideoPreviewDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  const handleCopyLink = () => {
    onCopyLink?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>视频预览</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* 视频播放区 */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
            {video ? (
              <>
                <video
                  ref={videoRef}
                  src={video}
                  className="w-full h-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* 视频控制覆盖层 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black"
                      onClick={handleFullscreen}
                    >
                      <Maximize2 className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                无视频
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
              下载
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制链接
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onUsePrompt}
            >
              使用提示词
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
            >
              再次生成
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              删除
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
