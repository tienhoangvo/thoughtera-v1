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
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { signUp } from '../lib/client/services/auth'

const SignUpPage = () => {
  const [status, setStatus] = useState<'idle' | 'signing-up'>('idle')

  const router = useRouter()

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
    const name = formData.get('name')
    const email = formData.get('email')
    setStatus('signing-up')
    signUp({
      name: name as string,
      email: email as string,
      username: username as string,
      password: password as string,
    }).then((res) => {
      if (res.status === 'success') router.push('/sign-in')

      if (res.status === 'failed') {
        setStatus('idle')
        showNotification({
          title: 'Sign up failed',
          message: res.message,
          color: 'red',
        })
      }
    })
  }

  return (
    <Card sx={{ width: '400px', marginInline: 'auto' }} withBorder p="lg">
      <LoadingOverlay visible={status === 'signing-up'} />
      <Text
        component="h1"
        align="center"
        mb="lg"
        sx={{ fontFamily: 'inherit', fontSize: '25px' }}
      >
        Sign up
      </Text>
      <form onSubmit={handleFormSubmit}>
        <TextInput
          required
          label="Name"
          size="sm"
          mb="md"
          type="text"
          name="name"
          autoComplete="off"
        />
        <TextInput
          required
          label="Email"
          size="sm"
          mb="md"
          type="email"
          name="email"
          autoComplete="off"
        />
        <TextInput
          required
          label="Username"
          size="sm"
          mb="md"
          type="text"
          name="username"
          autoComplete="off"
        />
        <TextInput
          required
          label="Password"
          size="sm"
          mb="md"
          type="password"
          name="password"
          autoComplete="off"
        />
        <Group position="apart">
          <Link href="/sign-in" passHref>
            <Button variant="subtle" component="a">
              I have an account
            </Button>
          </Link>
          <Button type="submit" variant="light">
            Sign up
          </Button>
        </Group>
      </form>
    </Card>
  )
}

export default SignUpPage
