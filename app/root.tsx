import { Box, ChakraProvider, Divider, Heading, Text } from '@chakra-ui/react'
import { withEmotionCache } from '@emotion/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { V2_MetaFunction } from '@remix-run/react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import React from 'react'
import { Layout } from './components/Layout'
import ClientStyleContext from './context.client'
import ServerStyleContext from './context.server'
import { theme } from './theme'

import { getUser } from '~/services/session.server'

export const meta: V2_MetaFunction = () => [{ title: 'Remix Notes' }]

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) })
}

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const serverStyleData = React.useContext(ServerStyleContext)
  const clientStyleData = React.useContext(ClientStyleContext)

  // Only executed on client
  React.useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head
    // re-inject tags
    const tags = emotionCache.sheet.tags
    emotionCache.sheet.flush()
    tags.forEach((tag) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      ;(emotionCache.sheet as any)._insertTag(tag)
    })
    // reset cache to reapply global styles
    clientStyleData.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
})

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Layout>
        <Box>
          <Heading as="h1">There was an error</Heading>
          <Text>{String(error)}</Text>
          <Divider />
          <Text>Hey, developer, you should replace this with what you want your users to see.</Text>
        </Box>
      </Layout>
    </Document>
  )
}
