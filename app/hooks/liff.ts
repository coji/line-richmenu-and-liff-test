/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type liff as Liff } from '@line/liff'
import { useRouteLoaderData } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'

interface LineUserProfile {
  lineUserId: string
  name?: string
  picture?: string
}

export const useLiff = () => {
  const { liffId } = useRouteLoaderData('routes/liff') as { liffId: string; liffChannelId: string }
  const didLoadRef = useRef(false)
  const [liffObj, setLiffObj] = useState<typeof Liff>()
  const [idToken, setIdToken] = useState<string>()
  const [profile, setProfile] = useState<LineUserProfile>()

  // Load LIFF SDK
  useEffect(() => {
    if (typeof window === 'undefined' || didLoadRef.current === true || liffId === undefined) return
    didLoadRef.current = true
    const init = async () => {
      const { liff: liffObj } = await import('@line/liff')
      await liffObj.init({
        liffId,
        withLoginOnExternalBrowser: true,
      })
      const idToken = liffObj.getIDToken() ?? undefined
      const dToken = liffObj.getDecodedIDToken()
      setLiffObj(liffObj)
      setIdToken(idToken)
      setProfile(
        dToken
          ? {
              lineUserId: dToken.sub!,
              name: dToken.name,
              picture: dToken.picture,
            }
          : undefined,
      )
    }
    void init()
  }, [liffId])

  return { liff: liffObj, profile, idToken }
}
