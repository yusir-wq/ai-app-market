'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Wallet, Activity, CheckCircle, XCircle, Download, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  mockUsageRecords,
  mockUsageStats,
  modelNames,
  type UsageRecord,
} from '@/lib/mock-billing-data'

interface BillingUsageProps {
  onBack: () => void
}

function getModelTypeText(type: UsageRecord['modelType']) {
  switch (type) {
    case 'chat':
      return '聊天'
    case 'image':
      return '图片'
    case 'video':
      return '视频'
  }
}

function getStatusBadge(status: UsageRecord['status']) {
  switch (status) {
    case 'success':
      return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">成功</Badge>
    case 'failed':
      return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">失败</Badge>
    case 'generating':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">生成中</Badge>
  }
}

// 将金额转换为智点（原值×100，最少1点）
function costToPoints(cost: number): number {
  return Math.max(1, Math.floor(cost * 100))
}

export function BillingUsage({ onBack }: BillingUsageProps) {
  const [startDate, setStartDate] = useState('2025-05-01')
  const [endDate, setEndDate] = useState('2025-05-25')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)

  const toggleModel = (name: string) => {
    setSelectedModels((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
  }

  const filteredRecords = mockUsageRecords.filter((record) => {
    const modelMatch =
      selectedModels.length === 0 || selectedModels.includes(record.modelName)
    const dateMatch =
      record.startTime >= startDate && record.startTime <= endDate + ' 23:59:59'
    return modelMatch && dateMatch
  })

  // 计算总消耗智点
  const totalPoints = costToPoints(mockUsageStats.totalCost)

  return (
    <div className="py-6 space-y-6">
      {/* 数据统计卡片区 */}
      <div className="px-3 md:px-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="bg-card border rounded-lg">
          <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">总消耗智点</p>
              <p className="text-base md:text-xl font-semibold text-foreground">
                {totalPoints.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-lg">
          <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Activity className="h-4 w-4 md:h-5 md:w-5 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">总调用次数</p>
              <p className="text-base md:text-xl font-semibold text-foreground">
                {mockUsageStats.totalCalls.toLocaleString()} 次
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-lg">
          <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">调用成功次数</p>
              <p className="text-base md:text-xl font-semibold text-green-600">
                {mockUsageStats.successCalls.toLocaleString()} 次
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border rounded-lg">
          <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">调用失败次数</p>
              <p className="text-base md:text-xl font-semibold text-red-600">
                {mockUsageStats.failedCalls.toLocaleString()} 次
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作筛选栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-[130px] md:w-[160px] text-xs md:text-sm"
        />
        <span className="text-xs md:text-sm text-muted-foreground">至</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-[130px] md:w-[160px] text-xs md:text-sm"
        />

        <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 text-sm">
              模型
              {selectedModels.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {selectedModels.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-2" align="start">
            <div className="space-y-1">
              {modelNames.map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedModels.includes(name)}
                    onCheckedChange={() => toggleModel(name)}
                  />
                  <span className="text-foreground">{name}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        <Button variant="outline" className="gap-1 md:gap-2 text-xs md:text-sm">
          <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
          导出账单
        </Button>
      </div>

      {/* 消费记录表格 */}
      <Card className="bg-card border rounded-lg overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs md:text-sm font-medium">对话</TableHead>
                <TableHead className="text-xs md:text-sm font-medium">模型</TableHead>
                <TableHead className="text-xs md:text-sm font-medium">类型</TableHead>
                <TableHead className="text-xs md:text-sm font-medium">状态</TableHead>
                <TableHead className="text-xs md:text-sm font-medium text-right">消耗智点</TableHead>
                <TableHead className="text-xs md:text-sm font-medium">开始时间</TableHead>
                <TableHead className="text-xs md:text-sm font-medium">结束时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-xs md:text-sm font-medium text-foreground max-w-[120px] md:max-w-[150px] truncate" title={record.conversationName}>
                    {record.conversationName}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm text-muted-foreground">
                    {record.modelName}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm text-muted-foreground">{getModelTypeText(record.modelType)}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-xs md:text-sm text-right font-medium text-foreground">
                    {costToPoints(record.cost).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                    {record.startTime}
                  </TableCell>
                  <TableCell className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                    {record.endTime}
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs md:text-sm text-muted-foreground">
                    暂无匹配的消费记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
