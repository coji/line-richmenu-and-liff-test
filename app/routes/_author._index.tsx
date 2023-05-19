import { Box } from '@chakra-ui/react'
import { useOptionalUser } from '~/hooks/user'

export default function Index() {
  const user = useOptionalUser()
  return <Box color="red.500">hello {JSON.stringify(user)}</Box>
}
