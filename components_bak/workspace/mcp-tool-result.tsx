'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MCPToolResult } from '@/lib/mcp-data'
import { ChevronDown, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MCPToolResultPanelProps {
  result: MCPToolResult
}

export function MCPToolResultPanel({ result }: MCPToolResultPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-muted/30 rounded-xl border border-border">
        <CollapsibleTrigger className="w-full p-3 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">whois历史信息 : get_whois_history</span>
            <Badge 
              variant={result.status === 'success' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {result.status === 'success' ? '成功' : '失败'}
            </Badge>
          </div>
          <ChevronDown 
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0">
            <Separator className="mb-3" />
            <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-auto max-h-[200px] font-mono">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}