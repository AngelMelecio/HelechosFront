import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'
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

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  const [allEmpleados, setAllEmpleados] = useState([])
  const [isFetching, setIsFetching] = useState(true)


  useEffect( () => {
     getEmpleados()
  }, [] )

  const getEmpleados = async () => {
    setIsFetching(true)
    await fetch(apiEmpleadosUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        let formatData = data.map((empl) =>
        ({
          ...empl,
          isSelected: false,
          fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
        })
        )
        setAllEmpleados(formatData)
      })

      setIsFetching(false)
  }

  return (
    <AppContext.Provider
      value={{
        empleadosColumns,
        allEmpleados,
        isFetching
      }}>
      {children}
    </AppContext.Provider>
  )
}