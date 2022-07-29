import { Divider, NavLink, ThemeIcon } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Article, House, PenNib, Person, SignIn } from 'phosphor-react'

import MainLink from '../MainLink'

const links = [
  {
    icon: <House />,
    color: 'blue',
    label: 'Home',
    href: '/',
  },
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
]
const MainLinks = () => {
  const router = useRouter()
  const { pathname } = router
  const getActiveStatus = (href: string) => {
    let selected = false

    if (pathname === '/') {
      selected = href === '/'
    }

    if (href !== '/') {
      console.log(href, pathname)
      selected = pathname.startsWith(href)
    }
    return selected
  }

  return (
    <div>
      {links.map((link) => (
        <Link href={link.href} passHref key={link.href}>
          <NavLink
            component="a"
            active={getActiveStatus(link.href)}
            label={link.label}
            icon={<ThemeIcon variant="light">{link.icon}</ThemeIcon>}
          />
        </Link>
      ))}
    </div>
  )
}

export default MainLinks
