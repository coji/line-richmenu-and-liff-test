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
