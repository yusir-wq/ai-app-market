'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMCP } from '@/contexts/mcp-context'
import { MCPService, serviceTypeFullLabels } from '@/lib/mcp-data'


export function MCPQuickCreateModal() {
  const {
    showQuickCreateModal,
    setShowQuickCreateModal,
    editingService,
    setEditingService,
    updateService,
  } = useMCP()

  // 表单状态
  const [serviceName, setServiceName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [timeout, setTimeoutValue] = useState(60)

  // 只处理编辑模式（从市场添加由 MCPConfigModal 处理）
  const isEditing = showQuickCreateModal && editingService

  // 获取只读字段数据
  const readOnlyData = isEditing ? editingService : null

  // 初始化表单
  useEffect(() => {
    if (isEditing && editingService) {
      setServiceName(editingService.name)
      // 从 Authorization header 中提取 APIKey
      const authHeader = editingService.config.headers?.['Authorization'] || ''
      const extractedKey = authHeader.replace(/^Bearer\s*/i, '')
      // 如果没有 APIKey，设置默认值
      setApiKey(extractedKey || 'apiuser_quantity******78bdd')
      setTimeoutValue(editingService.config.timeout || 60)
    } else {
      // 重置表单
      setServiceName('')
      setApiKey('')
      setTimeoutValue(60)
    }
  }, [isEditing, editingService])

  // 处理保存
  const handleSave = () => {
    if (isEditing && editingService) {
      // 更新现有服务
      updateService(editingService.id, {
        name: serviceName,
        config: {
          ...editingService.config,
          headers: {
            ...editingService.config.headers,
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout,
        },
      })
      setEditingService(null)
      setShowQuickCreateModal(false)
    }
  }

  // 处理关闭
  const handleClose = () => {
    setEditingService(null)
    setShowQuickCreateModal(false)
  }

  // 弹窗标题
  const dialogTitle = '编辑MCP服务'

  return (
    <Dialog open={showQuickCreateModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        {/* 固定标题 */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        {/* 可滚动表单区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* 1. 服务名称（可编辑） */}
            <div className="space-y-2">
              <Label>服务名称</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="请输入服务名称"
              />
            </div>

            {/* 2. APIKey（可编辑） */}
            <div className="space-y-2">
              <Label>服务APIKey</Label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="输入此服务对应的APIKey，例如apiuser_quantity_eff..."
              />
            </div>

            {/* 3. MCP英文名称（只读） */}
            {readOnlyData && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">MCP英文名称</Label>
                <Input
                  value={readOnlyData.englishName}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}

            {/* 4. 服务介绍（只读） */}
            {readOnlyData && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">服务介绍</Label>
                <Textarea
                  value={readOnlyData.description}
                  disabled
                  className="bg-muted resize-none"
                  rows={2}
                />
              </div>
            )}

            {/* 5. 服务类型（只读） */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">服务类型</Label>
              <Input
                value={serviceTypeFullLabels['HTTP']}
                disabled
                className="bg-muted"
              />
            </div>

            {/* 6. 超时时间（秒）（可编辑） */}
            <div className="space-y-2">
              <Label>超时时间（秒）</Label>
              <Select value={timeout.toString()} onValueChange={(val) => setTimeoutValue(parseInt(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60秒</SelectItem>
                  <SelectItem value="120">120秒</SelectItem>
                  <SelectItem value="180">180秒</SelectItem>
                  <SelectItem value="300">300秒</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 固定底部按钮 */}
        <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2">
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!serviceName.trim()}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
