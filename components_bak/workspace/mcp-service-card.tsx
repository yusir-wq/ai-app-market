'use client'

import { PlatformMCPService } from '@/lib/mcp-data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MCPServiceCardProps {
  service: PlatformMCPService
  status?: 'enabled' | 'disabled' | 'not-configured'
  onClick: () => void
}

export function MCPServiceCard({ service, status = 'not-configured', onClick }: MCPServiceCardProps) {
  const statusLabels = {
    'enabled': '已启用',
    'disabled': '已关闭',
    'not-configured': '待配置'
  }

  const statusVariants = {
    'enabled': 'default',
    'disabled': 'secondary',
    'not-configured': 'outline'
  } as const

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl cursor-pointer transition-colors',
        'hover:bg-accent'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon区域 */}
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium shrink-0">
          {service.icon}
        </div>
        
        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">
              {service.name}
            </span>
            <Badge 
              variant={statusVariants[status]}
              className="text-xs shrink-0"
            >
              {statusLabels[status]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  )
}
