'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Check, Loader2 } from 'lucide-react'

// 智点套餐选项（1元=1000智点）
const PRESET_AMOUNTS = [
  { amount: 10, points: 10000, label: '10,000 智点', price: '¥10' },
  { amount: 50, points: 50000, label: '50,000 智点', price: '¥50' },
  { amount: 100, points: 100000, label: '100,000 智点', price: '¥100' },
  { amount: 500, points: 500000, label: '500,000 智点', price: '¥500' },
]

const CUSTOM_AMOUNT = 'custom'

const PAYMENT_METHODS = [
  { id: 'wechat', name: '微信', icon: 'wechat' },
  { id: 'alipay', name: '支付宝', icon: 'alipay' },
]

const MIN_AMOUNT = 0.01
const MAX_AMOUNT = 50000

export function RechargeModal() {
  const { showRechargeModal, setShowRechargeModal, updateBalance } = useAuth()
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom' | null>(10)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'qr' | 'processing' | 'success'>('idle')
  const [selectedPayment, setSelectedPayment] = useState('wechat')

  const finalAmount = selectedAmount === 'custom'
    ? parseFloat(customAmount) || 0
    : selectedAmount || 0

  // 计算对应的智点数
  const finalPoints = Math.floor(finalAmount * 1000)

  const handleAmountSelect = (amount: number | 'custom') => {
    setSelectedAmount(amount)
    if (amount !== 'custom') {
      setCustomAmount('')
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许数字和小数点
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value)
    }
  }

  const isCustomAmountValid = () => {
    const amount = parseFloat(customAmount)
    return !isNaN(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT
  }

  // 确认支付 - 显示二维码
  const handleConfirmRecharge = () => {
    if (!finalAmount || finalAmount < MIN_AMOUNT || finalAmount > MAX_AMOUNT) {
      alert(`请输入有效的充值金额（${MIN_AMOUNT}～${MAX_AMOUNT}元）`)
      return
    }

    // 显示二维码
    setPaymentStatus('qr')
  }

  // 模拟扫码支付完成
  const handleSimulatePayment = () => {
    setIsLoading(true)
    setPaymentStatus('processing')

    // 模拟支付处理
    setTimeout(() => {
      updateBalance(finalAmount)
      setPaymentStatus('success')
      setIsLoading(false)

      // 2秒后关闭弹窗
      setTimeout(() => {
        setShowRechargeModal(false)
        setSelectedAmount(10)
        setCustomAmount('')
        setPaymentStatus('idle')
      }, 2000)
    }, 1500)
  }

  const canConfirm = finalAmount >= MIN_AMOUNT && finalAmount <= MAX_AMOUNT

  return (
    <Dialog open={showRechargeModal} onOpenChange={setShowRechargeModal}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
        {paymentStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">充值成功！</h3>
            <p className="text-sm text-muted-foreground">
              {finalPoints.toLocaleString()} 智点已添加到您的账户
            </p>
          </div>
        ) : paymentStatus === 'qr' ? (
          // 二维码支付界面
          <div className="space-y-5 p-6">
            {/* 标题 */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-foreground">
                扫码支付
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                请使用{selectedPayment === 'wechat' ? '微信' : '支付宝'}扫码完成支付
              </p>
            </div>

            {/* 支付金额信息 */}
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">支付金额</p>
              <p className="text-2xl font-bold text-foreground">¥{finalAmount.toFixed(2)}</p>
              <p className="text-sm text-primary mt-1">
                可获得 <span className="font-semibold">{finalPoints.toLocaleString()}</span> 智点
              </p>
            </div>

            {/* 二维码 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-background border-2 border-border rounded-lg">
                {/* 使用占位图模拟二维码 */}
                <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto text-muted-foreground" viewBox="0 0 100 100" fill="currentColor">
                      {/* 模拟二维码图案 */}
                      <rect x="10" y="10" width="25" height="25" />
                      <rect x="65" y="10" width="25" height="25" />
                      <rect x="10" y="65" width="25" height="25" />
                      <rect x="15" y="15" width="15" height="15" fill="white" />
                      <rect x="70" y="15" width="15" height="15" fill="white" />
                      <rect x="15" y="70" width="15" height="15" fill="white" />
                      <rect x="18" y="18" width="9" height="9" />
                      <rect x="73" y="18" width="9" height="9" />
                      <rect x="18" y="73" width="9" height="9" />
                      {/* 随机点阵 */}
                      <rect x="40" y="10" width="5" height="5" />
                      <rect x="50" y="10" width="5" height="5" />
                      <rect x="40" y="20" width="5" height="5" />
                      <rect x="45" y="25" width="5" height="5" />
                      <rect x="55" y="20" width="5" height="5" />
                      <rect x="40" y="40" width="20" height="20" />
                      <rect x="45" y="45" width="10" height="10" fill="white" />
                      <rect x="48" y="48" width="4" height="4" />
                      <rect x="65" y="40" width="5" height="5" />
                      <rect x="75" y="45" width="5" height="5" />
                      <rect x="85" y="40" width="5" height="5" />
                      <rect x="65" y="55" width="5" height="5" />
                      <rect x="80" y="55" width="5" height="5" />
                      <rect x="40" y="65" width="5" height="5" />
                      <rect x="50" y="70" width="5" height="5" />
                      <rect x="45" y="80" width="5" height="5" />
                      <rect x="55" y="85" width="5" height="5" />
                      <rect x="65" y="65" width="25" height="25" />
                      <rect x="70" y="70" width="15" height="15" fill="white" />
                      <rect x="73" y="73" width="9" height="9" />
                      <rect x="10" y="40" width="5" height="5" />
                      <rect x="20" y="45" width="5" height="5" />
                      <rect x="25" y="55" width="5" height="5" />
                      <rect x="10" y="50" width="5" height="5" />
                      <rect x="30" y="40" width="5" height="5" />
                    </svg>
                    <p className="text-xs text-muted-foreground mt-2">模拟二维码</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                请使用{selectedPayment === 'wechat' ? '微信' : '支付宝'}扫描二维码
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button
                onClick={handleSimulatePayment}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  '模拟支付完成'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* 标题 */}
            <h2 className="text-lg font-bold text-foreground text-center">
              购买智点
            </h2>

            {/* 智点套餐选择 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                选择购买套餐
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AMOUNTS.map((item) => (
                  <button
                    key={item.amount}
                    onClick={() => handleAmountSelect(item.amount)}
                    disabled={isLoading}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      selectedAmount === item.amount
                        ? 'border-primary bg-primary/[0.06]'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className={`text-center font-semibold text-sm ${
                      selectedAmount === item.amount
                        ? 'text-foreground'
                        : 'text-foreground'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-center text-xs mt-1 ${
                      selectedAmount === item.amount
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`}>
                      {item.price}
                    </div>
                  </button>
                ))}
                {/* 自定义金额按钮 */}
                <button
                  onClick={() => handleAmountSelect('custom')}
                  disabled={isLoading}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    selectedAmount === 'custom'
                      ? 'border-primary bg-primary/[0.06]'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className={`text-center font-semibold text-sm flex items-center justify-center h-full ${
                    selectedAmount === 'custom'
                      ? 'text-primary'
                      : 'text-primary'
                  }`}>
                    自定义金额
                  </div>
                </button>
              </div>

              {/* 自定义金额输入框 */}
              {selectedAmount === 'custom' && (
                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                    <Input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="请输入金额"
                      className="pl-8 h-11 text-base border-border"
                    />
                  </div>
                  {finalAmount > 0 && (
                    <p className="text-sm text-primary">
                      可获得 <span className="font-semibold">{finalPoints.toLocaleString()}</span> 智点
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    最低 ¥{MIN_AMOUNT}，最高 ¥{MAX_AMOUNT.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* 支付方式 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                支付方式
              </label>
              <div className="flex gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    disabled={isLoading}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/[0.06]'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    {method.icon === 'wechat' ? (
                      <div className="w-8 h-8 rounded-full bg-[#07C160] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.024-.406-.032zm-1.562 2.658c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.857 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1677FF] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          <path d="M17.5 8.5h-2V7h2v1.5zm-3 0h-2V7h2v1.5zm-3 0h-2V7h2v1.5zm-3 0h-2V7h2v1.5zm8.5 3h-11v1.5h11V11.5zm0 3h-11V16h11v-1.5z"/>
                        </svg>
                      </div>
                    )}
                    <span className="font-medium text-sm text-foreground">{method.name}</span>
                    {selectedPayment === method.id && (
                      <Check className="ml-auto w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 确认支付按钮 */}
            <Button
              onClick={handleConfirmRecharge}
              disabled={!canConfirm || isLoading}
              size="lg"
              className="w-full h-12 text-base font-semibold rounded-xl"
              style={{ backgroundColor: '#575CE9' }}
            >
              确认支付 ¥{finalAmount.toFixed(2) || '0.00'}
            </Button>

            {/* 协议说明 */}
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              支付成功即视为您同意
              <a href="#" className="text-primary hover:underline">
                《购买协议》
              </a>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
