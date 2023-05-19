import { Box, Center, Heading } from '@chakra-ui/react'
import { useLiff } from '~/hooks/liff'

export default function PurchasePage() {
  const { liff, lineUserId } = useLiff()

  return (
    <Center h="100dvh">
      <Box textAlign="center">
        <Heading>Purchase</Heading>
        <Box>
          <Box>LINE Version: {JSON.stringify(liff?.getLineVersion() ?? 'undefined')}</Box>
          <Box>LineUserId: {lineUserId}</Box>
        </Box>
      </Box>
    </Center>
  )
}
