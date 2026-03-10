import { NextResponse } from 'next/server'
import { upsertUser } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address } = body

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'A valid address string is required' }, { status: 400 })
    }

    const user = await upsertUser(address)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
