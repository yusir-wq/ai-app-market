'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      alert('请输入有效的11位手机号')
      return
    }

    setIsLoading(true)
    // 模拟发送验证码
    setTimeout(() => {
      setCodeSent(true)
      setCountdown(60)
      setIsLoading(false)
      alert('验证码已发送到您的手机（演示：000000）')
    }, 800)
  }

  const handleLogin = () => {
    if (!code || code.length !== 6) {
      alert('请输入6位验证码')
      return
    }

    setIsLoading(true)
    // 模拟登录
    setTimeout(() => {
      login(phone, code)
    }, 800)
  }

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-[400px] p-8">
        {/* 标题 */}
        <h2 className="text-xl font-bold text-center text-foreground mb-8">
          手机验证码登录注册
        </h2>

        <div className="space-y-5">
          {/* 手机号输入 - +86前缀 + 输入框 */}
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-4 py-2 border border-input rounded-md bg-background text-foreground text-sm">
              +86
            </div>
            <Input
              placeholder="请输入手机号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={codeSent || isLoading}
              maxLength={11}
              type="tel"
              className="flex-1 h-11"
            />
          </div>

          {/* 验证码输入 - 输入框 + 获取验证码按钮并排 */}
          <div className="flex gap-2">
            <Input
              placeholder="请输入手机验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              maxLength={6}
              type="text"
              className="flex-1 h-11"
            />
            <Button
              onClick={handleSendCode}
              disabled={isLoading || !phone || countdown > 0}
              size="lg"
              className="px-4 whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </div>

          {/* 登录按钮 */}
          <Button
            onClick={handleLogin}
            disabled={isLoading || !phone || !code}
            size="lg"
            className="w-full font-medium mt-2"
          >
            {isLoading ? '登录中...' : '登 录'}
          </Button>

          {/* 底部协议文字 */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            登录即代表同意
            <a href="#" className="text-foreground hover:text-primary underline">
              《隐私政策》
            </a>
            和
            <a href="#" className="text-foreground hover:text-primary underline">
              《服务协议》
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
