'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import {
  MCPService,
  PlatformMCPService,
  mockUserMCPServices,
} from '@/lib/mcp-data'

// MCP上下文类型定义（重构后）
interface MCPContextType {
  // 用户配置的MCP服务列表
  userMCPServices: MCPService[]
  setUserMCPServices: (services: MCPService[]) => void
  
  // 当前选中的MCP服务（用于对话时调用）
  selectedMCPServices: MCPService[]
  setSelectedMCPServices: (services: MCPService[]) => void
  
  // 快速创建/编辑弹窗状态
  showQuickCreateModal: boolean
  setShowQuickCreateModal: (show: boolean) => void
  editingService: MCPService | null
  setEditingService: (service: MCPService | null) => void
  
  // 快速配置弹窗状态（MCP市场添加时使用）
  showQuickConfigModal: boolean
  setShowQuickConfigModal: (show: boolean) => void
  quickConfigService: PlatformMCPService | null
  setQuickConfigService: (service: PlatformMCPService | null) => void
  
  // 服务详情弹窗状态
  showDetailModal: boolean
  setShowDetailModal: (show: boolean) => void
  detailService: PlatformMCPService | null
  setDetailService: (service: PlatformMCPService | null) => void
  
  // 服务操作方法
  addService: (service: MCPService) => void
  updateService: (id: string, service: Partial<MCPService>) => void
  deleteService: (id: string) => void
  toggleServiceStatus: (id: string) => void
  
  // 检查服务是否已添加
  isServiceAdded: (platformServiceId: string) => boolean
  
  // MCP总开关状态
  mcpEnabled: boolean
  setMcpEnabled: (enabled: boolean) => void
}

// 创建上下文
const MCPContext = createContext<MCPContextType | undefined>(undefined)

// Provider组件
export function MCPProvider({ children }: { children: ReactNode }) {
  // 用户配置的MCP服务列表
  const [userMCPServices, setUserMCPServices] = useState<MCPService[]>(mockUserMCPServices)
  
  // 当前选中的MCP服务（用于对话时调用）
  const [selectedMCPServices, setSelectedMCPServices] = useState<MCPService[]>([])
  
  // 快速创建/编辑弹窗状态
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false)
  const [editingService, setEditingService] = useState<MCPService | null>(null)
  
  // 快速配置弹窗状态（MCP市场添加时使用）
  const [showQuickConfigModal, setShowQuickConfigModal] = useState(false)
  const [quickConfigService, setQuickConfigService] = useState<PlatformMCPService | null>(null)
  
  // 服务详情弹窗状态
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailService, setDetailService] = useState<PlatformMCPService | null>(null)
  
  // 添加服务
  const addService = useCallback((service: MCPService) => {
    setUserMCPServices(prev => [...prev, service])
  }, [])
  
  // 更新服务
  const updateService = useCallback((id: string, updates: Partial<MCPService>) => {
    setUserMCPServices(prev =>
      prev.map(service =>
        service.id === id
          ? { ...service, ...updates, updatedAt: new Date() }
          : service
      )
    )
  }, [])
  
  // 删除服务
  const deleteService = useCallback((id: string) => {
    setUserMCPServices(prev => prev.filter(service => service.id !== id))
    // 同时从选中列表中移除
    setSelectedMCPServices(prev => prev.filter(service => service.id !== id))
  }, [])
  
  // 启用/关闭服务
  const toggleServiceStatus = useCallback((id: string) => {
    setUserMCPServices(prev =>
      prev.map(service =>
        service.id === id
          ? {
              ...service,
              status: service.status === 'enabled' ? 'disabled' : 'enabled',
              updatedAt: new Date(),
            }
          : service
      )
    )
  }, [])
  
  // 检查服务是否已添加（用于MCP市场显示"已添加"标签）
  const isServiceAdded = useCallback((platformServiceId: string) => {
    return userMCPServices.some(service => 
      service.englishName === platformServiceId || service.id.includes(platformServiceId)
    )
  }, [userMCPServices])
  
  // MCP总开关状态
  const [mcpEnabled, setMcpEnabled] = useState(true)
  
  const value: MCPContextType = {
    userMCPServices,
    setUserMCPServices,
    selectedMCPServices,
    setSelectedMCPServices,
    showQuickCreateModal,
    setShowQuickCreateModal,
    editingService,
    setEditingService,
    showQuickConfigModal,
    setShowQuickConfigModal,
    quickConfigService,
    setQuickConfigService,
    showDetailModal,
    setShowDetailModal,
    detailService,
    setDetailService,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    isServiceAdded,
    mcpEnabled,
    setMcpEnabled,
  }
  
  return (
    <MCPContext.Provider value={value}>
      {children}
    </MCPContext.Provider>
  )
}

// Hook
export function useMCP() {
  const context = useContext(MCPContext)
  if (context === undefined) {
    throw new Error('useMCP must be used within a MCPProvider')
  }
  return context
}