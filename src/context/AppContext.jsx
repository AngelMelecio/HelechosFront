import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  const notify = (message, error = false ) => {
    let options = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }
    error ? toast.error(message,options) : toast.success(message,options)
}

  return (
    <AppContext.Provider
      value={{
       notify
      }}>
      {children}
      <ToastContainer position="bottom-right" />
    </AppContext.Provider>
  )
}