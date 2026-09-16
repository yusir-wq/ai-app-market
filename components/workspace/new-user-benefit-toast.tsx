'use client'

import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  /** Enable the minimize-to-entry transition for the task reward prototype. */
  animateFromTarget?: boolean
}

const DEFAULT_TARGET_SELECTOR = '[data-reward-entry]'

export function NewUserBenefitToast({
  open,
  onClose,
  userId,
  rewards: suppliedRewards,
  targetSelector = DEFAULT_TARGET_SELECTOR,
  animateFromTarget = false,
}: NewUserBenefitToastProps) {
  const [claimedRewards, setClaimedRewards] = useState<TaskReward[]>([])
  const [phase, setPhase] = useState<'idle' | 'opening' | 'open' | 'closing'>(open ? 'open' : 'idle')
  const [flightStyle, setFlightStyle] = useState<React.CSSProperties | undefined>()
  const [flightDirection, setFlightDirection] = useState<'close' | 'open'>('close')
  const [skipModalEntrance, setSkipModalEntrance] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const closeStartedRef = useRef(false)
  const previousOpenRef = useRef(open)

  const rewards = suppliedRewards ?? claimedRewards

  const findVisibleTarget = useCallback(() => {
    return Array.from(document.querySelectorAll<HTMLElement>(targetSelector))
      .map((element) => element.getBoundingClientRect())
      .find((rect) => (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      ))
  }, [targetSelector])

  const getFlightStyle = useCallback((fromRect: DOMRect, toRect: DOMRect) => {
    const fromCenterX = fromRect.left + fromRect.width / 2
    const fromCenterY = fromRect.top + fromRect.height / 2
    const toCenterX = toRect.left + toRect.width / 2
    const toCenterY = toRect.top + toRect.height / 2
    const naturalScale = Math.min(
      toRect.width / Math.max(fromRect.width, 1),
      toRect.height / Math.max(fromRect.height, 1),
    )
    const scale = Math.min(.25, Math.max(.15, naturalScale))

    return {
      '--flight-left': `${fromCenterX}px`,
      '--flight-top': `${fromCenterY}px`,
      '--flight-width': `${fromRect.width}px`,
      '--flight-height': `${fromRect.height}px`,
      '--flight-dx': `${toCenterX - fromCenterX}px`,
      '--flight-dy': `${toCenterY - fromCenterY}px`,
      '--flight-scale-x': String(scale),
      '--flight-scale-y': String(scale),
    } as React.CSSProperties
  }, [])

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

  // This layout effect intentionally updates animation state after measuring
  // the two live DOM regions, so the mirror can start without a layout jump.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    const wasOpen = previousOpenRef.current
    previousOpenRef.current = open

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (!open) {
      closeStartedRef.current = false
      setPhase('idle')
      setFlightStyle(undefined)
      setSkipModalEntrance(false)
      return
    }

    if (!animateFromTarget || wasOpen || rewards.length === 0) {
      setPhase('open')
      setFlightStyle(undefined)
      setSkipModalEntrance(false)
      return
    }

    const modalRect = modalRef.current?.getBoundingClientRect()
    const targetRect = findVisibleTarget()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!modalRect || !targetRect || prefersReducedMotion) {
      setPhase('open')
      setFlightStyle(undefined)
      setSkipModalEntrance(false)
      return
    }

    const scale = Math.min(.25, Math.max(.15, Math.min(
      targetRect.width / Math.max(modalRect.width, 1),
      targetRect.height / Math.max(modalRect.height, 1),
    )))
    const targetCenter = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
    }
    const modalCenter = {
      x: modalRect.left + modalRect.width / 2,
      y: modalRect.top + modalRect.height / 2,
    }
    setFlightDirection('open')
    setFlightStyle({
      '--flight-left': `${targetCenter.x}px`,
      '--flight-top': `${targetCenter.y}px`,
      '--flight-width': `${modalRect.width * scale}px`,
      '--flight-height': `${modalRect.height * scale}px`,
      '--flight-dx': `${modalCenter.x - targetCenter.x}px`,
      '--flight-dy': `${modalCenter.y - targetCenter.y}px`,
      '--flight-scale-x': String(scale),
      '--flight-scale-y': String(scale),
    } as React.CSSProperties)
    setSkipModalEntrance(true)
    setPhase('opening')
    closeTimerRef.current = window.setTimeout(() => {
      setPhase('open')
      setFlightStyle(undefined)
      setSkipModalEntrance(true)
      closeTimerRef.current = null
    }, 400)

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [animateFromTarget, findVisibleTarget, open, rewards.length])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const closeModal = useCallback(() => {
    if (!open || phase !== 'open' || closeStartedRef.current) return
    closeStartedRef.current = true

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const modalRect = modalRef.current?.getBoundingClientRect()
    const targetRect = findVisibleTarget()
    const targetVisible = Boolean(modalRect && targetRect)

    if (!prefersReducedMotion && modalRect && targetRect) {
      setFlightDirection('close')
      setFlightStyle(getFlightStyle(modalRect, targetRect))
    }

    setPhase('closing')
    closeTimerRef.current = window.setTimeout(() => {
      closeStartedRef.current = false
      setPhase('idle')
      setFlightStyle(undefined)
      onClose()
      closeTimerRef.current = null
    }, prefersReducedMotion ? 160 : targetVisible ? 400 : 400)
  }, [findVisibleTarget, getFlightStyle, onClose, open, phase])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeModal, open])

  if (!open || rewards.length === 0) return null

  const modalClassName = `${styles.modal} ${phase === 'opening' ? styles.modalOpening : ''} ${phase === 'closing' ? styles.modalClosing : ''} ${skipModalEntrance ? styles.modalNoEntrance : ''}`
  const backdropClassName = `${styles.backdrop} ${phase === 'closing' ? styles.backdropClosing : ''}`
  const hasFlight = Boolean(flightStyle)

  return (
    <div
      className={backdropClassName}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="任务奖励已到账"
        className={modalClassName}
      >
        <div ref={modalRef} className={styles.imageModal}>
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
        <div
          className={styles.flightMirror}
          data-direction={flightDirection}
          style={flightStyle}
          aria-hidden="true"
        >
          <Image
            className={styles.flightImage}
            src="/prototype-assets/rewards/task-reward-chest-modal.png"
            fill
            sizes="600px"
            alt=""
          />
        </div>
      )}
    </div>
  )
}
