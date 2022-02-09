import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useDeleteLikeMutation() {
    const queryClient = useQueryClient()
    const queryKey = "deleteLike"
    return useMutation(
        async(payload) => await ApiService.delete("/api/post/like/", {
            id_post: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
            },
            onError: async(error) => {
                console.log(error.response.data);
                if (!error.response.data) {
                    alertify.error("Error al quitar el like al post")
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}