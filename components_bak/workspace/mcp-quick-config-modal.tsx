'use client'

import { useState } from 'react'
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
import { useMCP } from '@/contexts/mcp-context'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'

export function MCPQuickConfigModal() {
  const {
    showQuickConfigModal,
    setShowQuickConfigModal,
    quickConfigService,
    setQuickConfigService,
    addService,
  } = useMCP()

  const [apiKey, setApiKey] = useState('apiuser_quantity******78bdd')
  const [showContactModal, setShowContactModal] = useState(false)

  // 处理关闭
  const handleClose = () => {
    setQuickConfigService(null)
    setApiKey('')
    setShowQuickConfigModal(false)
  }

  // 处理添加
  const handleAdd = () => {
    if (!quickConfigService) return

    // 创建新服务
    const newService = {
      id: `user-${quickConfigService.id}-${Date.now()}`,
      name: quickConfigService.name,
      englishName: quickConfigService.englishName,
      description: quickConfigService.description,
      icon: quickConfigService.icon,
      type: 'HTTP' as const,
      provider: quickConfigService.provider,
      status: 'enabled' as const,
      config: {
        url: quickConfigService.defaultUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 60,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addService(newService)
    toast.success(`${quickConfigService.name}已添加`)
    handleClose()
  }

  // 处理抢免费名额 - 关闭配置窗口，打开联系客服窗口
  const handleGrabFreeSlot = () => {
    setShowQuickConfigModal(false)
    setShowContactModal(true)
  }

  if (!quickConfigService) return null

  return (
    <>
      <Dialog open={showQuickConfigModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* 固定标题 */}
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle>配置MCP服务</DialogTitle>
          </DialogHeader>

          {/* 可滚动内容区域 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* APIKey输入框 */}
              <div className="space-y-2">
                <Label htmlFor="apikey">输入此服务的APIKey</Label>
                <Input
                  id="apikey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入此服务对应的APIKey，例如apiuser_quantity_eff..."
                />
                <p className="text-sm text-muted-foreground">
                  该服务需购买后获取APIKey，前往 chinaz.net 开通服务
                  <a
                    href="https://www.chinaz.net/mall/a_9aUhQUNiv4.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                      立即购买
                    </Button>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>

              {/* 获取 APIKey 操作演示 */}
              <div className="space-y-2">
                <Label>获取 APIKey 操作演示</Label>
                <p className="text-sm text-muted-foreground">
                  第1步. 登录 <a
                    href="https://www.chinaz.net/mall/a_9aUhQUNiv4.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    chinaz.net
                  </a> 购买开通服务；
                </p>
                <p className="text-sm text-muted-foreground">
                  第2步. 进入<a
                    href="https://user.chinaz.net/servicesPurchased/myApi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground underline hover:text-foreground"
                  >买家中心-我的API</a>复制 APIKey；
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  👇 下方视频演示详细操作。有使用问题随时向我们
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-primary hover:underline cursor-pointer font-medium"
                  >
                    寻求帮助
                  </button>
                </p>
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:bg-muted/80 transition-colors">
                  <div className="text-center px-4">
                    <div className="text-4xl mb-2">▶️</div>
                    <p className="text-sm text-muted-foreground">
                      这是一段自动播放的操作视频教程，支持点击放大查看详情。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 固定底部按钮 */}
          <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2">
            <button
              onClick={handleGrabFreeSlot}
              className="text-orange-500 font-bold text-sm hover:text-orange-600 cursor-pointer mr-auto"
            >
              抢MCP免费体验名额！！！
            </button>
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button onClick={handleAdd} disabled={!apiKey.trim()}>
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  )
}
