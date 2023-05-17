import { Box, HStack, Text } from '@chakra-ui/react'
import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/hooks/user'

export default function Index() {
  const user = useOptionalUser()
  return (
    <main>
      <HStack>
        <Text>
          <Link to="login">Login</Link>
        </Text>
        <Text>
          <Link to="join">Join</Link>
        </Text>

        <Box color="red.500">hello {JSON.stringify(user)}</Box>
      </HStack>
    </main>
  )
}
