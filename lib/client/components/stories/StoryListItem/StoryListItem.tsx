import { Box, Card, Group, Text, Title, useMantineTheme, Image, Stack, ThemeIcon, Badge, LoadingOverlay, Avatar, Divider } from "@mantine/core"

import Link from "next/link"

import { ReactElement, ReactNode, useState } from "react"

import { StoryListItemType } from "../../../../server/services/mongodb/queries"

import StoryInfoSnippet from "../StoryInfoSnippet"

type StoryListItemProps = {
  story: StoryListItemType,
  renderHeader: (story: StoryListItemType) => ReactNode,
  loader?: ReactNode
}

const StoryListItem = ({ story, renderHeader, loader }: StoryListItemProps) => {
  const header = renderHeader(story)
  return (
    <Card withBorder>
      {loader && loader}
      {header}
      <Divider my="lg" />
      <StoryInfoSnippet story={story} />
    </Card>
  )
}

export default StoryListItem