'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { UploadSimple, X, FileAudio, FileVideo, FileImage, FileText, Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AgentUploadZoneProps {
  inputType: 'file' | 'text' | 'both'
  acceptedFiles?: string[]
  maxFileSize?: number // MB
  file: File | null
  text: string
  onFileChange: (file: File | null) => void
  onTextChange: (text: string) => void
  error?: string
}

const fileTypeIcons: Record<string, React.ReactNode> = {
  video: <FileVideo className="h-8 w-8 text-blue-500" />,
  audio: <FileAudio className="h-8 w-8 text-rose-500" />,
  image: <FileImage className="h-8 w-8 text-emerald-500" />,
  text: <FileText className="h-8 w-8 text-amber-500" />,
}

function getFileCategory(ext: string): string {
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) return 'video'
  if (['.mp3', '.wav', '.m4a', '.flac', '.aac'].includes(ext)) return 'audio'
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'].includes(ext)) return 'image'
  return 'text'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function AgentUploadZone({
  inputType,
  acceptedFiles,
  maxFileSize,
  file,
  text,
  onFileChange,
  onTextChange,
  error,
}: AgentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileChange(droppedFile)
      }
    },
    [onFileChange]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null
      onFileChange(selectedFile)
    },
    [onFileChange]
  )

  const acceptedExtensions = acceptedFiles?.join(',') || '*'
  const fileExt = file ? `.${file.name.split('.').pop()?.toLowerCase()}` : ''
  const fileCategory = file ? getFileCategory(fileExt) : 'text'

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        {/* 文件上传区 */}
        {(inputType === 'file' || inputType === 'both') && (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">
              上传文件
              {acceptedFiles && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({acceptedFiles.join('、')})
                </span>
              )}
              {maxFileSize && (
                <span className="text-xs text-muted-foreground ml-1">
                  最大 {maxFileSize}MB
                </span>
              )}
            </Label>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                )}
              >
                <UploadSimple className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-foreground mb-1">
                  拖拽文件到此处，或
                  <label className="text-primary cursor-pointer hover:underline mx-1">
                    点击上传
                    <Input
                      type="file"
                      accept={acceptedExtensions}
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                {acceptedFiles && (
                  <p className="text-xs text-muted-foreground">
                    支持 {acceptedFiles.join('、')} 格式
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/50">
                {fileTypeIcons[fileCategory] || fileTypeIcons.text}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onFileChange(null)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 文本输入区 */}
        {(inputType === 'text' || inputType === 'both') && (
          <div>
            <Label className="text-sm font-medium mb-2 block">输入内容</Label>
            <Textarea
              placeholder="请输入内容..."
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {text.length}/5000 字
            </p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 mt-3 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <Warning className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
