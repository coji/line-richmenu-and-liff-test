import { Box, Center, Heading } from '@chakra-ui/react'
import { useLiff } from '~/hooks/liff'

export default function PurchasePage() {
  const { liff, profile } = useLiff()

  return (
    <Center h="100dvh">
      <Box textAlign="center">
        <Heading>Purchase</Heading>
        <Box>
          <Box>LINE Version: {JSON.stringify(liff?.getLineVersion() ?? 'undefined')}</Box>
          <Box>name: {profile?.name}</Box>
        </Box>
      </Box>
    </Center>
  )
}
