'use client'

import { X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  id: string
  file: File
  url: string
  name: string
  size: number
  isImage: boolean
}

/** 格式化文件大小 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** 获取文件格式名 */
function getFormat(name: string): string {
  const dot = name.lastIndexOf('.')
  if (dot === -1) return '--'
  return name.slice(dot + 1).toUpperCase()
}

interface AttachmentPreviewProps {
  files: UploadedFile[]
  onRemove: (id: string) => void
}

export function AttachmentPreview({ files, onRemove }: AttachmentPreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      {files.map(f => (
        <div
          key={f.id}
          className={cn(
            'relative group shrink-0',
            f.isImage
              ? 'w-16 h-16 rounded-lg border border-border'
              : 'h-16 flex items-center gap-2 px-2.5 rounded-lg border border-border bg-white dark:bg-zinc-800 max-w-[240px]'
          )}
        >
          {/* 删除按钮 */}
          <button
            onClick={() => onRemove(f.id)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm hover:bg-foreground/80 z-10"
          >
            <X className="h-3 w-3" />
          </button>

          {f.isImage ? (
            // 图片缩略图
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img
                src={f.url}
                alt={f.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // 文档信息
            <>
              <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {getFormat(f.name)} · {formatSize(f.size)}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

/** 从 FileList 创建 UploadedFile[] */
export function buildUploadedFiles(fileList: FileList): UploadedFile[] {
  return Array.from(fileList).map(file => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    name: file.name,
    size: file.size,
    isImage: file.type.startsWith('image/'),
  }))
}
