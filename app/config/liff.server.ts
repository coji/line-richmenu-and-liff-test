import invariant from 'tiny-invariant'

invariant(process.env.LIFF_ID, 'LIFF_ID is not defined')
invariant(process.env.LIFF_CHANNEL_ID, 'LIFF_CHANNEL_ID is not defined')

export const liffId = process.env.LIFF_ID
export const liffChannelId = process.env.LIFF_CHANNEL_ID
