'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DownloadSimple, FileText, FileAudio, FileVideo, FileImage, CheckCircle } from '@phosphor-icons/react'

export type ResultType = 'text' | 'audio' | 'video' | 'image' | 'file'

interface AgentResultPreviewProps {
  isProcessing: boolean
  resultType?: ResultType
  resultContent?: string
  resultUrl?: string
  resultFileName?: string
  progress?: number
  onDownload?: () => void
}

export function AgentResultPreview({
  isProcessing,
  resultType = 'text',
  resultContent,
  resultUrl,
  resultFileName,
  progress = 0,
  onDownload,
}: AgentResultPreviewProps) {
  // 处理中状态
  if (isProcessing) {
    return (
      <Card className="w-full mt-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm text-foreground">AI处理中...</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {progress}%
            </p>
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 无结果状态
  if (!resultContent && !resultUrl) {
    return null
  }

  // 结果图标
  const resultIcons: Record<ResultType, React.ReactNode> = {
    text: <FileText className="h-8 w-8 text-blue-500" />,
    audio: <FileAudio className="h-8 w-8 text-rose-500" />,
    video: <FileVideo className="h-8 w-8 text-violet-500" />,
    image: <FileImage className="h-8 w-8 text-emerald-500" />,
    file: <FileText className="h-8 w-8 text-amber-500" />,
  }

  return (
    <Card className="w-full mt-6 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-foreground">处理完成</span>
        </div>

        {/* 文本结果 */}
        {resultType === 'text' && resultContent && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-muted/50 max-h-[400px] overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                {resultContent}
              </pre>
            </div>
            <Button variant="outline" onClick={onDownload} className="w-full">
              <DownloadSimple className="h-4 w-4 mr-2" />
              下载文本文件
            </Button>
          </div>
        )}

        {/* 图片结果 */}
        {resultType === 'image' && resultUrl && (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={resultUrl}
                alt="处理结果"
                className="w-full h-auto object-contain"
              />
            </div>
            <Button variant="outline" onClick={onDownload} className="w-full">
              <DownloadSimple className="h-4 w-4 mr-2" />
              下载图片
            </Button>
          </div>
        )}

        {/* 音频结果 */}
        {resultType === 'audio' && resultUrl && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <audio controls className="w-full">
                <source src={resultUrl} />
                您的浏览器不支持音频播放
              </audio>
            </div>
            <Button variant="outline" onClick={onDownload} className="w-full">
              <DownloadSimple className="h-4 w-4 mr-2" />
              下载音频文件
            </Button>
          </div>
        )}

        {/* 视频结果 */}
        {resultType === 'video' && resultUrl && (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-border">
              <video controls className="w-full">
                <source src={resultUrl} />
                您的浏览器不支持视频播放
              </video>
            </div>
            <Button variant="outline" onClick={onDownload} className="w-full">
              <DownloadSimple className="h-4 w-4 mr-2" />
              下载视频文件
            </Button>
          </div>
        )}

        {/* 文件结果 */}
        {resultType === 'file' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/50">
              {resultIcons[resultType]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {resultFileName || '处理结果文件'}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onDownload} className="w-full">
              <DownloadSimple className="h-4 w-4 mr-2" />
              下载文件
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
