import { useQuery } from 'react-query'
export default function useGetPostsQuery() {
    return useQuery('/api/post/all/')
}