import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useCreatePost() {
    const queryClient = useQueryClient()
    const queryKey = "createPost"
    return useMutation(
        async(payload) => await ApiService.post("/api/post/", payload), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey);
                await queryClient.invalidateQueries('get_post')
                await queryClient.invalidateQueries('get_all_posts')
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