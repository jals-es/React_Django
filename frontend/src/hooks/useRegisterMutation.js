import ApiService from '../core/api.service'
import { useMutation, useQueryClient } from 'react-query'
import alertify from 'alertifyjs'

alertify.set('notifier', 'position', 'top-right');

export default function useRegister() {
    const queryClient = useQueryClient()
    const queryKey = "registerUser"
    return useMutation(
        async(payload) => await ApiService.post("/api/user/", {
            user: {
                email: payload.email,
                username: payload.username,
                password: payload.password,
                first_name: payload.name
            }
        }), {
            onSuccess: async(data) => {
                await queryClient.cancelQueries(queryKey)
                if (data.data) {
                    alertify.success(data.data.message);
                } else {
                    alertify.error("Error al registrar el usuario");
                }

            },
            onError: async(error) => {
                if (error.response.data) {
                    if (error.response.data.username) {
                        error.response.data.username.forEach(element => {
                            switch (element) {
                                case "This field must be unique.":
                                    alertify.error("El usuario ya existe");
                                    break;
                                default:
                                    alertify.error("Error con el usuario");
                                    break;
                            }
                        });
                    }
                    if (error.response.data.email) {
                        error.response.data.email.forEach(element => {
                            switch (element) {
                                case "This field must be unique.":
                                    alertify.error("El email ya existe");
                                    break;
                                default:
                                    alertify.error("Error con el email");
                                    break;
                            }
                        });
                    }
                } else {
                    alertify.error("Error al registrar el usuario");
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(queryKey)
            }
        }
    )
}