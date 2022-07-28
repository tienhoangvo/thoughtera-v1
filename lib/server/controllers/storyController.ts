import { Db, ObjectId } from "mongodb"
import StoryType from "../collectionTypes/StoryType"
import UserType from "../collectionTypes/UserType"
import type { methodHandler } from "../routeHandler"
import getCollection from "../services/mongodb/getCollection"
import slugify from 'slugify'
import connectDB from "../services/mongodb/connectDB"
import { listStoriesByPage } from "../services/mongodb/queries"
import { STORY_LIMIT } from "../services/mongodb/constants"
import { UserSession } from "../utils/auth"

type ListStoriesQuery = {
  username?: string,
  page?: number,
}


export const listStories: methodHandler = async (req, res) => {

  const query = req.query as ListStoriesQuery
  const PAGE = query.page ?? 1

  let filter = query.username ? {
    username: query.username,
    published: true
  } : {
    published: true
  }

  const stories = await listStoriesByPage({ page: PAGE, filter })

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
  res.status(200).json({
    status: 'success',
    page: PAGE,
    limit: STORY_LIMIT,
    noResults: stories.length,
    stories
  })
}

type ListUserStoriesQuery = {
  published?: string,
  page?: number,
}

export const listUserStories: methodHandler = async (req, res) => {
  const { session }: { session: UserSession } = req.body
  const query = req.query as ListUserStoriesQuery
  const PAGE = query.page ?? 1

  let filter = {
    username: session.username,
    published: query.published === 'true'
  }
  const stories = await listStoriesByPage({ page: PAGE, filter })

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')
  res.status(200).json({
    status: 'success',
    page: PAGE,
    limit: STORY_LIMIT,
    noResults: stories.length,
    stories
  })
}

export const addStory: methodHandler = async (req, res) => {

  const { session, title, content, excerpt, published }: { session: UserSession, title: string, content: string, excerpt: string, published: boolean } = req.body

  const db = await connectDB()
  const storyCollection = getCollection(db)('stories')

  const createdAt = new Date()



  try {
    const slug = slugify(title, { lower: true, trim: true, remove: /[*+~.()'"!:@]/g })
    let story = {
      _id: new ObjectId(),
      userId: session._id,
      userData: {
        name: session.name,
        avatar: session.avatar,
        username: session.username
      },
      title,
      content,
      excerpt,
      slug,
      createdAt,
      published: published,
      thumbnail: '/imgs/story_thumbnail.jpg'
    }

    await storyCollection.insertOne(story)

    if (published) {
      res.revalidate(`/@${session.username}`)
    }

    res.status(201).json({
      status: 'success',
      story
    })

  } catch (error: any) {
    if (error.code === 11000) {
      error.message = `${Object.keys(error.keyValue)[0]}: ${Object.values(error.keyValue)[0]} already exists`
    }

    res.status(400).json({
      status: 'failed',
      message: error.message
    })
  }

}

export const getStory: methodHandler = async (req, res) => {
  const db = await connectDB()
  const id = req.query.id as string
  const storyCollection = getCollection(db)('stories')
  let storyId: ObjectId
  let storySlug: string

  let filter = {

  }
  try {
    storyId = new ObjectId(id)

    filter = {
      _id: storyId
    }
  } catch (error) {
    storySlug = id

    filter = {
      slug: storySlug
    }
  }

  console.log(filter)



  const story = await storyCollection.findOne(filter)

  if (!story) {
    return res.status(404).json({
      status: 'failed',
      messange: 'No story found'
    })

    
  }
  res.status(200).json({
    status: 'success',
    story
  })
}

export const updateStory: methodHandler = async (req, res) => {
  const { id } = req.query
  console.log(req.query)

  const { session, ...storyUpdateData }: { session: UserSession, _id: string, title?: string, content?: string, excerpt?: string, published?: boolean } = req.body
  try {
    const db = await connectDB()
    const storyCollection = getCollection(db)('stories')

    let updateObject: any = { updatedAt: new Date() }

    if (storyUpdateData.title) {
      updateObject.slug = slugify(storyUpdateData.title, { lower: true, trim: true, remove: /[*+~.()'"!:@]/g })
    }

    updateObject = { ...updateObject, ...storyUpdateData }



    const userId = session._id
    const _id = new ObjectId(id as string)

    console.log({ userId, _id })
    const data = await storyCollection.findOneAndUpdate({
      _id,
      userId
    }, {
      $set: updateObject
    }, {
      returnDocument: "after"
    })

    res.status(200).json({
      "status": "success",
      story: data.value
    })
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }

}

export const deleteStory: methodHandler = async (req, res) => {
  const { id } = req.query

  const { session }: { session: UserSession } = req.body
  try {
    const db = await connectDB()
    const storyCollection = getCollection(db)('stories')
    const userId = session._id
    const _id = new ObjectId(id as string)
    const data = await storyCollection.findOneAndDelete({
      _id,
      userId
    })

    if (!data.value) {
      throw new Error('No story found')
    }

    res.status(200).json({
      "status": "success",
      data
    })
  } catch (error: any) {
    console.error(error)
    res.status(400).json({
      status: 'failed',
      error: error.message
    })
  }

  res.status(204).end()
}
