import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useFollowMutation() {
    const queryClient = useQueryClient()
    const queryKey = "followUser"
    return useMutation(
        async(payload) => await ApiService.post("/api/user/follow/", {
            username: payload
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)

                alertify.success(`Usuario seguido`)


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