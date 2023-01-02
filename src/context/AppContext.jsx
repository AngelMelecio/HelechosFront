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
  { name: 'Modelo', attribute: 'modelo' },
  { name: 'Número de Serie', attribute: 'ns' },
  { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion' },
  { name: 'Otros', attribute: 'otros' },
  { name: 'Departamento', attribute: 'departamento' },
]

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  const [user, setUser] = useState(false)


  return (
    <AppContext.Provider
      value={{
        isFetching,

        allEmpleados,
        empleadosColumns,
        getEmpleados,

        allMaquinas,
        maquinasColumns,

        user, setUser,
      }}>
      {children}
    </AppContext.Provider>
  )
}