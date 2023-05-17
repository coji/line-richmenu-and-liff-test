import { Button, FormControl, FormErrorMessage, FormLabel, Input, Link, Stack, Text } from '@chakra-ui/react'
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link as RemixLink, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { createUser, getUserByEmail } from '~/models/user.server'
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

  if (!validateEmail(email)) {
    return json({ errors: { email: 'Email is invalid', password: null } }, { status: 400 })
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json({ errors: { email: null, password: 'Password is required' } }, { status: 400 })
  }

  if (password.length < 8) {
    return json({ errors: { email: null, password: 'Password is too short' } }, { status: 400 })
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return json(
      {
        errors: {
          email: 'A user already exists with this email',
          password: null,
        },
      },
      { status: 400 },
    )
  }

  const user = await createUser(email, password)

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  })
}

export const meta: V2_MetaFunction = () => [{ title: 'Sign Up' }]

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
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
    <Form method="post">
      <Stack>
        <FormControl>
          <FormLabel htmlFor="email">Email address</FormLabel>

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
          />

          {actionData?.errors?.email ? (
            <FormErrorMessage id="email-error">{actionData.errors.email}</FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
          />
          {actionData?.errors?.password ? (
            <FormErrorMessage id="password-error">{actionData.errors.password}</FormErrorMessage>
          ) : null}
        </FormControl>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" colorScheme="blue">
          Create Account
        </Button>

        <Text textAlign="end">
          Already have an account?{' '}
          <Link
            as={RemixLink}
            to={{
              pathname: '/login',
              search: searchParams.toString(),
            }}
            color="blue.500"
            textDecoration="underline"
          >
            Log in
          </Link>
        </Text>
      </Stack>
    </Form>
  )
}
