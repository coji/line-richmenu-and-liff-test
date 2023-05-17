import { Client } from '@line/bot-sdk'
import invariant from 'tiny-invariant'

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN
invariant(LINE_ACCESS_TOKEN)

// AsyncIterable<Uint8Array>をReadableStreamに変換するユーティリティ関数
function transformAsyncIterableToReadableStream(iterable: AsyncIterable<Uint8Array>): ReadableStream<Uint8Array> {
  const iterator = iterable[Symbol.asyncIterator]()
  return new ReadableStream({
    async pull(controller) {
      const result = await iterator.next()
      if (result.done) {
        controller.close()
      } else {
        controller.enqueue(result.value)
      }
    },
    async cancel() {
      await iterator.return?.()
    },
  })
}

export async function createLineRichMenu(json: object) {
  invariant(LINE_ACCESS_TOKEN)
  const ret = await fetch('https://api.line.me/v2/bot/richmenu', {
    method: 'POST',
    body: JSON.stringify({
      size: {
        width: 2500,
        height: 1686,
      },
      selected: false,
      name: 'Nice rich menu',
      chatBarText: 'Tap to open',
      areas: [
        {
          bounds: { x: 0, y: 0, width: 2500, height: 1686 },
          action: { type: 'postback', data: 'action=buy&item=123' },
        },
      ],
    }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LINE_ACCESS_TOKEN}` },
  })

  if (ret.ok) {
    return (await ret.json()) as { richMenuId: string }
  } else {
    console.dir(ret)
    return null
  }
}

export async function createAndUploadImageLineRichMenu(data: AsyncIterable<Uint8Array>, contentType: string) {
  invariant(LINE_ACCESS_TOKEN)
  const created = await createLineRichMenu({})
  console.log({ created })
  if (!created) {
    return null
  }

  return await fetch(`https://api-data.line.me/v2/bot/richmenu/${created.richMenuId}/content`, {
    method: 'POST',
    body: transformAsyncIterableToReadableStream(data),
    headers: { 'Content-Type': contentType, Authorization: `Bearer ${LINE_ACCESS_TOKEN}` },
  })
}

export const listLineRichMenu = async () => {
  invariant(LINE_ACCESS_TOKEN)
  const client = new Client({
    channelAccessToken: LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
  })
  return await client.getRichMenuList()
}
