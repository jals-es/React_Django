import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetPostQuery(data) {
    return useQuery('get_post', async() => {
        return await ApiService.post("/api/post/all/", data)
    })
}