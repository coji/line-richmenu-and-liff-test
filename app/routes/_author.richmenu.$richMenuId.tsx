import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { getLineRichMenu } from '~/services/line-richmenu.server'
import { requireUserId } from '~/services/session.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request)

  const { richMenuId } = params
  if (!richMenuId) {
    throw new Response('richMenuId is required', { status: 404 })
  }

  const richMenu = await getLineRichMenu(richMenuId)
  return json({ richMenu })
}

export default function RichMenuDeletePage() {
  const { richMenu } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        navigate('..')
      }}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader>リッチメニュー: {richMenu.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{richMenu.richMenuId}</ModalBody>
        <ModalFooter>
          <Button>キャンセル</Button>
          <Spacer />
          <Button colorScheme="red">削除</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
