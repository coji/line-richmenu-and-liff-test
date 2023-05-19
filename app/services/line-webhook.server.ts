import { Client, type WebhookEvent, type WebhookRequestBody } from '@line/bot-sdk'
import { setTimeout } from 'timers/promises'
import invariant from 'tiny-invariant'
import { followLineUser, unfollowLineUser } from '~/models/line_user.server'
import { addLineUserMessage } from '~/models/line_user_message.server'

const handleLineWebhookEvent = async (client: InstanceType<typeof Client>, event: WebhookEvent) => {
  switch (event.type) {
    case 'follow':
      invariant(event.source.userId)
      await followLineUser(event.source.userId)
      break
    case 'unfollow':
      invariant(event.source.userId)
      await unfollowLineUser(event.source.userId)
      break
    case 'message':
      invariant(event.source.userId)
      if (event.message.type === 'text') {
        await addLineUserMessage({ lineUserId: event.source.userId, message: event.message.text })
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'message received: ' + JSON.stringify(event.message),
        })
      }
      break
    case 'postback':
      invariant(event.source.userId)
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'postback received: ' + JSON.stringify(event.postback),
      })
    default:
      break
  }

  await setTimeout(500)
}

export const handleLineWebhook = async ({ destination, events }: WebhookRequestBody) => {
  invariant(process.env.LINE_ACCESS_TOKEN)
  const client = new Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  })

  console.time('handleLineWebhook')
  console.dir(events)

  for (const event of events) {
    await handleLineWebhookEvent(client, event)
  }

  console.timeEnd('handleLineWebhook')
  return
}
