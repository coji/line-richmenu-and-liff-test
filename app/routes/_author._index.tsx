import { Box } from '@chakra-ui/react'
import { Layout } from '~/components/Layout'
import { useOptionalUser } from '~/hooks/user'

export default function Index() {
  const user = useOptionalUser()
  return (
    <Layout>
      <main>
        <Box color="red.500">hello {JSON.stringify(user)}</Box>
      </main>
    </Layout>
  )
}
