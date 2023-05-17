import { validateSignature, type WebhookRequestBody } from '@line/bot-sdk'
import { json, type ActionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { handleLineWebhook } from '~/services/line-webhook.server'

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET
invariant(LINE_CHANNEL_SECRET, 'LINE_CHANNEL_SECRET is not defined')

export const action = async ({ request }: ActionArgs) => {
  const signature = request.headers.get('X-Line-Signature')
  if (!signature) {
    return json({}, { status: 401 })
  }

  const body = await request.text()
  const isValid = validateSignature(body, LINE_CHANNEL_SECRET, signature)
  if (!isValid) {
    return json({}, { status: 401 })
  }

  void handleLineWebhook(JSON.parse(body) as WebhookRequestBody)
  return json({}, { status: 200 })
}
