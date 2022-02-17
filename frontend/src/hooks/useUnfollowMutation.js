import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useUnfollowMutation() {
    const queryClient = useQueryClient()
    const queryKey = "followUser"
    return useMutation(
        async(payload) => await ApiService.delete("/api/user/follow/", {
            username: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
                await queryClient.invalidateQueries('get_user_posts')

                alertify.error(`Has dejado de seguir al usuario`)


                let users = await ApiService.get("/api/user/suggest/")
                    .catch((error) => {
                        if (!error.response.data) {
                            console.log(error.response.data);
                        }
                    })

                if (users.data) {
                    queryClient.setQueryData("get_suggested_users", { data: users.data })
                }
            },
            onError: async(error) => {
                console.log(error.response.data);
                if (!error.response.data) {
                    alertify.error("Error al seguir al usuario")
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}