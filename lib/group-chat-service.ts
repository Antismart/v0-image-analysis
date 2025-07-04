import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// Create or find a user by address
export async function upsertUser(address: string) {
  return prisma.user.upsert({
    where: { address },
    update: {},
    create: { address },
  });
}

// Create a group
export async function createGroup(name: string) {
  return prisma.group.create({
    data: { name },
  });
}

// Add a user to a group
export async function addUserToGroup(userId: string, groupId: string) {
  return prisma.groupMembership.upsert({
    where: { userId_groupId: { userId, groupId } },
    update: {},
    create: { userId, groupId },
  });
}

// Send a message to a group
export async function sendMessage(senderId: string, groupId: string, content: string) {
  return prisma.message.create({
    data: { senderId, groupId, content },
  });
}

// Fetch messages for a group
export async function getGroupMessages(groupId: string, limit = 50) {
  return prisma.message.findMany({
    where: { groupId },
    orderBy: { sentAt: 'desc' },
    take: limit,
    include: { sender: true },
  });
}
