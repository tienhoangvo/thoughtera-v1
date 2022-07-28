import { Divider } from '@mantine/core'
import { Article, House, PenNib, Person, SignIn } from 'phosphor-react'

import MainLink from '../MainLink'

const links = {
  public: [
    {
      icon: <House />,
      color: 'blue',
      label: 'Home',
      href: '/',
    },
  ],
  private: [
    {
      icon: <Article />,
      color: 'orange',
      label: 'Your stories',
      href: '/my-stories',
    },
    {
      icon: <PenNib />,
      color: 'grape',
      label: 'Write',
      href: '/new-story',
    },
  ],
  auth: [
    {
      icon: <Person />,
      color: 'teal',
      label: 'Sign in',
      href: '/sign-in',
    },
    {
      icon: <SignIn />,
      color: 'violet',
      label: 'Sign up',
      href: '/sign-up',
    },
  ],
}
const MainLinks = () => {
  const privateLinks = links.private.map((link) => (
    <MainLink
      key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  ))

  const publicLinks = links.public.map((link) => (
    <MainLink
      key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  ))

  const authLinks = links.auth.map((link) => (
    <MainLink
      key={link.label}
      icon={link.icon}
      color={link.color}
      label={link.label}
      href={link.href}
    />
  ))
  return (
    <div>
      {publicLinks}
      <Divider size="sm" my="lg" />
      {privateLinks}
    </div>
  )
}

export default MainLinks
