import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Textarea,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import { createAndUploadImageLineRichMenu } from '~/services/line-richmenu.server'
import { requireUserId } from '~/services/session.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request)
  return json({})
}

export const action = async ({ request }: ActionArgs) => {
  await requireUserId(request)

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      console.log({ name, contentType, filename, data })
      if (name !== 'avatar') {
        return undefined
      }
      console.log('uploading to line')
      const ret = await createAndUploadImageLineRichMenu(data, contentType)
      console.log('uploaded to line', ret)
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler(),
  )

  try {
    const formData = await unstable_parseMultipartFormData(request, uploadHandler)
    const imageUrl = formData.get('avatar')
    console.log(imageUrl)
  } catch (e) {
    console.log(e)
  }
  return redirect('..')
}

export default function RichMenuNewPage() {
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
        <ModalHeader>リッチメニューの作成</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form method="post" id="richmenu-create" encType="multipart/form-data">
            <Input type="file" name="avatar" id="avatar" />
            <Input type="text" name="name" id="name" />
            <Input type="checkbox" name="selected" id="selected" />
            <Textarea name="body" id="body" />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button>キャンセル</Button>
          <Spacer />
          <Button type="submit" form="richmenu-create" colorScheme="blue">
            作成
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
