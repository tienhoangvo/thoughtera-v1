import { Container, LoadingOverlay } from '@mantine/core'

import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import StoryListItemAuthor from '../../lib/client/components/stories/StoryListItemAuthor'
import StoryList from '../../lib/client/components/stories/StoryList/StoryList'
import {  StoryType } from '../../lib/client/services/stories'
import connectDB from '../../lib/server/services/mongodb/connectDB'
import getCollection from '../../lib/server/services/mongodb/getCollection'
import { StoryListType } from '../../lib/server/services/mongodb/queries'


const UserStoriesPage: NextPage = (props : { stories?: StoryListType }) => {
  const router = useRouter()
  const stories = props.stories || []

  if (router.isFallback) {
    return (
      <LoadingOverlay visible/>
    )
  }

  return (
    <Container size="md">
      <StoryList stories={stories} renderListItem={ story => <StoryListItemAuthor story={story}/>}/>
    </Container>
  )
}



export const getStaticProps : GetStaticProps = async (context) => {
  const username = context.params?.username as string

  const db = await connectDB()

  const userCollection = getCollection(db)('users')
  const storyCollection = getCollection(db)('stories')
  const user = await userCollection.findOne({ username: username.replace('@', '') }, {
    projection: {
      password: 0
    }
  })

  if (!user) {
    return {
      notFound: true
    }
  }

  const stories = await storyCollection.find( { userId: user._id.toString(), published: true }, { projection: { content: 0 }}).toArray()

  return {
    props: {
      stories: JSON.parse(JSON.stringify(stories)) as StoryType
    }
  }

}

export const getStaticPaths : GetStaticPaths = async (context) => {
  const db = await connectDB()

  console.log('getStaticPaths context', context)
  const userCollection = getCollection(db)('users')

  

  const users = await userCollection.find({}, {
    projection: {
      username: 1
    }
  }).toArray()

  console.log(users)

  const usernamePaths = users.map(user => {
    return {
      params: {
        username: '@' + user.username
      }
    }
  })

  return {
    paths: usernamePaths,
    fallback: true
  }
}

export default UserStoriesPage
