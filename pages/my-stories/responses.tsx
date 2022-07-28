import { Title } from "@mantine/core"
import Head from "next/head"

const MyResponsesPage = () => {
  return (
    <>
      <Head>
        <title>Your Reponses</title>
      </Head>
      <div>
        <Title order={2}>Your reponoses</Title>
      </div>
    </>
  )
}

export default MyResponsesPage