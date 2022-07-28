import { AppShell } from "@mantine/core"
import { ReactElement } from "react"
import Navbar from "./Navbar"
type MainLayoutProps = {
  children: ReactElement
}
const MainLayout = ({ children }:MainLayoutProps) => {

  return (
    <AppShell navbar={<Navbar/>} fixed>
      {children}
    </AppShell>
  )
}

export default MainLayout