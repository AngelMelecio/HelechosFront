import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import { useAdmin } from "../context/AdminContext"
import { useAuth } from "../context/AuthContext"



const PaginaPerfil = () => {

  const { session } = useAuth()
  const { updateUser } = useAdmin()
  const [user, setUser] = useState(() => {
    let u = session.usuario
    return [
      { id: 1, label: 'Nombre', value: u.nombre, atribute: 'nombre' },
      { id: 2, label: 'Apellidos', value: u.apellidos, atribute: 'apellidos' },
      { id: 3, label: 'Correo', value: u.correo, atribute: 'correo' },
      { id: 4, label: 'Usuario', value: u.usuario, atribute: 'usuario' },
      { id: 5, label: 'Tipo', value: u.is_staff ? 'Administrador' : 'Encargado', atribute: 'is_staff' },
    ]
  })

  useEffect(() => {
    let u = session.usuario
    setUser([
      { id: 1, label: 'Nombre', value: u.nombre, atribute: 'nombre' },
      { id: 2, label: 'Apellidos', value: u.apellidos, atribute: 'apellidos' },
      { id: 3, label: 'Correo', value: u.correo, atribute: 'correo' },
      { id: 4, label: 'Usuario', value: u.usuario, atribute: 'usuario' },
      { id: 5, label: 'Tipo', value: u.is_staff ? 'Administrador' : 'Encargado', atribute: 'is_staff' },
    ])
  }, [session,] )

  const [tmpInp, setTmpInp] = useState('')
  const [focusedRow, setFocusedRow] = useState(null)

  const saveChanges = async (atribute) => {
    let sinId = {
      nombre: session.usuario.nombre,
      apellidos: session.usuario.apellidos,
      correo: session.usuario.correo,
      usuario: session.usuario.usuario,
      is_active: session.usuario.is_active,
      is_staff: session.usuario.is_staff,
    }
    let newV = { ...sinId, [atribute]: tmpInp }
    await updateUser(session.usuario.id, newV)
    setFocusedRow(0)
  }

  return (
    <div className="flex flex-col w-full overflow-scroll py-5">
      <div className="flex  w-full h-1/5 justify-center items-center my-2">
        <div className="bg-gray-200 w-28 h-28 rounded-full">
        </div>
      </div>
      <p className="text-center text-lg font-medium text-gray-700 italic">
        {user[0].value} {user[1].value}
      </p>
      <p className="text-2xl font-normal text-gray-700 pl-6 pt-2">
        Datos de Usuario
      </p>
      <div className="w-full p-5">
        <table className="profile-table">
          <tbody>
            {
              user.map(atr =>
                <tr
                  key={'A' + atr.id}
                  onClick={() => {
                    if (focusedRow != atr.id) {
                      setFocusedRow(atr.id)
                      setTmpInp(atr.value)
                    }
                  }}
                  className="h-12 text-gray-700 border-b-1">
                  <td className="px-3 text-gray-900 font-medium text-sm pointer-events-none">
                    {atr.label}:
                  </td>
                  <td className="w-full  font-normal">
                    {
                      focusedRow === atr.id ?
                        <input
                          id={atr.id}
                          className="border-2 border-transparent w-full py-1 px-2 bg-blue-50 h-full focus:outline-none"
                          type="text"
                          value={tmpInp}
                          onChange={(e) => setTmpInp(e.target.value)}
                        />
                        : <p className="border-2 border-transparent px-2">
                          {atr.value}
                        </p>

                    }
                  </td>
                  <td className="">
                    <div className="flex flex-row h-full justify-around items-center w-24">
                      {focusedRow === atr.id ?
                        <>
                          <button
                            onClick={() => saveChanges(atr.atribute)}
                            className="normalButton w-full flex items-center p-1 rounded-md justify-center" >
                            <ICONS.Save size='20px' />
                          </button>
                          <button
                            className="neutral-button w-full flex items-center p-1 rounded-md justify-center "
                            onClick={() => setFocusedRow(0)}>
                            <ICONS.Cancel size="20px" />
                          </button>
                        </>
                        :
                        <button className="filter-button">
                          <ICONS.Edit size='20px' />
                        </button>}
                    </div>
                  </td>
                </tr>)
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaginaPerfil