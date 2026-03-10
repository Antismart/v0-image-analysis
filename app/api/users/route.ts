import { NextResponse } from 'next/server'
import { upsertUser } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  const { address } = await req.json()
  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })
  const user = await upsertUser(address)
  return NextResponse.json(user)
}
