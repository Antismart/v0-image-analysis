import { NextResponse } from 'next/server'
import { sendMessage, getGroupMessages } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  const { senderId, groupId, content } = await req.json()
  const message = await sendMessage(senderId, groupId, content)
  return NextResponse.json(message)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  const limit = parseInt(searchParams.get('limit') || '50')
  if (!groupId) return NextResponse.json({ error: 'groupId required' }, { status: 400 })
  const messages = await getGroupMessages(groupId, limit)
  return NextResponse.json(messages)
}
