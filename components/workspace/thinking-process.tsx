'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Brain, ChevronDown } from 'lucide-react'

interface ThinkingProcessProps {
  content: string
  defaultOpen?: boolean
}

export function ThinkingProcess({ content, defaultOpen = false }: ThinkingProcessProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // 截取首行作为预览
  const firstLine = content.split('\n')[0]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-3">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground h-7 px-2 w-full justify-start group"
        >
          <Brain className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{isOpen ? '收起思考过程' : firstLine}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ml-auto ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
          <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
            {content}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}