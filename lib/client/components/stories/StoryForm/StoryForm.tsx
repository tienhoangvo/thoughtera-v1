import {
  Stack,
  Button,
  Group,
  InputWrapper,
  LoadingOverlay,
  Switch,
  Textarea,
  TextInput,
  Card,
} from '@mantine/core'
import { useRouter } from 'next/router'
import { ArrowLeft, PaperPlaneRight } from 'phosphor-react'
import { ChangeEvent, useRef, useState } from 'react'
import type { StoryDetailsType } from '../../../../server/services/mongodb/queries'
import RichTextEditor from '../RichTextEditor'

export type StorySubmitDataType = {
  title?: string
  excerpt?: string
  content?: string
  published?: boolean
}

type StoryFormProps = {
  story?: StoryDetailsType
  onSave: (
    id: string,
    submitData: StorySubmitDataType,
    finishSaving?: () => void
  ) => void
}

const StoryForm = ({ story, onSave }: StoryFormProps) => {
  const getInitialValue = (
    field: 'content' | 'title' | 'excerpt' | 'published'
  ) => {
    if (story) {
      return story[field]
    }

    if (field === 'published') return false

    if (field === 'content') return '<p><br></p>'

    return ''
  }
  const [content, setContent] = useState(getInitialValue('content') as string)
  const [title, setTitle] = useState(getInitialValue('title') as string)
  const [excerpt, setExcerpt] = useState(getInitialValue('excerpt') as string)
  const [published, setPublished] = useState(
    getInitialValue('published') as boolean
  )
  const [saving, setSaving] = useState(false)

  const storySubmitDataRef = useRef<StorySubmitDataType>({})
  const disabled =
    title.trim().length === 0 ||
    excerpt.trim().length === 0 ||
    content.trim() === '<p><br></p>'
  const router = useRouter()
  const handleContentChange = (value: string) => {
    setContent(value)
    storySubmitDataRef.current.content = value
  }
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    storySubmitDataRef.current.title = event.target.value
  }

  const handleExcerptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setExcerpt(event.target.value)
    storySubmitDataRef.current.excerpt = event.target.value
  }

  const handlePublicSwitchChange = () => {
    setPublished(!published)
    storySubmitDataRef.current.published = !published
  }

  const handelBackClick = () => {
    let href = '/my-stories'
    if (story) {
      if (!story.published) {
        href += '/drafts'
      }
    }
    router.push(href)
  }

  const finishSaving = () => {
    setSaving(false)
  }

  const handleSaveClick = () => {
    setSaving(true)

    if (story) {
      onSave(story._id, storySubmitDataRef.current, finishSaving)
      return
    }

    onSave('', storySubmitDataRef.current, finishSaving)
    storySubmitDataRef.current = {}
  }

  return (
    <Card withBorder>
      <LoadingOverlay visible={saving} />
      <Stack spacing="lg">
        <Group position="apart">
          <Button
            onClick={handelBackClick}
            variant="subtle"
            leftIcon={<ArrowLeft />}
          >
            Back
          </Button>
          <Button
            disabled={disabled}
            onClick={handleSaveClick}
            variant="light"
            color="teal"
            rightIcon={<PaperPlaneRight />}
          >
            Save
          </Button>
        </Group>
        <TextInput
          variant="filled"
          label="Title"
          placeholder="Title of your story"
          value={title}
          onChange={handleTitleChange}
          size="lg"
          mb="lg"
          autoFocus
        />
        <InputWrapper
          size="md"
          label="Public"
          description="Publish your story so that people can see it or keep it as a draft now."
        >
          <Switch
            sx={{ '&>input[type="checkbox"]': { cursor: 'pointer' } }}
            onLabel="ON"
            offLabel="OFF"
            size="lg"
            checked={published}
            onChange={handlePublicSwitchChange}
          />
        </InputWrapper>
        <Textarea
          label="Excerpt"
          variant="filled"
          placeholder="Summarize the content of your article"
          value={excerpt}
          onChange={handleExcerptChange}
          size="md"
          mb="md"
          minRows={3}
          autosize
          maxRows={6}
        />
        <InputWrapper label="Content" size="md">
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            sx={{ minHeight: '500px' }}
          />
        </InputWrapper>
      </Stack>
    </Card>
  )
}

export default StoryForm
