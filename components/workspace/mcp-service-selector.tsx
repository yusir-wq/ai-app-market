'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMCP } from '@/contexts/mcp-context'
import { Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MCPServiceSelectorProps {
  onNavigate?: (page: string) => void
  /** 是否为图标模式（工具栏内使用，仅显示图标，点击触发） */
  iconOnly?: boolean
}

export function MCPServiceSelector({ onNavigate, iconOnly = false }: MCPServiceSelectorProps) {
  const {
    userMCPServices,
    selectedMCPServices,
    setSelectedMCPServices,
    mcpEnabled,
    setMcpEnabled,
  } = useMCP()
  
  // Popover打开状态
  const [open, setOpen] = useState(false)
  // 延迟关闭的定时器
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // 已启用的MCP服务列表
  const enabledServices = userMCPServices.filter(s => s.status === 'enabled')
  
  // 已选择的服务数量
  const selectedCount = selectedMCPServices.length
  
  // 处理MCP总开关切换
  const handleMCPToggle = useCallback((enabled: boolean) => {
    setMcpEnabled(enabled)
    toast.success(enabled ? 'MCP服务已启用' : 'MCP服务已停用')
  }, [setMcpEnabled])
  
  // 处理鼠标进入按钮（非 iconOnly 模式使用 hover）
  const handleMouseEnter = useCallback(() => {
    if (iconOnly) return
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpen(true)
  }, [iconOnly])
  
  // 处理鼠标离开（延迟关闭）
  const handleMouseLeave = useCallback(() => {
    if (iconOnly) return
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, 200)
  }, [iconOnly])
  
  // 处理鼠标进入弹窗内容（取消关闭）
  const handleContentMouseEnter = useCallback(() => {
    if (iconOnly) return
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [iconOnly])
  
  // 处理鼠标离开弹窗内容
  const handleContentMouseLeave = useCallback(() => {
    if (iconOnly) return
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, 200)
  }, [iconOnly])
  
  // 处理服务选择
  const handleServiceToggle = useCallback((serviceId: string) => {
    // MCP未启用时不可操作
    if (!mcpEnabled) return
    
    const service = enabledServices.find(s => s.id === serviceId)
    if (!service) return
    
    if (selectedMCPServices.some(s => s.id === serviceId)) {
      setSelectedMCPServices(selectedMCPServices.filter(s => s.id !== serviceId))
    } else {
      setSelectedMCPServices([...selectedMCPServices, service])
    }
  }, [mcpEnabled, enabledServices, selectedMCPServices, setSelectedMCPServices])
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {iconOnly ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              "h-8 w-8 relative",
              mcpEnabled && selectedCount > 0 && "text-primary"
            )}
            onClick={() => setOpen(prev => !prev)}
          >
            <Puzzle className="h-4 w-4" />
            {mcpEnabled && selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-0.5">
                {selectedCount}
              </span>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-1.5 h-8 text-xs transition-all",
              mcpEnabled && selectedCount > 0 && "border-primary bg-primary/5"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Puzzle className="h-3.5 w-3.5" />
            MCP服务
            {mcpEnabled && selectedCount > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {selectedCount}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-72 p-0"
        align="start"
        side="top"
        sideOffset={8}
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
      >
        {/* 标题区域：选择MCP服务（x） + 开关 */}
        <div className="p-3 border-b flex items-center justify-between">
          <p className="text-sm font-medium">选择MCP服务（{selectedCount}）</p>
          <Switch 
            checked={mcpEnabled} 
            onCheckedChange={handleMCPToggle}
            className="scale-90"
          />
        </div>
        
        {enabledServices.length > 0 ? (
          <ScrollArea className="h-[240px]">
            <div className="p-2 space-y-1">
              {enabledServices.map((service) => {
                const isSelected = selectedMCPServices.some(s => s.id === service.id)
                return (
                  <div
                    key={service.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg transition-all",
                      mcpEnabled 
                        ? "hover:bg-muted/50 cursor-pointer" 
                        : "opacity-50 cursor-not-allowed",
                      !mcpEnabled && "pointer-events-none"
                    )}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={!mcpEnabled}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{service.name}</span>
                      {isSelected && mcpEnabled && (
                        <span className="text-xs text-muted-foreground shrink-0">启用中</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">暂无已启用的MCP服务</p>
            {onNavigate && (
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setOpen(false)
                  onNavigate('mcp-center')
                }}
              >
                前往MCP服务管理
              </Button>
            )}
          </div>
        )}
        
        {/* 底部按钮：MCP管理 */}
        <div className="p-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              setOpen(false)
              onNavigate?.('mcp-center')
            }}
          >
            MCP管理
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
