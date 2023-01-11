import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  const [user, setUser] = useState(true)


  return (
    <AppContext.Provider
      value={{
        user, setUser
      }}>
      {children}
    </AppContext.Provider>
  )
}