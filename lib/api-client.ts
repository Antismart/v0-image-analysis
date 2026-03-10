export async function apiUpsertUser(address: string) {
  const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }) })
  return res.json()
}

export async function apiCreateGroup(name: string) {
  const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', name }) })
  return res.json()
}

export async function apiAddUserToGroup(userId: string, groupId: string) {
  const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addUser', userId, groupId }) })
  return res.json()
}

export async function apiSendMessage(senderId: string, groupId: string, content: string) {
  const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senderId, groupId, content }) })
  return res.json()
}

export async function apiGetGroupMessages(groupId: string, limit = 50) {
  const res = await fetch(`/api/messages?groupId=${encodeURIComponent(groupId)}&limit=${limit}`)
  return res.json()
}
