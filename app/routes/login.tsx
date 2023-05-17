import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link as RemixLink, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { verifyLogin } from '~/models/user.server'
import { createUserSession, getUserId } from '~/services/session.server'
import { safeRedirect, validateEmail } from '~/utils'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const remember = formData.get('remember')

  if (!validateEmail(email)) {
    return json({ errors: { email: 'Email is invalid', password: null } }, { status: 400 })
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json({ errors: { email: null, password: 'Password is required' } }, { status: 400 })
  }

  if (password.length < 8) {
    return json({ errors: { email: null, password: 'Password is too short' } }, { status: 400 })
  }

  const user = await verifyLogin(email, password)

  if (!user) {
    return json({ errors: { email: 'Invalid email or password', password: null } }, { status: 400 })
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  })
}

export const meta: V2_MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/notes'
  const actionData = useActionData<typeof action>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <Form method="post" className="space-y-6">
      <Stack>
        <FormControl>
          <FormLabel htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </FormLabel>
          <Input
            ref={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
          {actionData?.errors?.email ? (
            <FormErrorMessage className="pt-1 text-red-700" id="email-error">
              {actionData.errors.email}
            </FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </FormLabel>
          <Input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
          {actionData?.errors?.password ? (
            <FormErrorMessage className="pt-1 text-red-700" id="password-error">
              {actionData.errors.password}
            </FormErrorMessage>
          ) : null}
        </FormControl>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" colorScheme="blue">
          Log in
        </Button>

        <Flex justify="center" gap="4">
          <FormControl display="flex" alignItems="center" gap="2" w="auto">
            <Checkbox id="remember" name="remember" />
            <FormLabel htmlFor="remember" m="0">
              Remember me
            </FormLabel>
          </FormControl>

          <Box flex="1" textAlign="end">
            <Text display="inline">Don't have an account? </Text>
            <Link
              display="inline"
              as={RemixLink}
              to={{
                pathname: '/join',
                search: searchParams.toString(),
              }}
              color="blue.500"
              textDecoration="underline"
            >
              Sign up
            </Link>
          </Box>
        </Flex>
      </Stack>
    </Form>
  )
}
