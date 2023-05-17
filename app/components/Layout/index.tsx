import { Box, Button, Link as ChakraLink, HStack, Spacer } from '@chakra-ui/react'
import { NavLink, Link as RemixLink } from '@remix-run/react'
import { useOptionalUser } from '~/hooks/user'

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useOptionalUser()

  return (
    <Box px="4" py="2">
      <HStack as="nav" spacing="4">
        <ChakraLink as={NavLink} to="/">
          Home
        </ChakraLink>
        {!!user && (
          <ChakraLink as={NavLink} to="/richmenu">
            Rich Menu
          </ChakraLink>
        )}
        <Spacer />
        {user ? (
          <form method="post" action="/logout">
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        ) : (
          <Button as={RemixLink} to="/login" variant="outline" size="sm">
            Login
          </Button>
        )}
      </HStack>

      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  )
}
