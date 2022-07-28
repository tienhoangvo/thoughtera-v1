import { Box, Tabs } from "@mantine/core"
import { useRouter } from "next/router"
import { FileDotted, UsersThree } from "phosphor-react"
import { ReactElement, useEffect, useState } from "react"

type CurrentUserLayoutProps = {
  children?: ReactElement
}

const tabs = [
  {
    label: 'Published',
    icon: <UsersThree />,
    href: '/my-stories'
  },
  {
    label: 'Drafts',
    icon: <FileDotted />,
    href: '/my-stories/drafts'
  }
]

const UserStoriesLayout = ({ children }: CurrentUserLayoutProps) => {
  const [active, setActive] = useState(0)
  const router = useRouter()

  const pathname = router.pathname

  useEffect(() => {
    setActive(tabs.findIndex(tab => tab.href === pathname))
  }, [pathname])

  
  return (
    <Box>
      <Tabs active={active} onTabChange={(_, key: string) => {
        router.push(key)
      }} mb="xs">
        {
          tabs.map((tab) => (   
            <Tabs.Tab key={tab.label} tabKey={tab.href}  {...tab} />
          ))
        }
      </Tabs>

      {children}
    </Box>
  )
}

export default UserStoriesLayout