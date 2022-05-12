import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'

export default function useCreateNotify() {
    const queryClient = useQueryClient()
    const queryKey = "createNotify"
    return useMutation(
        async(payload) => await ApiService.post("/api/notify/", payload), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey);
            },
            onError: async(error) => {

            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}