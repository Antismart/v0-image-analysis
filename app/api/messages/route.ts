import { NextResponse } from 'next/server'
import { sendMessage, getGroupMessages } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { senderId, groupId, content } = body

    if (!senderId || typeof senderId !== 'string') {
      return NextResponse.json({ error: 'A valid senderId string is required' }, { status: 400 })
    }
    if (!groupId || typeof groupId !== 'string') {
      return NextResponse.json({ error: 'A valid groupId string is required' }, { status: 400 })
    }
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'A valid content string is required' }, { status: 400 })
    }

    const message = await sendMessage(senderId, groupId, content)
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('POST /api/messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('groupId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!groupId) {
      return NextResponse.json({ error: 'groupId query parameter is required' }, { status: 400 })
    }

    const messages = await getGroupMessages(groupId, limit)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('GET /api/messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
