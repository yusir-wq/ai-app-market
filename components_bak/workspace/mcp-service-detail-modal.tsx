'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMCP } from '@/contexts/mcp-context'

export function MCPServiceDetailModal() {
  const {
    showDetailModal,
    setShowDetailModal,
    detailService,
    addService,
    isServiceAdded,
    setQuickConfigService,
    setShowQuickConfigModal,
  } = useMCP()

  if (!detailService) return null

  const isAdded = isServiceAdded(detailService.id)

  const handleAdd = () => {
    if (isAdded) return

    // 关闭详情弹窗，打开快速配置弹窗
    setShowDetailModal(false)
    setQuickConfigService(detailService)
    setShowQuickConfigModal(true)
  }

  return (
    <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>MCP服务详情</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
              {detailService.icon}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-lg font-semibold">{detailService.name}</h3>
                <p className="text-sm text-muted-foreground">{detailService.englishName}</p>
              </div>
              <p className="text-sm text-muted-foreground">{detailService.description}</p>
            </div>
          </div>

          {/* 服务能力说明 */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium">服务能力说明</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              只要输入公司名称或统一社会信用代码，这个MCP工具就能帮你一键查询这家公司的工商信息——包括法人、注册资本、成立日期、经营范围、股东、高管、分支机构，甚至行政处罚和经营异常记录，一应俱全。查到了，详细资料马上呈现；查不到，也会明确提醒你，不会空手而归。
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>
          {!isAdded && (
            <Button onClick={handleAdd}>
              添加MCP
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
