'use client'

import { MCPMessageContent } from '@/lib/mcp-data'
import { MCPToolResultPanel } from './mcp-tool-result'
import { MarkdownContent } from '@/components/chat/markdown-content'

interface MCPMessageViewProps {
  content: MCPMessageContent
}

export function MCPMessageView({ content }: MCPMessageViewProps) {
  return (
    <div className="space-y-4">
      {/* 工具调用结果 - 折叠面板 */}
      {content.toolResults && content.toolResults.length > 0 && (
        <div className="space-y-2">
          {content.toolResults.map(result => (
            <MCPToolResultPanel key={result.id} result={result} />
          ))}
        </div>
      )}

      {/* 最终回复 */}
      <div className="bg-card rounded-xl border py-4 px-4">
        <MarkdownContent content={content.finalResponse} />
      </div>
    </div>
  )
}
