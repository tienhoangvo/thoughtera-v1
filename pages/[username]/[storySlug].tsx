import {
  Avatar,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Title,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { StoryType } from '../../lib/client/services/stories'
import connectDB from '../../lib/server/services/mongodb/connectDB'
import getCollection from '../../lib/server/services/mongodb/getCollection'

const StoryPage: NextPage = (props: { story?: StoryType }) => {
  const router = useRouter()
  const story = props.story as StoryType
  if (router.isFallback) return <LoadingOverlay visible={!story} />

  return (
    <Container size="sm">
      <Group>
        <Box>
          <Title order={1}>{story?.title}</Title>
        </Box>
      </Group>
      <Link href={`/@${story?.userData.username}`} passHref>
        <UnstyledButton
          component="a"
          sx={(theme) => ({
            display: 'inline-block',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            ':hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <Avatar
              src={story?.userData.avatar}
              alt={story?.userData.name}
              radius="xl"
            />
            <Box sx={{ flex: 1 }}>
              <Text>{story?.userData.name}</Text>
              <Text color="dimmed" size="xs">
                @{story?.userData.username}
              </Text>
            </Box>
          </Group>
        </UnstyledButton>
      </Link>

      <TypographyStylesProvider mt="lg">
        {story && <div dangerouslySetInnerHTML={{ __html: story.content }} />}
      </TypographyStylesProvider>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const db = await connectDB()

  const storyCollection = getCollection(db)('stories')

  const story = await storyCollection.findOne({
    slug: context.params?.storySlug,
    published: true,
  })

  console.log('getStaticProps context', context)

  if (!story) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      story: JSON.parse(JSON.stringify(story)),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const db = await connectDB()
  const storyCollection = getCollection(db)('stories')

  const stories = await storyCollection
    .find(
      {
        published: true,
      },
      {
        projection: {
          slug: 1,
          userData: 1,
        },
      }
    )
    .toArray()

  const storyPaths = stories.map((story) => {
    return {
      params: {
        username: `@${story.userData.username}`,
        storySlug: story.slug as string,
      },
    }
  })

  console.log('storyPaths', storyPaths)

  return {
    paths: storyPaths,
    fallback: true,
  }
}

export default StoryPage
