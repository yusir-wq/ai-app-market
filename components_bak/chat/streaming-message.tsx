'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Square } from 'lucide-react'

interface StreamingMessageProps {
  modelLogo: string
  modelName: string
  onStop?: () => void
}

export function StreamingMessage({ modelLogo, modelName, onStop }: StreamingMessageProps) {
  const [displayedText, setDisplayedText] = useState('')
  const fullText = '这是一个流式输出演示。我正在一个字一个字地生成这条消息，模拟真实的 AI 模型输出体验。在实际应用中，消息会通过 API 流式接收，实现更加自然流畅的对话体验。'

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const isComplete = displayedText.length === fullText.length

  return (
    <div className="flex gap-3 mb-4">
      <div className="text-2xl flex-shrink-0">{modelLogo}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium text-foreground">{modelName}</p>
          {!isComplete && (
            <span className="text-xs text-muted-foreground">正在思考...</span>
          )}
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground leading-relaxed">
          <p>{displayedText}</p>
          {!isComplete && (
            <span className="inline-block w-1.5 h-5 bg-foreground ml-1 animate-pulse" />
          )}
        </div>
        {!isComplete && (
          <Button
            size="sm"
            variant="outline"
            className="mt-3 gap-2 h-8 text-xs"
            onClick={onStop}
          >
            <Square className="h-3 w-3" />
            停止生成
          </Button>
        )}
      </div>
    </div>
  )
}
