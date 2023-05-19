import type { LineUser } from '@prisma/client'
import { prisma } from '~/db.server'

export const followLineUser = async (lineUserId: LineUser['lineUserId']) => {
  return await prisma.lineUser.upsert({
    where: { lineUserId },
    create: { lineUserId, isFollowed: true, status: null, name: null },
    update: { lineUserId, isFollowed: true },
  })
}

export const unfollowLineUser = async (lineUserId: LineUser['lineUserId']) => {
  return await prisma.lineUser.update({
    where: { lineUserId },
    data: { isFollowed: false, status: null, name: null },
  })
}

export const getLineUserByLineUserId = async (lineUserId: string) => {
  return await prisma.lineUser.findUnique({ where: { lineUserId } })
}

export const getLineUserStatus = async (lineUserId: string) => {
  const ret = await prisma.lineUser.findUniqueOrThrow({
    where: { lineUserId },
    select: {
      name: true,
      status: true,
      _count: {
        select: { lineUserMessages: true },
      },
    },
  })
  return {
    name: ret.name,
    status: ret.status,
    messages: Number(ret._count.lineUserMessages),
  }
}
