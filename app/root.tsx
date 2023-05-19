import { Box, ChakraProvider, Divider, Heading, Text } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { V2_MetaFunction } from '@remix-run/react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import React from 'react'
import { theme } from './theme'

import { getUser } from '~/services/session.server'

export const meta: V2_MetaFunction = () => [{ title: 'LINE Richmenu Test' }]

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) })
}

interface DocumentProps {
  children: React.ReactNode
  title?: string
}

const Document = ({ children, title }: DocumentProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Box>
        <Heading as="h1">There was an error</Heading>
        <Text>{String(error)}</Text>
        <Divider />
        <Text>Hey, developer, you should replace this with what you want your users to see.</Text>
      </Box>
    </Document>
  )
}
