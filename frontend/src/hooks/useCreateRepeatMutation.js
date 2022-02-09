import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useCreateRepeatMutation() {
    const queryClient = useQueryClient()
    const queryKey = "createRepeat"
    return useMutation(
        async(payload) => await ApiService.post("/api/post/repeat/", {
            id_post: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
            },
            onError: async(error) => {
                console.log(error.response.data);
                alertify.error("Error al dar repeat al post")
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}