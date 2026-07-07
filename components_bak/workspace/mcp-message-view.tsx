'use client'

import { MCPMessageContent } from '@/lib/mcp-data'
import { MCPToolResultPanel } from './mcp-tool-result'
import { MarkdownContent } from '@/components/chat/markdown-content'
import { Brain, Lightbulb } from 'lucide-react'

interface MCPMessageViewProps {
  content: MCPMessageContent
}

export function MCPMessageView({ content }: MCPMessageViewProps) {
  return (
    <div className="space-y-4">
      {/* 思考过程 */}
      {content.thinkingProcess && content.thinkingProcess.length > 0 && (
        <div className="bg-muted/50 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">调用前思考过程</span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {content.thinkingProcess.map(t => t.content).join('\n')}
          </div>
        </div>
      )}

      {/* whois历史信息 : get_whois_history - 折叠面板 */}
      {content.toolResults && content.toolResults.length > 0 && (
        <div className="space-y-2">
          {content.toolResults.map(result => (
            <MCPToolResultPanel key={result.id} result={result} />
          ))}
        </div>
      )}

      {/* 整理参数信息 */}
      {content.organizedInfo && (
        <div className="bg-muted/30 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">整理参数信息</span>
          </div>
          <div className="text-sm text-foreground">
            {content.organizedInfo}
          </div>
        </div>
      )}

      {/* 最终回复 */}
      <div className="bg-card rounded-xl border py-4 px-4">
        <MarkdownContent content={content.finalResponse} />
      </div>
    </div>
  )
}