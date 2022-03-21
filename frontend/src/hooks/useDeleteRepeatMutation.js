import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useDeleteRepeatMutation() {
    const queryClient = useQueryClient()
    const queryKey = "deleteRepeat"
    return useMutation(
        async(payload) => await ApiService.delete("/api/post/repeat/", {
            id_post: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
            },
            onError: async(error) => {
                console.log(error.response.data);
                alertify.error("Error al quitar el repeat al post")
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}