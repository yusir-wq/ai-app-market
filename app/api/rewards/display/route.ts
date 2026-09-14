import { NextResponse } from 'next/server'
import { claimRewardsForDisplay } from '@/lib/reward-store'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { userId?: unknown; rewardIds?: unknown }
    const userId = typeof body.userId === 'string' ? body.userId : ''
    const rewardIds = Array.isArray(body.rewardIds)
      ? body.rewardIds.filter((value): value is string => typeof value === 'string')
      : undefined

    return NextResponse.json(
      { rewards: claimRewardsForDisplay(userId, rewardIds) },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: '无法读取奖励展示状态' }, { status: 400 })
  }
}
