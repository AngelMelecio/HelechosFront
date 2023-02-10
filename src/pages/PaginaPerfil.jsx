import { useState } from "react"
import { ICONS } from "../constants/icons"
import { useAuth } from "../context/AuthContext"



const PaginaPerfil = () => {

  const { session } = useAuth()
  const [user, setUser] = useState(() => {
    let u = session.usuario
    return [
      { id: 1, label: 'Nombre', value: u.nombre },
      { id: 2, label: 'Apellidos', value: u.apellidos },
      { id: 3, label: 'Correo', value: u.correo },
      { id: 4, label: 'Usuario', value: u.usuario },
      { id: 5, label: 'Tipo', value: u.is_staff ? 'Administrador' : 'Encargado' },
    ]
  })

  const [tmpInp, setTmpInp] = useState('')
  const [focusedRow, setFocusedRow] = useState(null)

  const saveChanges = () => {
    console.log( user )
    console.log( tmpInp )
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
                            onClick={ saveChanges }
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

        {/*<table className="customTable">
                    <tbody>
                        <tr
                            onClick={hanldeEdit}
                            className="relative flex flex-row items-center w-full py-2 text-gray-700 ">
                            <td className="px-3 font-normal text-sm pointer-events-none">
                                Nombre:
                            </td>
                            <td className="font-medium">
                                <input value={user.nombre} disabled className="pointer-events-none input-when-click-text" />
                            </td>
                            <label className="cursor-pointer pointer-events-none absolute flex items-center justify-center right-4 filter-button">
                                <ICONS.Edit size='20px' />
                            </label>
                        </tr>
                        <tr
                            onClick={hanldeEdit}
                            className="relative flex flex-row items-center w-full py-2 text-gray-700 ">
                            <td className="px-3 font-normal text-sm pointer-events-none">
                                Apellidos:
                            </td>
                            <td className="font-medium">
                                <input value={user.apellidos} disabled className="pointer-events-none input-when-click-text" />

                            </td>
                            <label className="cursor-pointer pointer-events-none absolute flex items-center justify-center right-4 filter-button">
                                <ICONS.Edit size='20px' />
                            </label>
                        </tr>
                        <tr
                            onClick={hanldeEdit}
                            className="relative flex flex-row items-center w-full py-2 text-gray-700 ">
                            <td className="px-3 font-normal text-sm pointer-events-none">
                                Correo:
                            </td>
                            <td className="font-medium">
                                <input value={user.correo} disabled className="pointer-events-none input-when-click-text" />

                            </td>
                            <label className="cursor-pointer pointer-events-none absolute flex items-center justify-center right-4 filter-button">
                                <ICONS.Edit size='20px' />
                            </label>
                        </tr>
                        <tr
                            onClick={hanldeEdit}
                            className="relative flex flex-row items-center w-full py-2 text-gray-700 ">
                            <td className="px-3 font-normal text-sm pointer-events-none">
                                Usuario:
                            </td>
                            <td className="font-medium">
                                <input value={user.usuario} disabled className="pointer-events-none input-when-click-text" />
                            </td>
                            <label className="cursor-pointer pointer-events-none absolute flex items-center justify-center right-4 filter-button">
                                <ICONS.Edit size='20px' />
                            </label>
                        </tr>
                        <tr
                            id={1}
                            onClick={hanldeEdit}
                            className="relative flex flex-row items-center w-full py-2 text-gray-700 ">
                            <td className="px-3 font-normal text-sm pointer-events-none">
                                Tipo:
                            </td>
                            <td className="font-medium">
                                <input value={user.is_staff ? 'Administrador' : 'Encargado'} disabled className="pointer-events-none input-when-click-text" />
                            </td>
                            <label className="cursor-pointer pointer-events-none absolute flex items-center justify-center right-4 filter-button">

                                {focusedRow === 1 ? console.log(this) &&
                                    <>
                                        assdf
                                    </> :
                                    <ICONS.Edit size='20px' />
                                }
                            </label>
                        </tr>
                    </tbody>
                </table>*/}
      </div>
    </div>
  )
}

export default PaginaPerfil