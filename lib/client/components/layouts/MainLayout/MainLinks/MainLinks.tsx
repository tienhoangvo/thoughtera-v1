import { Divider } from "@mantine/core"
import { BellIcon, BookmarkIcon, EnterIcon, FileTextIcon, HomeIcon, Pencil2Icon, PersonIcon } from "@modulz/radix-icons"
import useCurrentUser from "../../../../hooks/useData/useCurrentUser"
import MainLink from "../MainLink"

const links = {
  "public": [
    {
      icon: <HomeIcon />,
      color: 'blue',
      label: 'Home',
      href: '/'
    }],
  "private": [
    {
      icon: <FileTextIcon />,
      color: 'orange',
      label: 'Your stories',
      href: '/my-stories'
    },
    {
      icon: <Pencil2Icon />,
      color: 'grape',
      label: 'Write',
      href: '/new-story'
    }
  ],
  auth: [
    {
      icon: <PersonIcon />,
      color: 'teal',
      label: 'Sign in',
      href: '/sign-in'
    },
    {
      icon: <EnterIcon />,
      color: 'violet',
      label: 'Sign up',
      href: '/sign-up'
    }
  ]
}
const MainLinks = () => {
  const { user } = useCurrentUser()

  const privateLinks = links.private.map(link => (
    <MainLink key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  )
  )

  const publicLinks = links.public.map(link => (
    <MainLink key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  )
  )


  const authLinks = links.auth.map(link => (
    <MainLink key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  )
  )
  return (
    <div>
      {publicLinks}
      <Divider size="sm" my="lg" />
      {privateLinks}

    </div>
  )
}

export default MainLinks