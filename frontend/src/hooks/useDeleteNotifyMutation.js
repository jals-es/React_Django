import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'

export default function useDeleteNotify() {
    const queryClient = useQueryClient()
    const queryKey = "deleteNotify"
    return useMutation(
        async(payload) => await ApiService.delete("/api/notify/", payload), {
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