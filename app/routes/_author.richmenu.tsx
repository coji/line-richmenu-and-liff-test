import { Box, Button, Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, Link as RemixLink, useLoaderData } from '@remix-run/react'
import { listLineRichMenu } from '~/services/line-richmenu.server'
import { requireUserId } from '~/services/session.server'

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request)
  const richMenus = await listLineRichMenu()
  return json({ richMenus })
}

export default function RichMenuPage() {
  const { richMenus } = useLoaderData<typeof loader>()

  return (
    <Box>
      <Stack>
        <Heading>Rich menus</Heading>
        <Box>
          <Button as={RemixLink} to="new" colorScheme="blue" variant="outline">
            Add
          </Button>
        </Box>
      </Stack>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Selected</Th>
              <Th>Name</Th>
              <Th>Chat Bar text</Th>
              <Th>Width</Th>
              <Th>Height</Th>
              <Th>Areas</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {richMenus.map((richMenu) => (
              <Tr key={richMenu.richMenuId}>
                <Td>{richMenu.selected && 'SELECTED'}</Td>
                <Td>{richMenu.name}</Td>
                <Td>{richMenu.chatBarText}</Td>
                <Td>{richMenu.size.width}</Td>
                <Td>{richMenu.size.height}</Td>
                <Td>{richMenu.areas.length}</Td>
                <Td>
                  <Button as={Link} size="xs" colorScheme="blue" variant="outline" to={`${richMenu.richMenuId}`}>
                    Detail
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Outlet />
    </Box>
  )
}
