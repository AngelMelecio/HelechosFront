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

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {

  const [user, setUser] = useState(true)
  const [allEmpleados, setAllEmpleados] = useState([])
  const [allMaquinas, setAllMaquinas] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(async () => {
    try {
      setIsFetching(true)
      let empl = await getEmpleados()
      console.log('con:',empl)
      setAllEmpleados( empl )
      await getMaquinas()
    } catch (e) {
      console.log('lo intentamos:', e)
    }
    finally {
      setIsFetching(false)
    }

  }, [])

  const getEmpleados = async () => {
    let formatData
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
      .catch(e => {
        return []
      })
    return formatData
  }
  const getMaquinas = async () => {

    await fetch(apiMaquinasUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setAllMaquinas(data)
      })
  }


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