'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: string
  phone: string
  balance: number
  avatar?: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  login: (phone: string, code: string) => void
  logout: () => void
  updateBalance: (amount: number) => void
  setShowLoginModal: (show: boolean) => void
  showLoginModal: boolean
  setShowRechargeModal: (show: boolean) => void
  showRechargeModal: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRechargeModal, setShowRechargeModal] = useState(false)

  const login = (phone: string, code: string) => {
    // 模拟登录成功
    const newUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      phone,
      balance: 128.50,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
    }
    setUser(newUser)
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateBalance,
        setShowLoginModal,
        showLoginModal,
        setShowRechargeModal,
        showRechargeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
