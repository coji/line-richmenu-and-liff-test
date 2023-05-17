import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createAndUploadImageLineRichMenu, listLineRichMenu } from '~/services/line-richmenu.server'
import { getUserId } from '~/services/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  const richMenus = await listLineRichMenu()
  return json({ richMenus })
}

export const action = async ({ request }: ActionArgs) => {
  const userId = getUserId(request)

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
  } catch (e) {
    console.log(e)
  }
  return json({})
}

export default function RichMenuPage() {
  const { richMenus } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>rich menu upload</h1>
      <form method="post" encType="multipart/form-data">
        <input type="file" name="avatar" />
        <button type="submit">submit</button>
      </form>

      <div>
        <h2>rich menus</h2>
        {richMenus.map((richMenu) => (
          <div key={richMenu.richMenuId}>
            <div>{richMenu.richMenuId}</div>
            <div>{richMenu.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
