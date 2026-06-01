'use client'

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
import { ArrowLeft } from 'lucide-react'
import { mockPaymentRecords, type PaymentRecord } from '@/lib/mock-billing-data'

interface BillingPaymentsProps {
  onBack: () => void
}

function getPayMethodBadge(method: PaymentRecord['payMethod']) {
  switch (method) {
    case 'alipay':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">支付宝</Badge>
    case 'wechat':
      return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">微信</Badge>
  }
}

// 将金额转换为智点（1元=1000智点）
function amountToPoints(amount: number): number {
  return Math.floor(amount * 1000)
}

export function BillingPayments({ onBack }: BillingPaymentsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          返回工作台
        </Button>
        <h1 className="text-lg font-semibold text-foreground">支付记录</h1>
        <div className="w-[100px]" />
      </div>

      {/* 支付记录表格 */}
      <Card className="bg-card border rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-medium">订单号</TableHead>
                <TableHead className="text-sm font-medium text-right">支付金额</TableHead>
                <TableHead className="text-sm font-medium text-right">购买智点</TableHead>
                <TableHead className="text-sm font-medium">支付时间</TableHead>
                <TableHead className="text-sm font-medium">支付方式</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaymentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-sm font-medium text-foreground">
                    {record.orderNo}
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium text-foreground">
                    {`¥${record.amount.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium text-foreground">
                    {amountToPoints(record.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.payTime}
                  </TableCell>
                  <TableCell>{getPayMethodBadge(record.payMethod)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
