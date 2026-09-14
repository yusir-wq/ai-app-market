/**
 * Server-side reward display state used by the prototype.
 *
 * The real product should back these operations with the rewards service and
 * a durable store/transaction. Keeping the state on globalThis gives the
 * local Next server one atomic source of truth for multiple browser tabs,
 * instead of relying on a tab's React state or localStorage.
 */

export type RewardIcon = 'chat' | 'image' | 'video' | 'task'

export interface TaskReward {
  rewardId: string
  taskName: string
  points: number
  icon: RewardIcon
}

interface RewardState {
  pendingByUser: Map<string, TaskReward[]>
  displayedByUser: Map<string, Set<string>>
}

const STORE_KEY = '__aiAppMarketRewardStore__'

function getStore(): RewardState {
  const globalWithStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: RewardState
  }

  if (!globalWithStore[STORE_KEY]) {
    globalWithStore[STORE_KEY] = {
      pendingByUser: new Map(),
      displayedByUser: new Map(),
    }
  }

  return globalWithStore[STORE_KEY]
}

function seedRewards(userId: string): TaskReward[] {
  // Prototype fixtures mirror the approved reward-chest concept. In
  // production this list comes from the task/reward service.
  return [
    {
      rewardId: `${userId}:first-chat`,
      taskName: '首次使用AI聊天',
      points: 100,
      icon: 'chat',
    },
    {
      rewardId: `${userId}:first-image`,
      taskName: '首次使用AI图像',
      points: 200,
      icon: 'image',
    },
    {
      rewardId: `${userId}:first-video`,
      taskName: '首次使用AI文案生视频',
      points: 1000,
      icon: 'video',
    },
  ]
}

function getPendingList(store: RewardState, userId: string): TaskReward[] {
  let pending = store.pendingByUser.get(userId)
  if (!pending) {
    pending = seedRewards(userId)
    store.pendingByUser.set(userId, pending)
  }
  return pending
}

/** Return rewards that have arrived but have not been displayed yet. */
export function getPendingRewards(userId: string): TaskReward[] {
  if (!userId) return []
  const store = getStore()
  const displayed = store.displayedByUser.get(userId) ?? new Set<string>()
  return getPendingList(store, userId).filter((reward) => !displayed.has(reward.rewardId))
}

/**
 * Atomically claim a batch for display. Calling this twice with the same IDs
 * returns the rewards only on the first call, which makes multi-tab and
 * re-login flows idempotent.
 */
export function claimRewardsForDisplay(userId: string, rewardIds?: string[]): TaskReward[] {
  if (!userId) return []
  const store = getStore()
  const pending = getPendingList(store, userId)
  const displayed = store.displayedByUser.get(userId) ?? new Set<string>()
  store.displayedByUser.set(userId, displayed)

  const requested = rewardIds && rewardIds.length > 0 ? new Set(rewardIds) : null
  const claimable = pending.filter((reward) => {
    if (displayed.has(reward.rewardId)) return false
    return requested ? requested.has(reward.rewardId) : true
  })

  claimable.forEach((reward) => displayed.add(reward.rewardId))
  return claimable
}

