import ApiService from '../core/api.service'
import { httpClient as ApiHttpService } from '../core/api.service';
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useLogin() {
    const queryClient = useQueryClient()
    const queryKey = "loginUser"
    return useMutation(
        async(payload) => await ApiService.post("/api/user/login/", {
            user: {
                username: payload.username,
                password: payload.password
            }
        }), {
            onSuccess: async(response) => {
                await queryClient.cancelQueries(queryKey)
                queryClient.setQueryData(queryKey, {
                    user: {
                        name: response.data.name,
                        descr: response.data.descr,
                        photo: response.data.photo,
                        username: response.data.username
                    }
                })
                localStorage.setItem("token", response.data.token)
                ApiHttpService.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            },
            onError: async(error) => {
                if (!error.response.data) {
                    alertify.error("Error al iniciar sesion")
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}