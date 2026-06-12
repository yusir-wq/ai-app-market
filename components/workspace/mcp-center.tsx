'use client'

import { useState, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'
import { useMCP } from '@/contexts/mcp-context'
import { MCPService, PlatformMCPService, platformMCPServices, categories, MCPCategory } from '@/lib/mcp-data'
import { Trash2, Plus, Search, ExternalLink, Pencil, MoreHorizontal, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MCPCenterProps {
  activeTab: 'my' | 'market'
  onTabChange: (tab: 'my' | 'market') => void
  onBack: () => void
}

export interface MCPCenterHandle {
  openContactModal: () => void
}

// 我的MCP服务卡片组件
function MyMCPServiceCard({
  service,
  onDelete,
  onEdit,
  onCheckAuth,
  onDetail,
}: {
  service: MCPService
  onDelete: () => void
  onEdit: () => void
  onCheckAuth: () => void
  onDetail: () => void
}) {
  const [isChecking, setIsChecking] = useState(false)

  // 处理授权状态点击
  const handleAuthClick = async () => {
    setIsChecking(true)
    await onCheckAuth()
    setIsChecking(false)
  }

  // 获取授权状态显示
  const getAuthStatusDisplay = () => {
    if (isChecking) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>检测中</span>
        </div>
      )
    }
    if (service.authStatus === 'authorized') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>已授权</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-600">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span>未授权</span>
      </div>
    )
  }

  // 获取tooltip内容
  const getTooltipContent = () => {
    if (service.authStatus === 'authorized') {
      return 'MCP服务正常使用时显示"已授权"。点击可获取MCP服务最新状态'
    }
    return '服务已下架时，显示"未授权"。点击可获取MCP服务最新状态'
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-3 md:p-4">
        <div className="absolute right-2 md:right-3 top-2 md:top-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                title="更多"
              >
                <MoreHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                移除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer" onClick={handleAuthClick}>
                  {getAuthStatusDisplay()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipContent()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pr-16 md:pr-20">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
              {service.icon}
            </div>
          </div>

          {/* 信息 */}
          <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
            {/* 服务名称 + 英文名称 */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              <span className="font-medium text-xs md:text-sm truncate">{service.name}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground truncate">{service.englishName}</span>
            </div>
            {/* 服务介绍 - hover显示详情按钮 */}
            <DescriptionWithDetail 
              description={service.description} 
              onDetail={onDetail} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 服务介绍组件（带固定详情按钮）
function DescriptionWithDetail({
  description,
  onDetail,
}: {
  description: string
  onDetail: () => void
}) {
  return (
    <div className="relative">
      <p className="text-xs text-muted-foreground line-clamp-2">
        {description} <button
          onClick={onDetail}
          className="text-xs text-primary hover:underline"
        >
          查看详情
        </button>
      </p>
    </div>
  )
}

// MCP市场服务卡片组件
function MCPMarketCard({
  service,
  isAdded,
  onAdd,
  onDetail,
}: {
  service: PlatformMCPService
  isAdded: boolean
  onAdd: () => void
  onDetail: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          {/* Icon */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium shrink-0">
            {service.icon}
          </div>
          
          {/* 信息 */}
          <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
            {/* 服务名称 + 英文名称 */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              <span className="font-medium text-xs md:text-sm truncate">{service.name}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground truncate">{service.englishName}</span>
            </div>
            {/* 服务介绍 */}
            <DescriptionWithDetail 
              description={service.description} 
              onDetail={onDetail} 
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-1 shrink-0">
            {!isAdded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="gap-1 text-xs md:text-sm"
              >
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                添加
              </Button>
            ) : (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                已添加
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const MCPCenter = forwardRef<MCPCenterHandle, MCPCenterProps>(
  function MCPCenter({ activeTab, onTabChange, onBack }, ref) {
  const {
    userMCPServices,
    addService,
    deleteService,
    updateService,
    setEditingService,
    setShowQuickCreateModal,
    setQuickConfigService,
    setShowQuickConfigModal,
    isServiceAdded,
    setDetailService,
    setShowDetailModal,
  } = useMCP()
  
  
  // 联系客服弹窗
  const [showContactModal, setShowContactModal] = useState(false)

  // 暴露 openContactModal 给父组件
  useImperativeHandle(ref, () => ({
    openContactModal: () => setShowContactModal(true),
  }))
  
  // 分类筛选状态
  const [selectedCategory, setSelectedCategory] = useState<MCPCategory>('all')

  // MCP市场搜索
  const [marketSearchQuery, setMarketSearchQuery] = useState('')
  
  // 我的MCP搜索
  const [mySearchQuery, setMySearchQuery] = useState('')
  
  // 删除确认弹窗
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<MCPService | null>(null)
  
  // 过滤MCP市场服务
  const filteredMarketServices = useMemo(() => {
    let result = platformMCPServices
    
    // 分类过滤
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory)
    }
    
    // 搜索过滤
    if (marketSearchQuery.trim()) {
      const query = marketSearchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.englishName.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [selectedCategory, marketSearchQuery])
  
  // 过滤我的MCP服务
  const filteredMyServices = useMemo(() => {
    let result = userMCPServices
    
    // 分类过滤（通过englishName匹配平台服务）
    if (selectedCategory !== 'all') {
      result = result.filter(s => {
        const platformService = platformMCPServices.find(p => p.englishName === s.englishName)
        return platformService?.category === selectedCategory
      })
    }
    
    // 搜索过滤
    if (mySearchQuery.trim()) {
      const query = mySearchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.englishName.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [userMCPServices, selectedCategory, mySearchQuery])
  
  // 处理删除确认
  const handleDeleteConfirm = (service: MCPService) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }
  
  // 执行删除
  const handleDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id)
      toast.success('MCP服务已删除，可到个人中心-MCP市场重新添加')
    }
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }
  
  // 处理从市场添加 - 打开快速配置弹窗
  const handleAddFromMarket = (platformService: PlatformMCPService) => {
    setQuickConfigService(platformService)
    setShowQuickConfigModal(true)
  }

  // 处理编辑MCP服务
  const handleEditService = (service: MCPService) => {
    setEditingService(service)
    setShowQuickCreateModal(true)
  }

  // 处理授权状态检查
  const handleCheckAuth = async (service: MCPService) => {
    // 模拟API调用检查授权状态
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 随机返回授权状态（实际项目中应该调用真实API）
    const newStatus = Math.random() > 0.3 ? 'authorized' : 'unauthorized'
    updateService(service.id, { authStatus: newStatus as 'authorized' | 'unauthorized' })
    toast.success(`${service.name}授权状态已更新`)
  }

  // 处理查看服务详情 - 我的MCP
  const handleMyDetail = (service: MCPService) => {
    const platformService = platformMCPServices.find(p => p.englishName === service.englishName)
    if (platformService) {
      setDetailService(platformService)
      setShowDetailModal(true)
    }
  }

  // 处理查看服务详情 - MCP市场
  const handleMarketDetail = (service: PlatformMCPService) => {
    setDetailService(service)
    setShowDetailModal(true)
  }
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* 内容区域 */}
      <ScrollArea className="flex-1 px-3 md:px-4 py-4">
        {/* MCP市场：分类Tabs + 搜索框同一行 */}
        {activeTab === 'market' && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
            {/* 分类Tabs */}
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as MCPCategory)}
                  className={cn(
                    "text-xs py-1 px-2.5",
                    selectedCategory === category.id && "bg-primary text-primary-foreground"
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            {/* 搜索框 */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索MCP..."
                value={marketSearchQuery}
                onChange={(e) => setMarketSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        )}

        {/* 我的MCP：搜索框右对齐，与Tabs同行 */}
        {activeTab === 'my' && (
          <div className="flex justify-end mb-4">
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索MCP..."
                value={mySearchQuery}
                onChange={(e) => setMySearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        )}

        {activeTab === 'my' ? (
          <>
          {/* 我的MCP - 一行3列布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMyServices.length > 0 ? (
              filteredMyServices.map((service) => (
                <MyMCPServiceCard
                  key={service.id}
                  service={service}
                  onDelete={() => handleDeleteConfirm(service)}
                  onEdit={() => handleEditService(service)}
                  onCheckAuth={() => handleCheckAuth(service)}
                  onDetail={() => handleMyDetail(service)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">暂无MCP服务</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => onTabChange('market')}
                >
                  前往MCP市场添加
                </Button>
              </div>
            )}
          </div>
          
          {/* 我的MCP分页组件 */}
          <div className="pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          </>
        ) : (
          <div className="space-y-4">
            {/* 服务列表 - 一行3列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarketServices.map((service) => (
                <MCPMarketCard
                  key={service.id}
                  service={service}
                  isAdded={isServiceAdded(service.id)}
                  onAdd={() => handleAddFromMarket(service)}
                  onDetail={() => handleMarketDetail(service)}
                />
              ))}
            </div>
            
            {filteredMarketServices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">未找到匹配的MCP服务</p>
              </div>
            )}
            
            {/* 分页组件 */}
            <div className="pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* 删除确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认移除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要移除"{serviceToDelete?.name}"MCP服务吗？移除后，相关对话将无法继续使用该 MCP 能力，可能导致功能不可用。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>移除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 联系客服弹窗 */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>联系客服</DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-6 py-4">
            {/* 左侧：客服二维码 */}
            <div className="shrink-0">
              <img
                src="/images/customer-service-qrcode.png"
                alt="客服二维码"
                className="w-36 h-36 rounded-lg border"
              />
            </div>
            {/* 右侧：文本说明 */}
            <div className="flex-1 space-y-4">
              <p className="text-sm font-medium text-foreground">
                扫码添加客服，抢MCP免费体验名额
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                使用 MCP 服务时如有任何问题，也欢迎随时联系客服。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})