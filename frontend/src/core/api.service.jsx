import axios from "axios";

export const httpClient = axios.create({
    baseURL: 'http://localhost:8000'
})

if (localStorage.getItem("token")) {
    httpClient.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem("token")}`;
}

const ApiService = {
    get(path) {
        return httpClient.get(path)
            .catch((error) => {throw error})
    },
    post(path, body) {
        return httpClient.post(path, body)
            .catch((error) => {throw error})
    },
    put(path, body) {
        return httpClient.put(path, body)
            .catch((error) => {throw error})
    },
    patch(path, body) {
        return httpClient.patch(path, body)
            .catch((error) => {throw error})
    },
    delete(path, body) {
        return httpClient.delete(path, {data: body})
            .catch((error) => {throw error})
    }
}

export default ApiService