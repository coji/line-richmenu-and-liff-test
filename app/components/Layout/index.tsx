import { Box, Link as ChakraLink, HStack, Spacer } from '@chakra-ui/react'
import { NavLink } from '@remix-run/react'
import { useOptionalUser } from '~/hooks/user'

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useOptionalUser()

  return (
    <Box>
      <HStack as="nav" spacing={4} p={4}>
        <ChakraLink as={NavLink} to="/">
          Home
        </ChakraLink>
        {user && (
          <ChakraLink as={NavLink} to="/richmenu">
            Rich Menu
          </ChakraLink>
        )}
        <Spacer />
        {user ? (
          <ChakraLink as={NavLink} to="/login">
            Login
          </ChakraLink>
        ) : (
          <ChakraLink as={NavLink} to="/login">
            Login
          </ChakraLink>
        )}
      </HStack>

      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  )
}
