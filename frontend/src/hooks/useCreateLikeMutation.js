import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useCreateLikeMutation() {
    const queryClient = useQueryClient()
    const queryKey = "createLike"
    return useMutation(
        async(payload) => await ApiService.post("/api/post/like/", {
            id_post: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
            },
            onError: async(error) => {
                console.log(error.response.data);
                if (!error.response.data) {
                    alertify.error("Error al dar like al post")
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}