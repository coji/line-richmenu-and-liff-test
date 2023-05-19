import { useQuery } from '@tanstack/react-query'
import type { getLineUserStatus } from '~/models/line_user.server'

export const useLineUserStatus = (idToken?: string) =>
  useQuery(
    ['status'],
    async () => {
      const ret = await fetch(`/api/status?id_token=${idToken ?? ''}`)
      return (await ret.json()) as Awaited<ReturnType<typeof getLineUserStatus>>
    },
    { enabled: !!idToken },
  )
