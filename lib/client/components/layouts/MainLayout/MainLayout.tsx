import {
  ActionIcon,
  AppShell,
  Aside,
  Avatar,
  Blockquote,
  Group,
  Stack,
  Text,
  useMantineTheme,
  NavLink,
  Box,
  ThemeIcon,
  Button,
  Input,
  CopyButton,
  Tooltip,
} from '@mantine/core'
import {
  Check,
  Copy,
  DiscordLogo,
  Envelope,
  FacebookLogo,
  GithubLogo,
  LinkedinLogo,
  Quotes,
  RedditLogo,
  TwitchLogo,
  UserPlus,
  WhatsappLogo,
  YoutubeLogo,
} from 'phosphor-react'
import { ReactElement } from 'react'
import { UserType } from '../../../../server/services/mongodb/queries'
import Navbar from './Navbar'

type MainLayoutProps = {
  children: ReactElement
  user?: UserType
}
const MainLayout = ({ children, user }: MainLayoutProps) => {
  const asideProps = user
    ? {
        aside: (
          <Aside width={{ base: 300 }} sx={{ border: 'none' }} p="lg">
            <Aside.Section>
              <Stack align="center">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size={100}
                  radius={100}
                  placeholder="U"
                />
                <Stack align="center" spacing={0}>
                  <Text weight="bold">{user.name}</Text>
                  <Text size="sm">@{user.username}</Text>
                </Stack>
              </Stack>
            </Aside.Section>
            <Aside.Section p="md">
              <Button fullWidth leftIcon={<UserPlus />} mb="lg" variant="light">
                Follow
              </Button>
              <CopyButton value={user.email}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                    <Button
                      sx={{
                        overflow: 'hidden',
                        width: '100%',
                      }}
                      color="gray"
                      onClick={copy}
                      variant="light"
                      value={user.email}
                      leftIcon={copied ? <Check /> : <Copy />}
                    >
                      tuanphanthe@gmail.com tuanphanthe@gmail.com
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            </Aside.Section>
          </Aside>
        ),
      }
    : {}
  return (
    <AppShell navbar={<Navbar />} fixed {...asideProps} padding={0}>
      {children}
    </AppShell>
  )
}

export default MainLayout
