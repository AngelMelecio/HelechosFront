import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";

const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'
const apiMaquinasUrl = 'http://127.0.0.1:8000/api/maquinas/'
const apiEmpleadoMaquinaUrl = 'http://127.0.0.1:8000/api/empleados_maquina/'
const imageEndPoint = 'http://127.0.0.1:8000'
const apiUsersUrl = 'http://localhost:8000/users/'

const UsuariosColumns = [
    { name: 'Nombre', attribute: 'nombre' },
    { name: 'Apellidos', attribute: 'apellidos' },
    { name: 'Correo', attribute: 'correo' },
    { name: 'Usuario', attribute: 'usuario' },
    { name: 'Está Activo', attribute: 'is_active' },
    { name: 'Es Administrador', attribute: 'is_staff' },
]

const empleadosColumns = [
    { name: 'Nombre', attribute: 'nombre' },
    { name: 'Apellidos', attribute: 'apellidos' },
    { name: 'Dirección', attribute: 'direccion' },
    { name: 'Seguro Social', attribute: 'ns' },
    { name: 'Teléfono', attribute: 'telefono' },
    { name: 'Departamento', attribute: 'departamento' },
]

const maquinasColumns = [
    { name: 'Número', attribute: 'numero' },
    { name: 'Línea', attribute: 'linea' },
    { name: 'Marca', attribute: 'marca' },
    { name: 'Modelo', attribute: 'modelo' },
    { name: 'Número de Serie', attribute: 'ns' },
    { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion' },
    { name: 'Otros', attribute: 'otros' },
    { name: 'Departamento', attribute: 'departamento' },
]

const AdminContext = React.createContext()
export function useAdmin() {
    return useContext(AdminContext)
}

export function AdminProvider({ children }) {

    const [fetchingEmpleados, setFetchingEmpleados] = useState(false)
    const [allEmpleados, setAllEmpleados] = useState([])

    const [fetchingMaquinas, setFetchingMaquinas] = useState(false)
    const [allMaquinas, setAllMaquinas] = useState([])

    const [fetchingUsuarios, setFetchingUsuarios] = useState(false)
    const [allUsuarios, setAllUsuarios] = useState([])

    const { session, setSession } = useAuth()
    const {notify} = useApp()

    const getEmpleados = async () => {
        setFetchingEmpleados(true)
        let response = await fetch(apiEmpleadosUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        })
        if (response.status == 200) {
            let data = await response.json()
            let formatData = data.map((empl) => ({
                ...empl,
                isSelected: false,
                fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
            }))
            setAllEmpleados(formatData)
            return formatData
        }
        setFetchingEmpleados(false)
    }

    const getMaquinas = async () => {
        setFetchingMaquinas(true)
        let response = await fetch(apiMaquinasUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        })
        //console.log( 'getting maquinas ',response )
        if (response.status === 200) {
            let maquinas = await response.json()
            setAllMaquinas(maquinas)
            return maquinas
        }
        setFetchingMaquinas(false)
    }

    const getEmpleadoMaquinas = async (empId) => {
        let response = await fetch(apiEmpleadoMaquinaUrl + empId, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        })
        if (response.status === 200) {
            let assigned = await response.json()
            return assigned
        }
        return []
    }

    const getUsuarios = async () => {
        setFetchingUsuarios(true)
        let response = await fetch(apiUsersUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        })
        if (response.status == 200) {
            let data = await response.json()
            setAllUsuarios(data)
            return data
        }
        setFetchingUsuarios(false)
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
            let newSesion = {...session, usuario: data.usuario }
            setSession(newSesion)
            localStorage.setItem('auth', JSON.stringify(newSesion))
            notify(data.message)
            return
        }
        notify(data.message, true)
    }

    const updatePassword = async (id, value) => {
        const response = await fetch(apiUsersUrl + id + '/set_password/', {
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

        if (response.status === 200) {

            alert('Contraseña actualizada Correctamente')
        }
    }

    return (
        <AdminContext.Provider
            value={{
                fetchingEmpleados,
                allEmpleados, getEmpleados, empleadosColumns,

                fetchingMaquinas,
                allMaquinas, getMaquinas, maquinasColumns,

                getEmpleadoMaquinas,

                fetchingUsuarios,
                allUsuarios, getUsuarios, UsuariosColumns,

                updateUser,
                updatePassword,
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}