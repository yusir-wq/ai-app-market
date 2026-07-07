'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MCPServiceSelector } from './mcp-service-selector'
import type { Model } from '@/lib/mock-data'
import {
  Send,
  Paperclip,
  X,
  Globe,
  Brain,
  Zap,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/auth-context'

interface ImageParams {
  ratio: 'auto' | '1:1' | '3:2' | '2:3' | '16:9' | '9:16'
  count: 1 | 2 | 4
  quality: 'auto' | 'high' | 'medium' | 'low'
  optimizePrompt: boolean
}

interface VideoParams {
  duration: 5 | 10 | 15 | 30 | 60
  ratio: '1:1' | '9:16' | '16:9'
  resolution: '720p' | '1080p' | '2k' | '4k'
  count: 1 | 2
  mode: 'fast' | 'quality'
}

interface InputAreaProps {
  model: Model | null
  onSendMessage?: (message: string, params?: ImageParams | VideoParams, referenceAssets?: any) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  onNavigate?: (page: string) => void
}

export function InputArea({ model, onSendMessage, inputValue: externalValue, onInputChange, onNavigate }: InputAreaProps) {
  const { isLoggedIn, setShowLoginModal } = useAuth()
  const [localInputValue, setLocalInputValue] = useState('')
  const [enableSearch, setEnableSearch] = useState(true)
  const [enableThinking, setEnableThinking] = useState(true)
  const [imageParams, setImageParams] = useState<ImageParams>({
    ratio: 'auto',
    count: 1,
    quality: 'auto',
    optimizePrompt: true,
  })
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [videoParams, setVideoParams] = useState<VideoParams>({
    duration: 5,
    ratio: '16:9',
    resolution: '1080p',
    count: 1,
    mode: 'quality',
  })
  const [referenceAssets, setReferenceAssets] = useState<{
    images?: string[]
    videos?: string[]
    audios?: string[]
  }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const inputValue = externalValue !== undefined ? externalValue : localInputValue
  const setInputValue = onInputChange || setLocalInputValue

  const handleSend = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    if (inputValue.trim() && model) {
      if (model.type === 'image') {
        onSendMessage?.(inputValue, imageParams, referenceImages)
      } else if (model.type === 'video') {
        onSendMessage?.(inputValue, videoParams, referenceAssets)
      } else {
        onSendMessage?.(inputValue)
      }
      if (onInputChange) {
        onInputChange('')
      } else {
        setLocalInputValue('')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 显示动态参数占位（根据模型类型）
  const showImageParams = model?.type === 'image'
  const showVideoParams = model?.type === 'video'
  const showChatParams = model?.type === 'chat'

  return (
    <div className="border-t border-border bg-background p-4 space-y-3">
      {/* 聊天模型参数栏 - 添加 px-[20%] 边距 */}
      {showChatParams && (
        <div className="px-[20%] flex items-center gap-2">
          {/* MCP服务按钮 - 新增 */}
          <MCPServiceSelector onNavigate={onNavigate} />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={enableSearch ? 'default' : 'outline'}
                  size="sm"
                  className={`gap-1.5 h-8 text-xs transition-all ${
                    enableSearch
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setEnableSearch(!enableSearch)}
                >
                  <Globe className="h-3.5 w-3.5" />
                  联网搜索
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                启用实时网络搜索功能
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={enableThinking ? 'default' : 'outline'}
                  size="sm"
                  className={`gap-1.5 h-8 text-xs transition-all ${
                    enableThinking
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setEnableThinking(!enableThinking)}
                >
                  <Brain className="h-3.5 w-3.5" />
                  深度思考
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                启用深度思考模式，响应时间更长但质量更高
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* 视频模型参数栏 - 添加 px-[20%] 边距 */}
      {showVideoParams && (
        <div className="px-[20%] space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            
            <Select value={videoParams.duration.toString()} onValueChange={(dur: any) => setVideoParams({ ...videoParams, duration: parseInt(dur) })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="时长" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5秒</SelectItem>
                <SelectItem value="10">10秒</SelectItem>
                <SelectItem value="15">15秒</SelectItem>
                <SelectItem value="30">30秒</SelectItem>
              </SelectContent>
            </Select>

            <Select value={videoParams.ratio} onValueChange={(ratio: any) => setVideoParams({ ...videoParams, ratio })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="比例" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="21:9">21:9</SelectItem>
              </SelectContent>
            </Select>

            <Select value={videoParams.resolution} onValueChange={(res: any) => setVideoParams({ ...videoParams, resolution: res })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="分辨率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>

            <Select value={videoParams.count.toString()} onValueChange={(cnt: any) => setVideoParams({ ...videoParams, count: parseInt(cnt) })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1个</SelectItem>
                <SelectItem value="2">2个</SelectItem>
                <SelectItem value="3">3个</SelectItem>
                <SelectItem value="4">4个</SelectItem>
                <SelectItem value="5">5个</SelectItem>
              </SelectContent>
            </Select>

            <Select value={videoParams.mode} onValueChange={(m: any) => setVideoParams({ ...videoParams, mode: m })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">快速</SelectItem>
                <SelectItem value="quality">高质量</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 参考素材显示 */}
          {(referenceAssets.images?.length || referenceAssets.videos?.length || referenceAssets.audios?.length) ? (
            <div className="space-y-2">
              {/* 参考图片 */}
              {referenceAssets.images && referenceAssets.images.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">参考图</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {referenceAssets.images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <img src={img} alt="Reference" className="w-full h-full object-cover" />
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              images: referenceAssets.images?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute -top-2 -right-2 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {(referenceAssets.images?.length || 0) < 9 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 p-0 text-xs"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        +
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">({referenceAssets.images.length}/9)</span>
                  </div>
                </div>
              )}

              {/* 参考视频 */}
              {referenceAssets.videos && referenceAssets.videos.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">参考视频</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {referenceAssets.videos.map((vid, idx) => (
                      <div key={`vid-${idx}`} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                        <span className="text-xs font-semibold">视</span>
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              videos: referenceAssets.videos?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute -top-2 -right-2 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {(referenceAssets.videos?.length || 0) < 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 p-0 text-xs"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        +
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">({referenceAssets.videos.length}/3)</span>
                  </div>
                </div>
              )}

              {/* 参考音频 */}
              {referenceAssets.audios && referenceAssets.audios.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">参考音频</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {referenceAssets.audios.map((aud, idx) => (
                      <div key={`aud-${idx}`} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                        <span className="text-xs font-semibold">音</span>
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              audios: referenceAssets.audios?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute -top-2 -right-2 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {(referenceAssets.audios?.length || 0) < 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 p-0 text-xs"
                        onClick={() => audioInputRef.current?.click()}
                      >
                        +
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">({referenceAssets.audios.length}/3)</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* 视频模型参考图片输入 */}
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const files = e.currentTarget.files
          if (files && (referenceAssets.images?.length || 0) < 9) {
            Array.from(files).forEach(file => {
              const reader = new FileReader()
              reader.onload = (event) => {
                const result = event.target?.result as string
                setReferenceAssets(prev => ({
                  ...prev,
                  images: [...(prev.images || []), result].slice(-9)
                }))
              }
              reader.readAsDataURL(file)
            })
          }
        }}
      />

      {/* 视频模型参考视频输入 */}
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept=".mp4,.webm,.mov"
        className="hidden"
        onChange={(e) => {
          const files = e.currentTarget.files
          if (files && (referenceAssets.videos?.length || 0) < 3) {
            Array.from(files).forEach(file => {
              const reader = new FileReader()
              reader.onload = (event) => {
                const result = event.target?.result as string
                setReferenceAssets(prev => ({
                  ...prev,
                  videos: [...(prev.videos || []), result].slice(-3)
                }))
              }
              reader.readAsDataURL(file)
            })
          }
        }}
      />

      {/* 视频模型参考音频输入 */}
      <input
        ref={audioInputRef}
        type="file"
        multiple
        accept=".mp3,.wav,.aac,.m4a"
        className="hidden"
        onChange={(e) => {
          const files = e.currentTarget.files
          if (files && (referenceAssets.audios?.length || 0) < 3) {
            Array.from(files).forEach(file => {
              const reader = new FileReader()
              reader.onload = (event) => {
                const result = event.target?.result as string
                setReferenceAssets(prev => ({
                  ...prev,
                  audios: [...(prev.audios || []), result].slice(-3)
                }))
              }
              reader.readAsDataURL(file)
            })
          }
        }}
      />
      {/* 图片模型参数栏 - 添加 px-[20%] 边距 */}
      {showImageParams && (
        <div className="px-[20%] space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            
            <Select value={imageParams.ratio} onValueChange={(ratio: any) => setImageParams({ ...imageParams, ratio })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="比例" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">自适应</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="2:3">2:3</SelectItem>
                <SelectItem value="3:2">3:2</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="21:9">21:9</SelectItem>
              </SelectContent>
            </Select>

            <Select value={imageParams.count.toString()} onValueChange={(count: any) => setImageParams({ ...imageParams, count: parseInt(count) })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1张</SelectItem>
                <SelectItem value="2">2张</SelectItem>
                <SelectItem value="3">3张</SelectItem>
                <SelectItem value="4">4张</SelectItem>
                <SelectItem value="4">5张</SelectItem>
              </SelectContent>
            </Select>

            <Select value={imageParams.quality} onValueChange={(quality: any) => setImageParams({ ...imageParams, quality })}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="质量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">自适应</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={imageParams.optimizePrompt ? 'secondary' : 'outline'}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setImageParams({ ...imageParams, optimizePrompt: !imageParams.optimizePrompt })}
            >
              <Zap className="h-3.5 w-3.5" />
              优化提示词
            </Button>
          </div>

          {/* 参考图预览 */}
          {referenceImages.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {referenceImages.map((img, idx) => (
                <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt="Reference" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setReferenceImages(referenceImages.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {referenceImages.length < 9 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 w-12 p-0 text-xs"
                  onClick={() => imageInputRef.current?.click()}
                >
                  +
                </Button>
              )}
              <span className="text-xs text-muted-foreground">({referenceImages.length}/9)</span>
            </div>
          )}

        </div>
      )}

      {/* 输入框区域 - 左右各留20%边距 */}
      <div className="relative px-[20%]">
        <div className="flex items-end gap-2 bg-muted/50 rounded-xl border border-border p-3">
          {/* 文件上传按钮 - 仅聊天模型且非Gemini 3 Flash时显示 */}
          {model?.type === 'chat' && model.name !== 'Gemini 3 Flash' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <div className="space-y-1">
                    <p>支持格式: JPG, PNG, PDF</p>
                    <p>最多上传 10 个文件</p>
                    <p>单个文件最大 20MB</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) => {
              const files = e.currentTarget.files
              if (files) {
                console.log('Files uploaded:', Array.from(files).map(f => f.name))
              }
            }}
          />

          {/* 图片模型上传区 */}
          {showImageParams && (
            <div className="flex items-start gap-2 flex-wrap mb-2">
              {referenceImages.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-background">
                  <img src={img} alt="Reference" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setReferenceImages(referenceImages.filter((_, i) => i !== idx))}
                    className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {referenceImages.length < 9 && (
                <label className="w-16 h-16 inline-flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors flex-shrink-0">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.currentTarget.files
                      if (files && referenceImages.length < 9) {
                        Array.from(files).forEach(file => {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const result = event.target?.result as string
                            setReferenceImages(prev => [...prev, result].slice(-9))
                          }
                          reader.readAsDataURL(file)
                        })
                      }
                      e.currentTarget.value = ''
                    }}
                  />
                  <div className="flex flex-col items-center justify-center text-center gap-1">
                    <span className="text-lg font-semibold text-muted-foreground">+</span>
                  </div>
                </label>
              )}
            </div>
          )}

          {/* 视频模型上传区 */}
          {showVideoParams && (
            <>
              {/* Gemini 3 Flash 统一上传区 */}
              {model?.name === 'Gemini 3 Flash' ? (
                <div className="mb-2">
                  <div className="flex items-start gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border">
                    {/* 图片预览 */}
                    {referenceAssets.images && referenceAssets.images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-background">
                        <img src={img} alt="Reference" className="w-full h-full object-cover" />
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              images: referenceAssets.images?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}

                    {/* 音频预览 */}
                    {referenceAssets.audios && referenceAssets.audios.map((audio, idx) => (
                      <div key={`audio-${idx}`} className="relative px-3 py-2 rounded-lg border border-border bg-muted text-xs flex items-center gap-2 flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">音频 {idx + 1}</span>
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              audios: referenceAssets.audios?.filter((_, i) => i !== idx),
                            })
                          }
                          className="ml-1"
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}

                    {/* 统一上传按钮 */}
                    <label className="w-16 h-16 inline-flex items-center justify-center rounded-lg border border-dashed border-border bg-background hover:bg-muted/50 cursor-pointer transition-colors flex-shrink-0">
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.mp3,.wav,.aac,.m4a"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.currentTarget.files
                          if (files) {
                            Array.from(files).forEach(file => {
                              const isImage = file.type.startsWith('image/')
                              const isAudio = file.type.startsWith('audio/')

                              const reader = new FileReader()
                              reader.onload = (event) => {
                                const result = event.target?.result as string

                                if (isImage && (referenceAssets.images?.length || 0) < 9) {
                                  setReferenceAssets(prev => ({
                                    ...prev,
                                    images: [...(prev.images || []), result].slice(-9)
                                  }))
                                } else if (isAudio && (referenceAssets.audios?.length || 0) < 3) {
                                  setReferenceAssets(prev => ({
                                    ...prev,
                                    audios: [...(prev.audios || []), result].slice(-3)
                                  }))
                                }
                              }
                              reader.readAsDataURL(file)
                            })
                          }
                          e.currentTarget.value = ''
                        }}
                      />
                      <span className="text-lg font-semibold text-muted-foreground">+</span>
                    </label>
                  </div>
                </div>
              ) : (
                /* 其他视频模型的左右分布上传区 */
                <div className="flex gap-4 mb-2">
                  {/* 参考图片上传 */}
                  <div className="flex-1 flex items-start gap-2 flex-wrap">
                    {referenceAssets.images && referenceAssets.images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-background">
                        <img src={img} alt="Reference" className="w-full h-full object-cover" />
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              images: referenceAssets.images?.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute -top-1 -right-1 bg-destructive rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {(referenceAssets.images?.length || 0) < 9 && (
                      <label className="w-16 h-16 inline-flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors flex-shrink-0">
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.currentTarget.files
                            if (files && (referenceAssets.images?.length || 0) < 9) {
                              Array.from(files).forEach(file => {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  const result = event.target?.result as string
                                  setReferenceAssets(prev => ({
                                    ...prev,
                                    images: [...(prev.images || []), result].slice(-9)
                                  }))
                                }
                                reader.readAsDataURL(file)
                              })
                            }
                            e.currentTarget.value = ''
                          }}
                        />
                        <span className="text-lg font-semibold text-muted-foreground">+</span>
                      </label>
                    )}
                  </div>

                  {/* 参考音频上传 */}
                  <div className="flex-1 flex items-start gap-2 flex-wrap">
                    {referenceAssets.audios && referenceAssets.audios.map((audio, idx) => (
                      <div key={`audio-${idx}`} className="relative px-3 py-2 rounded-lg border border-border bg-muted text-xs flex items-center gap-2 flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">音频 {idx + 1}</span>
                        <button
                          onClick={() =>
                            setReferenceAssets({
                              ...referenceAssets,
                              audios: referenceAssets.audios?.filter((_, i) => i !== idx),
                            })
                          }
                          className="ml-1"
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ))}
                    {(referenceAssets.audios?.length || 0) < 3 && (
                      <label className="px-3 py-2 inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors flex-shrink-0 text-xs">
                        <input
                          type="file"
                          multiple
                          accept=".mp3,.wav,.aac,.m4a"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.currentTarget.files
                            if (files && (referenceAssets.audios?.length || 0) < 3) {
                              Array.from(files).forEach(file => {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  const result = event.target?.result as string
                                  setReferenceAssets(prev => ({
                                    ...prev,
                                    audios: [...(prev.audios || []), result].slice(-3)
                                  }))
                                }
                                reader.readAsDataURL(file)
                              })
                            }
                            e.currentTarget.value = ''
                          }}
                        />
                        <span className="text-lg font-semibold text-muted-foreground">+</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <textarea
            placeholder={model ? `向 ${model.name} 发送消息... (Shift+Enter 换行)` : '请先选择一个模型'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!model}
            rows={1}
            className="flex-1 min-h-[24px] max-h-[120px] resize-none bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 120) + 'px'
            }}
          />

          <Button
            size="icon"
            className="shrink-0 h-8 w-8 rounded-lg"
            disabled={!model || !inputValue.trim()}
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
