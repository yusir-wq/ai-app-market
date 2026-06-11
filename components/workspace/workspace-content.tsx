'use client'

import { Badge } from '@/components/ui/badge'
import type { ChatMessage, Model, Message } from '@/lib/mock-data'
import { modelCapabilities, recommendedPrompts, mockChatMessages, mockImageMessages } from '@/lib/mock-data'
import { Sparkles } from 'lucide-react'
import { ChatMessages } from '@/components/chat/chat-messages'

interface WorkspaceContentProps {
  model: Model | null
  messages: Message[]
  isLoading?: boolean
  onSelectPrompt: (prompt: string) => void
  insufficientPoints?: boolean
}

export function WorkspaceContent({ model, messages, isLoading, onSelectPrompt, insufficientPoints }: WorkspaceContentProps) {
  if (!model) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            欢迎使用 AI 应用广场
          </h2>
          <p className="text-muted-foreground text-sm">
            从左侧选择一个模型开始对话，支持聊天、图片生成和视频生成等多种能力。
          </p>
        </div>
      </div>
    )
  }

  const modelMessages = messages || (model.type === 'image' ? mockImageMessages[model.id] : mockChatMessages[model.id]) || []
  const capabilities = modelCapabilities[model.id] || []
  const prompts = recommendedPrompts[model.id] || []

  if (!modelMessages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4 text-3xl">
              {model.logo}
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{model.name}</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {model.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
          </div>



          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center mb-4">
              {model.type === 'image' ? '试试这些图片提示词' : '试试这些提示词'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => onSelectPrompt(prompt)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left cursor-pointer"
                >
                  <p className="text-sm text-foreground line-clamp-2">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ChatMessages messages={modelMessages} model={model} isLoading={isLoading} insufficientPoints={insufficientPoints} />
    </div>
  )
}
