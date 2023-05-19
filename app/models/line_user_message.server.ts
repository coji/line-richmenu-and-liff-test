import type { Prisma } from '@prisma/client'
import { prisma } from '~/db.server'
import { followLineUser } from './line_user.server'

export const addLineUserMessage = async (data: Prisma.LineUserMessageUncheckedCreateInput) => {
  const lineUser = await followLineUser(data.lineUserId)
  return await prisma.lineUserMessage.create({
    data: {
      ...data,
      lineUserId: lineUser.id,
    },
  })
}
