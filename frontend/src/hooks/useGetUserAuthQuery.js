import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetUserAuthQuery() {
    return useQuery('get_user_auth', async() => {
        return await ApiService.get("/api/user/check/")
    })
}