'use client'

import { useEffect, useRef, useState } from 'react'
import { UserMessage } from './user-message'
import { AIMessage } from './ai-message'
import { StreamingMessage } from './streaming-message'
import { ImagePreviewDialog } from './image-preview-dialog'
import { VideoPreviewDialog } from './video-preview-dialog'
import { VideoCard } from './video-card'
import { MCPMessageView } from '@/components/workspace/mcp-message-view'
import type { Model, Message } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
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

interface ChatMessagesProps {
  messages: Message[]
  model: Model | null
  isLoading?: boolean
  insufficientPoints?: boolean
}

export function ChatMessages({ messages, model, isLoading, insufficientPoints }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewImageOpen, setPreviewImageOpen] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">{model?.logo}</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {model?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {model?.description}
          </p>
        </div>
      </div>
    )
  }

  // 获取最后一条消息的 ID
  const lastMessageId = messages[messages.length - 1]?.id

  return (
    <div className="space-y-6 py-6">
      {messages.map((message, index) => {
        const isLastMessage = message.id === lastMessageId
        const showInsufficientPoints = isLastMessage && insufficientPoints && model

        return (
          <div key={message.id}>
            {message.contentType === 'image' ? (
              <div>
                {message.role === 'user' && 'userPrompt' in message && (
                  <div className="mb-4 flex justify-end px-[20%]">
                    <div className="max-w-[80%] w-fit">
                      <p className="text-sm text-foreground mb-2">{message.userPrompt}</p>
                      {'parameters' in message && message.parameters && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.ratio}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.count}张
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.quality}
                          </Badge>
                        </div>
                      )}
                      {'referenceImages' in message && message.referenceImages?.length ? (
                        <div className="flex gap-2">
                          {message.referenceImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="ref"
                              className="w-10 h-10 rounded object-cover"
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && 'images' in message && message.images && (
                  <div className="px-[20%]">
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">{model?.logo}</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          {model?.name || 'AI'}
                        </p>
                        <ImageGrid
                          images={message.images}
                          isExpired={('isExpired' in message) ? message.isExpired : false}
                          onImageClick={(img) => {
                            setPreviewImage(img)
                            setPreviewImageOpen(true)
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {isLastMessage
                            ? message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                            : message.timestamp.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                          }
                        </p>
                        {/* 智点不足提示 */}
                        {showInsufficientPoints && (
                          <p className="text-sm text-red-600 mt-2">
                            deepseek-v4-pro需要更多智点来回答此请求
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : message.contentType === 'video' ? (
              <div>
                {message.role === 'user' && 'userPrompt' in message && (
                  <div className="mb-4 flex justify-end px-[20%]">
                    <div className="max-w-[80%] w-fit">
                      <p className="text-sm text-foreground mb-2">{message.userPrompt}</p>
                      {'parameters' in message && message.parameters && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.duration}s
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.ratio}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.resolution}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {message.parameters.count}个
                          </Badge>
                        </div>
                      )}
                      {'referenceAssets' in message && message.referenceAssets && (
                        <div className="flex gap-2 mt-2">
                          {message.referenceAssets.images?.map((img, idx) => (
                            <img
                              key={`img-${idx}`}
                              src={img}
                              alt="ref"
                              className="w-10 h-10 rounded object-cover"
                            />
                          ))}
                          {message.referenceAssets.videos?.map((vid, idx) => (
                            <div
                              key={`vid-${idx}`}
                              className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-semibold"
                            >
                              视
                            </div>
                          ))}
                          {message.referenceAssets.audios?.map((aud, idx) => (
                            <div
                              key={`aud-${idx}`}
                              className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-semibold"
                            >
                              音
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && 'videos' in message && message.videos && (
                  <div className="px-[20%]">
                    <div className="flex gap-3">
                      <div className="text-2xl flex-shrink-0">{model?.logo}</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          {model?.name || 'AI'}
                        </p>
                        <VideoGrid
                          videos={message.videos}
                          duration={'duration' in message ? message.duration : '0:05'}
                          resolution={'resolution' in message ? message.resolution : '1080p'}
                          isExpired={('isExpired' in message) ? message.isExpired : false}
                          onVideoClick={(vid) => {
                            setPreviewVideo(vid)
                            setPreviewVideoOpen(true)
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {isLastMessage
                            ? message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                            : message.timestamp.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                          }
                        </p>
                        {/* 智点不足提示 */}
                        {showInsufficientPoints && (
                          <p className="text-sm text-red-600 mt-2">
                            deepseek-v4-pro需要更多智点来回答此请求
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : message.role === 'user' ? (
              <div className="px-[20%]">
                <UserMessage message={message as any} isLastMessage={isLastMessage} />
              </div>
            ) : (
              <div className="px-[20%]">
                <AIMessage
                  message={message as any}
                  modelName={model?.name || 'AI'}
                  modelLogo={model?.logo || '🤖'}
                  isLastMessage={isLastMessage}
                />
                {/* 聊天模型智点不足提示 */}
                {showInsufficientPoints && (
                  <p className="text-sm text-red-600 mt-2 ml-10">
                    deepseek-v4-pro需要更多智点来回答此请求
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}

      {isLoading && model?.type === 'image' && (
        <div className="px-[20%]">
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">{model?.logo}</div>
            <div>
              <p className="text-sm text-muted-foreground">正在生成图片...</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && model?.type === 'video' && (
        <div className="px-[20%]">
          <div className="flex gap-3">
            <div className="text-2xl flex-shrink-0">{model?.logo}</div>
            <div>
              <p className="text-sm text-muted-foreground">正在生成视频...</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && model?.type !== 'image' && model?.type !== 'video' && (
        <div className="px-[20%]">
          <StreamingMessage
            modelLogo={model?.logo || '🤖'}
            modelName={model?.name || 'AI'}
            onStop={() => {}}
          />
        </div>
      )}

      <div ref={messagesEndRef} />

      <ImagePreviewDialog
        open={previewImageOpen}
        image={previewImage}
        onOpenChange={setPreviewImageOpen}
        onDownload={() => {
          if (previewImage) {
            const link = document.createElement('a')
            link.href = previewImage
            link.download = `image-${Date.now()}.jpg`
            link.click()
          }
        }}
        onCopyLink={() => {
          if (previewImage) {
            navigator.clipboard.writeText(previewImage)
          }
        }}
        onUseAsReference={() => {
          console.log('Use as reference:', previewImage)
          setPreviewImageOpen(false)
        }}
        onUsePrompt={() => {
          console.log('Use prompt from image:', previewImage)
          setPreviewImageOpen(false)
        }}
        onRegenerate={() => {
          console.log('Regenerate with same params:', previewImage)
          setPreviewImageOpen(false)
        }}
        onDelete={() => {
          console.log('Delete image:', previewImage)
          setPreviewImageOpen(false)
        }}
      />

      <VideoPreviewDialog
        open={previewVideoOpen}
        video={previewVideo}
        onOpenChange={setPreviewVideoOpen}
        onDownload={() => {
          if (previewVideo) {
            const link = document.createElement('a')
            link.href = previewVideo
            link.download = `video-${Date.now()}.mp4`
            link.click()
          }
        }}
        onCopyLink={() => {
          if (previewVideo) {
            navigator.clipboard.writeText(previewVideo)
          }
        }}
        onUsePrompt={() => {
          console.log('Use prompt from video:', previewVideo)
          setPreviewVideoOpen(false)
        }}
        onRegenerate={() => {
          console.log('Regenerate video:', previewVideo)
          setPreviewVideoOpen(false)
        }}
        onDelete={() => {
          console.log('Delete video:', previewVideo)
          setPreviewVideoOpen(false)
        }}
      />
    </div>
  )
}

// 图片网格组件
function ImageGrid({
  images,
  onImageClick,
  isExpired,
}: {
  images: string[]
  onImageClick?: (image: string) => void
  isExpired?: boolean
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const cols = images.length === 1 ? 'grid-cols-1 max-w-sm' : images.length === 2 ? 'grid-cols-2 max-w-md' : 'grid-cols-2 max-w-lg'

  if (isExpired) {
    return (
      <div className="space-y-2">
        <div className={`grid ${cols} gap-3`}>
          {images.map((image, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg aspect-square bg-muted border border-dashed border-muted-foreground/30 flex items-center justify-center"
            >
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">图片已失效</div>
                <div className="text-xs text-muted-foreground">资源已过期</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          图片地址有效期为24小时，请及时<span className="font-semibold text-foreground">【下载图片】</span>到本地。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className={`grid ${cols} gap-3`}>
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg aspect-square bg-muted cursor-pointer"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => onImageClick?.(image)}
          >
            <img src={image} alt="Generated" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${hoveredIdx === idx ? 'opacity-40' : 'opacity-0'}`} />

            {hoveredIdx === idx && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-2 flex-wrap justify-center p-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onImageClick?.(image)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        查看图片
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            const link = document.createElement('a')
                            link.href = image
                            link.download = `image-${Date.now()}.jpg`
                            link.click()
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        下载原图
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(image)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        复制链接
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Use as reference:', image)
                          }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        作为参考图
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Use prompt:', image)
                          }}
                        >
                          <Zap className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        使用提示词
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Regenerate:', image)
                          }}
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        再次生成
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Delete:', image)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        删除
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 有效期提示 */}
      <p className="text-xs text-muted-foreground">
        图片地址有效期为24小时，请及时
        <button
          onClick={() => {
            images.forEach((image, idx) => {
              const link = document.createElement('a')
              link.href = image
              link.download = `image-${Date.now()}-${idx}.jpg`
              link.click()
            })
          }}
          className="ml-1 mr-1 text-foreground hover:text-primary underline transition-colors"
        >
          【下载图片】
        </button>
        到本地。
      </p>
    </div>
  )
}

// 视频网格组件
function VideoGrid({
  videos,
  duration = '0:05',
  resolution = '1080p',
  onVideoClick,
  isExpired,
}: {
  videos: string[]
  duration?: string
  resolution?: string
  onVideoClick?: (video: string) => void
  isExpired?: boolean
}) {
  const cols = videos.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-2 max-w-lg'

  if (isExpired) {
    return (
      <div className="space-y-2">
        <div className={`grid ${cols} gap-3`}>
          {videos.map((video, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-lg aspect-video bg-muted border border-dashed border-muted-foreground/30 flex items-center justify-center"
            >
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">视频已失效</div>
                <div className="text-xs text-muted-foreground">资源已过期</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          视频地址有效期为24小时，请及时<span className="font-semibold text-foreground">【下载视频】</span>到本地。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className={`grid ${cols} gap-3`}>
        {videos.map((video, idx) => (
          <VideoCard
            key={idx}
            video={video}
            duration={duration}
            resolution={resolution}
            onPlay={() => onVideoClick?.(video)}
            onDownload={() => {
              const link = document.createElement('a')
              link.href = video
              link.download = `video-${Date.now()}.mp4`
              link.click()
            }}
            onCopyLink={() => {
              navigator.clipboard.writeText(video)
            }}
            onUsePrompt={() => {
              console.log('Use prompt from video:', video)
            }}
            onRegenerate={() => {
              console.log('Regenerate video:', video)
            }}
            onDelete={() => {
              console.log('Delete video:', video)
            }}
          />
        ))}
      </div>
      
      {/* 有效期提示 */}
      <p className="text-xs text-muted-foreground">
        视频地址有效期为24小时，请及时
        <button
          onClick={() => {
            videos.forEach((video, idx) => {
              const link = document.createElement('a')
              link.href = video
              link.download = `video-${Date.now()}-${idx}.mp4`
              link.click()
            })
          }}
          className="ml-1 mr-1 text-foreground hover:text-primary underline transition-colors"
        >
          【下载视频】
        </button>
        到本地。
      </p>
    </div>
  )
}
