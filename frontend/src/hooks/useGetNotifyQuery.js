import { useQuery } from 'react-query'
import ApiService from '../core/api.service'
export default function useGetNotifyQuery() {
    return useQuery('get_notify', async() => {
        return await ApiService.get("/api/notify/")
    })
}