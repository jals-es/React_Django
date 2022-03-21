import React from 'react'
import { Navigate/*, Outlet*/ } from 'react-router-dom';
import useAuth from '../hooks/useAuth'

export default function NoAuthRoute({children}) {
  const { isAuth } = useAuth()

  if (isAuth) return <Navigate to="/" />

  return children
}
