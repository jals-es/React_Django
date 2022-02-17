import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetUserPostsQuery(data) {
    return useQuery('get_user_posts', async() => {
        return await ApiService.post("/api/post/user/", data)
    })
}