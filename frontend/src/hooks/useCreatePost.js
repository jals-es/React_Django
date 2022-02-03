import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useCreatePost() {
    const queryClient = useQueryClient()
    const queryKey = "createPost"
    return useMutation(
        async(payload) => await ApiService.post("/api/post/", {
            post: {
                message: payload.post
            }
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey);
                console.log(response.data)
            },
            onError: async(error) => {
                if (!error.response.data) {
                    alertify.error("Error al crear el post")
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}