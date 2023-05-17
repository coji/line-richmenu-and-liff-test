import { type WebhookRequestBody } from '@line/bot-sdk'
import { setTimeout } from 'timers/promises'

export const handleLineWebhook = async ({ destination, events }: WebhookRequestBody) => {
  console.time('handleLineWebhook')
  console.dir(events)

  await setTimeout(5000)

  console.timeEnd('handleLineWebhook')
  return
}
