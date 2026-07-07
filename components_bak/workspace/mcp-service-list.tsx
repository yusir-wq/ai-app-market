'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MCPServiceCard } from './mcp-service-card'
import { useMCP } from '@/contexts/mcp-context'
import { useAuth } from '@/contexts/auth-context'
import { platformMCPServices, MCPService } from '@/lib/mcp-data'
import { Search } from 'lucide-react'

export function MCPServiceList() {
  const [searchQuery, setSearchQuery] = useState('')
  const { 
    setShowConfigModal, 
    setConfigModalService, 
    userMCPServices,
    setSelectedMCPServices,
    selectedMCPServices
  } = useMCP()
  const { isLoggedIn, setShowLoginModal } = useAuth()

  // 过滤平台服务
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return platformMCPServices
    }
    const query = searchQuery.toLowerCase()
    return platformMCPServices.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // 检查服务是否已配置
  const getServiceStatus = (serviceId: string): { status: 'enabled' | 'disabled' | 'not-configured', configuredService?: MCPService } => {
    const configuredService = userMCPServices.find(s => s.name === platformMCPServices.find(p => p.id === serviceId)?.name)
    if (!configuredService) {
      return { status: 'not-configured' }
    }
    return { status: configuredService.status, configuredService }
  }

  const handleServiceClick = (service: typeof platformMCPServices[0]) => {
    // 未登录检查
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    const { status, configuredService } = getServiceStatus(service.id)
    
    // 已启用服务直接选中
    if (status === 'enabled' && configuredService) {
      if (!selectedMCPServices.some(s => s.id === configuredService.id)) {
        setSelectedMCPServices([...selectedMCPServices, configuredService])
      }
      return
    }
    
    // 待配置或已关闭服务弹出配置窗口
    setConfigModalService(service)
    setShowConfigModal(true)
  }

  return (
    <>
      {/* 搜索框 */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索MCP服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 服务列表 */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {filteredServices.map((service) => {
            const { status } = getServiceStatus(service.id)
            return (
              <MCPServiceCard
                key={service.id}
                service={service}
                status={status}
                onClick={() => handleServiceClick(service)}
              />
            )
          })}
        </div>
      </ScrollArea>
    </>
  )
}
