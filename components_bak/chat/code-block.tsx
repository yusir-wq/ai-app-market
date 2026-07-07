'use client'

import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="bg-slate-950 rounded-lg overflow-hidden my-3 border border-slate-800">
      {/* 头部：语言标签 + 复制按钮 */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-medium text-slate-400 uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-slate-800"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-slate-400" />
          )}
        </Button>
      </div>

      {/* 代码内容 */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-xs font-mono text-slate-100 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  )
}
