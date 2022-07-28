import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

type MainLinkProps = {
  icon: ReactNode
  color: string
  label: string
  href: string
}
const MainLink = ({ icon, color, label, href }: MainLinkProps) => {
  const router = useRouter()
  const { pathname } = router

  let selected = false

  if (pathname === '/') {
    selected = href === '/'
  }

  if (href !== '/') {
    console.log(href, pathname)
    selected = pathname.startsWith(href)
  }
  return (
    <Link href={href} passHref>
      <UnstyledButton
        component="a"
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          backgroundColor: selected
            ? theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0]
            : 'none',
          ':hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>
          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  )
}

export default MainLink
