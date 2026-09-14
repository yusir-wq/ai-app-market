'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Gift,
} from '@phosphor-icons/react'
import type { TaskReward } from '@/lib/reward-store'
import styles from './new-user-benefit-toast.module.css'

interface NewUserBenefitToastProps {
  open: boolean
  onClose: () => void
  /** Stable account key used by the server-side display-state endpoint. */
  userId?: string | null
  /** Optional server-claimed rewards for embedding/testing the modal directly. */
  rewards?: TaskReward[]
  targetSelector?: string
}

const DEFAULT_TARGET_SELECTOR = '[data-reward-entry]'

export function NewUserBenefitToast({
  open,
  onClose,
  userId,
  rewards: suppliedRewards,
  targetSelector = DEFAULT_TARGET_SELECTOR,
}: NewUserBenefitToastProps) {
  const [claimedRewards, setClaimedRewards] = useState<TaskReward[]>([])
  const [phase, setPhase] = useState<'open' | 'closing'>('open')
  const [flightStyle, setFlightStyle] = useState<React.CSSProperties | undefined>()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const closeStartedRef = useRef(false)

  // Claim the pending batch through the server before rendering it. The
  // server marks rewardIds as displayed atomically, so a second tab receives
  // an empty batch instead of showing the same reward again.
  useEffect(() => {
    if (!open) return
    if (suppliedRewards) {
      if (suppliedRewards.length === 0) onClose()
      return
    }

    if (!userId) {
      onClose()
      return
    }

    let cancelled = false
    const claimPendingRewards = async () => {
      try {
        const pendingResponse = await fetch(`/api/rewards/pending?userId=${encodeURIComponent(userId)}`, {
          cache: 'no-store',
        })
        if (!pendingResponse.ok) throw new Error('pending rewards request failed')
        const pendingData = await pendingResponse.json() as { rewards?: TaskReward[] }
        const pending = Array.isArray(pendingData.rewards) ? pendingData.rewards : []
        if (pending.length === 0) {
          if (!cancelled) onClose()
          return
        }

        const displayResponse = await fetch('/api/rewards/display', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            userId,
            rewardIds: pending.map((reward) => reward.rewardId),
          }),
        })
        if (!displayResponse.ok) throw new Error('display rewards request failed')
        const displayData = await displayResponse.json() as { rewards?: TaskReward[] }
        const claimed = Array.isArray(displayData.rewards) ? displayData.rewards : []
        if (!cancelled) {
          setClaimedRewards(claimed)
          if (claimed.length === 0) onClose()
        }
      } catch {
        // Reward presentation is intentionally best-effort. A failed modal
        // request must never cancel, pause, or roll back a running task.
        if (!cancelled) {
          setClaimedRewards([])
          onClose()
        }
      }
    }

    void claimPendingRewards()
    return () => {
      cancelled = true
    }
  }, [open, onClose, suppliedRewards, userId])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const closeModal = useCallback(() => {
    if (!open || closeStartedRef.current) return
    closeStartedRef.current = true

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const modalRect = modalRef.current?.getBoundingClientRect()
    const targetRect = Array.from(document.querySelectorAll<HTMLElement>(targetSelector))
      .map((element) => element.getBoundingClientRect())
      .find((rect) => (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      ))
    const targetVisible = Boolean(targetRect)

    if (!prefersReducedMotion && targetVisible) {
      const fromX = (modalRect?.left ?? window.innerWidth / 2) + (modalRect?.width ?? 0) / 2
      const fromY = (modalRect?.top ?? window.innerHeight / 2) + (modalRect?.height ?? 0) / 2
      const toX = (targetRect?.left ?? 0) + (targetRect?.width ?? 0) / 2
      const toY = (targetRect?.top ?? 0) + (targetRect?.height ?? 0) / 2
      setFlightStyle({
        '--from-x': `${fromX}px`,
        '--from-y': `${fromY}px`,
        '--to-x': `${toX}px`,
        '--to-y': `${toY}px`,
        '--mid-x': `${(fromX + toX) / 2}px`,
        '--mid-y': `${(fromY + toY) / 2 - 74}px`,
      } as React.CSSProperties)
    }

    setPhase('closing')
    closeTimerRef.current = window.setTimeout(() => {
      closeStartedRef.current = false
      setPhase('open')
      setFlightStyle(undefined)
      onClose()
      closeTimerRef.current = null
    }, prefersReducedMotion ? 180 : targetVisible ? 620 : 260)
  }, [onClose, open, targetSelector])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeModal, open])

  const rewards = suppliedRewards ?? claimedRewards
  if (!open || rewards.length === 0) return null

  const modalClassName = `${styles.modal} ${phase === 'closing' ? styles.modalClosing : ''}`
  const backdropClassName = `${styles.backdrop} ${phase === 'closing' ? styles.backdropClosing : ''}`
  const hasFlight = Boolean(flightStyle)

  return (
    <div
      className={`${backdropClassName} ${hasFlight ? styles.backdropWithFlight : ''}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="任务奖励已到账"
        className={modalClassName}
      >
        <div className={styles.imageModal}>
          <Image
            className={styles.rewardImage}
            src="/prototype-assets/rewards/task-reward-chest-modal.png"
            width={540}
            height={704}
            priority
            alt="任务奖励已到账，已完成 3 项任务，共获得 1300 智点"
          />
          <button
            type="button"
            aria-label="关闭任务奖励"
            className={styles.imageCloseHotspot}
            onClick={closeModal}
          />
          <button
            type="button"
            aria-label="开心收下任务奖励"
            className={styles.imageAcceptHotspot}
            onClick={closeModal}
          />
        </div>
      </div>

      {hasFlight && (
        <div className={styles.flightIcon} style={flightStyle} aria-hidden="true">
          <Gift weight="fill" size={28} />
        </div>
      )}
    </div>
  )
}
