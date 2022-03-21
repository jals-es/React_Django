import React from 'react'
import { useQueryClient } from 'react-query';
import { Navigate/*, Outlet*/ } from 'react-router-dom';
import useAuth from '../hooks/useAuth'

export default function AuthRoute({children}) {
  const queryClient = useQueryClient()
  
  const { isAuth } = useAuth()

  if (!isAuth) return <Navigate to="/login/" />

  queryClient.setQueryData("get_user_auth", { data: isAuth })

  return children
}
