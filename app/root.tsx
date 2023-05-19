import { ChakraProvider } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { V2_MetaFunction } from '@remix-run/react'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { createHead } from 'remix-island'
import { getUser } from '~/services/session.server'
import { theme } from './theme'

export const meta: V2_MetaFunction = () => [{ title: 'LINE Richmenu Test' }]

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) })
}

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
))

export default function App() {
  return (
    <>
      <Head />
      <ChakraProvider theme={theme}>
        <Outlet />
      </ChakraProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  )
}
