import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetSuggestedUsersQuery() {
    return useQuery('get_suggested_users', async() => {
        return await ApiService.get("/api/user/suggest/")
    })
}