import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";

const apiUsersUrl = 'http://localhost:8000/users/'

const UsuariosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Usuario', attribute: 'usuario' },
  { name: 'Está Activo', attribute: 'is_active' },
  { name: 'Es Administrador', attribute: 'is_staff' },
]



const AdminContext = React.createContext()
export function useAdmin() {
  return useContext(AdminContext)
}

export function AdminProvider({ children }) {



  const [fetchingUsuarios, setFetchingUsuarios] = useState(false)
  const [allUsuarios, setAllUsuarios] = useState([])

  const { session, setSession } = useAuth()
  const { notify } = useAuth()


  const getUsuarios = async () => {
    setFetchingUsuarios(true)
    let response = await fetch(apiUsersUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let data = await response.json()
      let formatData = data.map((usr) => ({
        ...usr,
        isSelected: false,
      }))
      setAllUsuarios(formatData)
      setFetchingUsuarios(false)
      return formatData
    }
    setFetchingUsuarios(false)
  }

  const saveUser = async (values) => {
    let response = await fetch(apiUsersUrl, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    let data = await response.json()
    if (response.ok) {
      notify(data.message)
    } else {
      throw data
    }
  }

  const updateUser = async (id, value) => {
    const response = await fetch(apiUsersUrl + id + '/', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      },
      body: JSON.stringify(value)
    })
    let data = await response.json()
    if (response.status === 200) {
      let newSesion = { ...session, usuario: data.usuario }
      setSession(newSesion)
      localStorage.setItem('auth', JSON.stringify(newSesion))
      notify(data.message)
      return
    } else {
      throw data
    }
  }

  const deleteUsuarios = async (listaUsuarios) => {
    listaUsuarios.forEach( async (e) => {
      if (e.isSelected) {
        let response = await fetch(apiUsersUrl + e.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
          return
        }
        notify(data.message, true)
      }
    })
  }

  const updatePassword = async (id, value) => {
    await fetch(apiUsersUrl + id + '/set_password/', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      },
      body: JSON.stringify({
        password: value,
        password2: value
      })
    })
  }

  return (
    <AdminContext.Provider
      value={{

        fetchingUsuarios,
        allUsuarios, getUsuarios, UsuariosColumns,

        updateUser, saveUser,
        updatePassword, deleteUsuarios
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}