import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetPostsQuery() {
    return useQuery('get_all_posts', async() => {
        return await ApiService.get("/api/post/all/")
    })
}