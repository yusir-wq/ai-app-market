import { NextResponse } from 'next/server'
import { getPendingRewards } from '@/lib/reward-store'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get('userId') ?? ''
  return NextResponse.json(
    { rewards: getPendingRewards(userId) },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
