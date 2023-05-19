import { json, type LoaderArgs } from '@remix-run/node'
import { liffChannelId } from '~/config/liff.server'
import { getLineUserStatus } from '~/models/line_user.server'

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const idToken = url.searchParams.get('id_token')
  if (!idToken) {
    return new Response('idToken is should be specified', { status: 400 })
  }

  const ret = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: liffChannelId,
    }),
  })
  if (!ret.ok) {
    const err = (await ret.json()) as { error: string; error_description: string }
    return new Response(`${err.error}: ${err.error_description}`, { status: 400 })
  }

  const { sub: userId } = (await ret.json()) as { sub: string }
  const status = await getLineUserStatus(userId)
  if (!status) {
    return new Response('lineUser is not found', { status: 404 })
  }
  return json({ ...status }, { status: 200 })
}
