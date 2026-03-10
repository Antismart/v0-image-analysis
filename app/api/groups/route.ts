import { NextResponse } from 'next/server'
import { createGroup, addUserToGroup } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, name, userId, groupId } = body

    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'A valid action string is required' }, { status: 400 })
    }

    if (action === 'create') {
      if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'A valid name string is required to create a group' }, { status: 400 })
      }
      const group = await createGroup(name)
      return NextResponse.json(group, { status: 201 })
    }

    if (action === 'addUser') {
      if (!userId || typeof userId !== 'string') {
        return NextResponse.json({ error: 'A valid userId string is required' }, { status: 400 })
      }
      if (!groupId || typeof groupId !== 'string') {
        return NextResponse.json({ error: 'A valid groupId string is required' }, { status: 400 })
      }
      const membership = await addUserToGroup(userId, groupId)
      return NextResponse.json(membership)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/groups error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
