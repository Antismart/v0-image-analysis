import { NextResponse } from 'next/server'
import { createGroup, addUserToGroup } from '@/lib/group-chat-service'

export async function POST(req: Request) {
  const { action, name, userId, groupId } = await req.json()
  if (action === 'create') {
    const group = await createGroup(name)
    return NextResponse.json(group)
  }
  if (action === 'addUser') {
    const membership = await addUserToGroup(userId, groupId)
    return NextResponse.json(membership)
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
