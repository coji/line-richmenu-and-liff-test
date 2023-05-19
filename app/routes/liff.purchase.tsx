import { Box, Button, Center, Heading, Stack } from '@chakra-ui/react'
import { useLiff } from '~/hooks/liff'

export default function PurchasePage() {
  const { liff, profile } = useLiff()

  return (
    <Center h="100dvh">
      <Stack textAlign="center">
        <Heading>Purchase</Heading>

        <Box>名前: {profile?.name}</Box>

        <Button onClick={() => liff?.closeWindow()} w="full">
          閉じる
        </Button>
      </Stack>
    </Center>
  )
}
