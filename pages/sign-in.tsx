import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Text,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import VerifyEmailModal from '../lib/client/components/modals/VerifyEmailModal'
import { signIn } from '../lib/client/services/auth'

type UserData = {
  userId: string
  userEmail: string
} | null
const SignInPage = () => {
  const [status, setStatus] = useState('idle')
  const [userData, setUserData] = useState<UserData>(null)
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    setStatus('signing-up')
    signIn({
      username: username as string,
      password: password as string,
    }).then((res) => {
      if (res.status === 'success') {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }

      if (res.status === 'failed') {
        setStatus('idle')

        showNotification({
          title: 'Sign in failed!',
          color: 'red',
          message: res.message,
        })

        if (res.userId) {
          setUserData({
            userEmail: res.userEmail as string,
            userId: res.userId as string,
          })
        }
      }
    })
  }

  const handleVerifyEmailClose = () => {
    setUserData(null)
  }

  return (
    <Card sx={{ width: '400px', marginInline: 'auto' }} p="lg" withBorder>
      <LoadingOverlay visible={status === 'signing-up'} />
      <VerifyEmailModal
        opened={!!userData}
        userEmail={userData?.userEmail}
        userId={userData?.userId}
        onClose={handleVerifyEmailClose}
      />
      <Text
        component="h1"
        align="center"
        mb="lg"
        sx={{ fontFamily: 'inherit', fontSize: '25px' }}
      >
        Sign in
      </Text>
      <form onSubmit={handleFormSubmit}>
        <TextInput
          required
          label="Username"
          mb="md"
          name="username"
          type="text"
        />
        <TextInput
          required
          label="Password"
          mb="md"
          name="password"
          type="password"
        />
        <Group position="apart">
          <Link href="/sign-up" passHref>
            <Button variant="subtle">{`I don't have an account`}</Button>
          </Link>
          <Button type="submit" variant="light">
            Sign in
          </Button>
        </Group>
      </form>
    </Card>
  )
}

export default SignInPage
