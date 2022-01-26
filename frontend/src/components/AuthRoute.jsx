import React from 'react'
import { Navigate/*, Outlet*/ } from 'react-router-dom';
import useAuth from '../hooks/useAuth'

export default function AuthRoute({children}) {
  const { isAuth } = useAuth()

  if (!isAuth) return <Navigate to="/login/" />

  return children
}
