import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { liffChannelId, liffId } from '~/config/liff.server'

const queryClient = new QueryClient()

export const meta: V2_MetaFunction = () => {
  return [{ title: 'richmenu LIFF Index', description: 'Index' }]
}
export const loader = ({ request }: LoaderArgs) => {
  return json({
    liffId,
    liffChannelId,
  })
}

export default function LiffLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
