import { Avatar, Box, Center, Heading, Skeleton, VStack } from '@chakra-ui/react'
import { useLiff } from '~/hooks/liff'
import { useLineUserStatus } from '~/hooks/line-user-status'

export default function StatusPage() {
  const { profile, idToken } = useLiff()
  const lineUserStatus = useLineUserStatus(idToken)

  return (
    <Center h="100dvh">
      <VStack>
        <Heading size="sm">ステータス</Heading>
        <Avatar src={profile?.picture}></Avatar>
        <Box textAlign="center">
          <Skeleton w="8rem" isLoaded={!!profile?.name}>
            {profile?.name ?? 'user'}
          </Skeleton>
        </Box>
        <Box textAlign="center">
          <Skeleton w="8rem" isLoaded={lineUserStatus.isSuccess}>
            メッセージ: {`${lineUserStatus?.data?.messages ?? ''}通`}
          </Skeleton>
        </Box>
      </VStack>
    </Center>
  )
}
