import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  let auth = localStorage.getItem('auth')
  const [user, setUser] = useState( () => auth ? JSON.parse(auth) : null )

  const logout = () =>{
    setUser(null)
    localStorage.removeItem('auth')
  }

  return (
    <AppContext.Provider
      value={{
        user, setUser, logout
      }}>
      {children}
    </AppContext.Provider>
  )
}