import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'
const apiMaquinasUrl = 'http://127.0.0.1:8000/api/maquinas/'
const imageEndPoint = 'http://127.0.0.1:8000'

const empleadosColumns = [
    { name: 'Nombre', attribute: 'nombre' },
    { name: 'Apellidos', attribute: 'apellidos' },
    { name: 'Dirección', attribute: 'direccion' },
    { name: 'Seguro Social', attribute: 'ns' },
    { name: 'Teléfono', attribute: 'telefono' },
    { name: 'Correo', attribute: 'correo' },
    { name: 'Departamento', attribute: 'departamento' },
    { name: 'Usuario', attribute: 'usuario' },
    { name: 'Contraseña', attribute: 'contrasena' }
]

const maquinasColumns = [
    { name: 'Número', attribute: 'numero' },
    { name: 'Línea', attribute: 'linea' },
    { name: 'Marca', attribute: 'marca' },
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

    useEffect(() => {
        async function getting() {
            setAllEmpleados(await getEmpleados())
            setAllMaquinas(await getMaquinas())
        }
        getting()
    },[])

    const getEmpleados = async () => {
        setFetchingEmpleados(true)
        let formatData = []
        await fetch(apiEmpleadosUrl, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                formatData = data.map((empl) => ({
                    ...empl,
                    isSelected: false,
                    fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
                })
                )
            })
        setFetchingEmpleados(false)
        return formatData
    }

    const getMaquinas = async () => {
        setFetchingMaquinas(true)
        let maquinas = []
        await fetch(apiMaquinasUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                maquinas = data
            })
        setFetchingMaquinas(false)
        return maquinas
    }

    return (
        <AdminContext.Provider
            value={{
                fetchingEmpleados,
                allEmpleados, getEmpleados, empleadosColumns,

                fetchingMaquinas,
                allMaquinas, getMaquinas, maquinasColumns
            }}
        >
            {children}
        </AdminContext.Provider>

    )
}