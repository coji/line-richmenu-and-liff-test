import { Box, Link as ChakraLink, HStack, Spacer } from '@chakra-ui/react'
import { NavLink } from '@remix-run/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <HStack as="nav" spacing={4} p={4}>
        <ChakraLink as={NavLink} to="/">
          Home
        </ChakraLink>
        <ChakraLink as={NavLink} to="/join">
          Join
        </ChakraLink>
        <ChakraLink as={NavLink} to="/login">
          Login
        </ChakraLink>
        <ChakraLink as={NavLink} to="/logout">
          Logout
        </ChakraLink>
        <Spacer />
      </HStack>

      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  )
}
