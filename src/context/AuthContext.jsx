import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { useApp } from "./AppContext";

const apiLoginUrl = "http://127.0.0.1:8000/login/"
const apiRefreshTokenUrl = "http://127.0.0.1:8000/api/token/refresh/"

const AuthContext = React.createContext()
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  let auth = localStorage.getItem('auth')
  let [session, setSession] = useState(() => auth ? JSON.parse(auth) : null)
  //let [user, setUser] = useState(null)
  let [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()
  const{notify} = useApp()

  useEffect(() => {
    if (loading)
      updateToken()

    let fourMinutes = 1000 * 60 * 4
    let interval = setInterval(() => {
      if (session)
        updateToken()
    }, fourMinutes)
    return () => clearInterval(interval)

  }, [session, loading])

  const Login = async (values) => {
    values = { ...values, usuario: values.usuario.trim() }
    const response = await fetch(apiLoginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    let data = await response.json()

    console.log( data )
    console.log( response )

    if (response.status === 200) {
      //let tokens = { access: data.access, refresh: data.refresh }
      //console.log( tokens )

      setSession(data)
      //setAuthTokens(tokens)
      localStorage.setItem('auth', JSON.stringify(data))
      notify('Bienvenido')
      //alert(data.message)
      navigate('/empleados')
    }
    else {
      if (data.error) {
        notify(data.error, true)
      }
      else if (!data.usuario.is_active) {
        notify("Usuario no Activo", true)
      }
    }
  }

  const Logout = () => {
    //setUser(null)
    setSession(null)
    localStorage.removeItem('auth')
    navigate('/')
  }

  let updateToken = async () => {

    let response = await fetch(apiRefreshTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': session?.refresh })
    })

    let data = await response.json()

    if (response.status === 200) {
      console.log( 'tokens refreshed ')
      let newSession = { ...session, access:data.access, refresh:data.refresh }
      setSession(newSession)
      localStorage.setItem('auth', JSON.stringify(newSession))
    } else {
      Logout()
    }
    if (loading) {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session, setSession,
        Login,
        Logout,
        updateToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}