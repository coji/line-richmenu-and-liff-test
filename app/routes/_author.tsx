import { Outlet } from '@remix-run/react'
import { Layout } from '~/components/Layout'

export default function Index() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
