import useSWR, { Fetcher } from "swr"
import UserType from "../../../server/collectionTypes/UserType"
import { getCurrentUser } from "../../services/auth"

const user = {
  _id: 'ssssrsss',
  name: 'Tien Vo',
  username: 'tienhoangvo',
  email: 'tienhoangvo.dev@gmail.com',
  avatar: '/imgs/avatar.jpg'
}

type CurrentUserStatus = 'loading' | 'success' | 'failed'

const useCurrentUser = () => {
  const { data, error, mutate } = useSWR('/api/users/me')

  let user: UserType | undefined
  let status : CurrentUserStatus = 'loading'
  if (data) {
    status = data.status
    user = data.user
  }
  return {
    user,
    status,
    mutate
  }
}

export default useCurrentUser