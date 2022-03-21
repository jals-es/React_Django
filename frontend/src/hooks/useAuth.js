import { isEmpty } from 'lodash-es'
import { useSnapshot } from 'valtio'
import { proxyWithComputed } from 'valtio/utils'
import { httpClient as ApiHttpService } from '../core/api.service';
import ApiService from '../core/api.service'

function getAuthUser() {
    const jwt = localStorage.getItem('token')

    if (!jwt) return {}

    return jwt
}

const actions = {
    logout: () => {
        localStorage.removeItem('token')
        ApiHttpService.defaults.headers.common['Authorization'] = null;
    },
    checkAuth: async(queryClient) => {
        const authUser = getAuthUser()

        if (!authUser || isEmpty(authUser)) {
            actions.logout()
            return {}
        } else {
            let data = await ApiService.get("/api/user/check/")
                .catch((error) => {
                    actions.logout()
                })
            if (data) {
                return data.data
            }
            return {}
        }
    },
}

const state = proxyWithComputed({
    authUser: actions.checkAuth(),
}, {
    isAuth: (snap) => {
        let data = snap.authUser;

        if (!isEmpty(data)) {
            return data
        }
        return false
    },
})

function useAuth() {
    actions.checkAuth()
    const snap = useSnapshot(state)

    return {
        ...snap,
        ...actions,
    }
}

export default useAuth