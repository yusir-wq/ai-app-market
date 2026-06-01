'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Download,
  Copy,
  Image as ImageIcon,
  Zap,
  RotateCw,
  Trash2,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ImagePreviewDialogProps {
  open: boolean
  image: string | null
  onOpenChange: (open: boolean) => void
  onDownload?: () => void
  onCopyLink?: () => void
  onUseAsReference?: () => void
  onUsePrompt?: () => void
  onRegenerate?: () => void
  onDelete?: () => void
}

export function ImagePreviewDialog({
  open,
  image,
  onOpenChange,
  onDownload,
  onCopyLink,
  onUseAsReference,
  onUsePrompt,
  onRegenerate,
  onDelete,
}: ImagePreviewDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>图片预览</DialogTitle>
        </DialogHeader>

        {image && (
          <div className="space-y-4">
            {/* 大图显示 */}
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>

            {/* 操作按钮栏 */}
            <div className="flex gap-2 flex-wrap justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={onDownload}
                    >
                      <Download className="h-4 w-4" />
                      下载原图
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>下载此图片到本地</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? '已复制' : '复制链接'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>复制图片下载链接</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={onUseAsReference}
                    >
                      <ImageIcon className="h-4 w-4" />
                      作为参考图
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>上传为新图片生成的参考图</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={onUsePrompt}
                    >
                      <Zap className="h-4 w-4" />
                      使用提示词
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>使用原图片生成的提示词进行新一次生成</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={onRegenerate}
                    >
                      <RotateCw className="h-4 w-4" />
                      再次生成
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>使用相同参数重新生成此图片</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>删除此图片</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
