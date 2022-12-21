import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { icons } from 'react-icons'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'

import { ICONS } from '../constants/icons'

const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'

const initobj = {
  idEmpleado: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  correo: "",
  ns: "",
  usuario: "",
  contrasena: "",
  fotografia: "",
  departamento: "",
  tipo: ""
}

const PaginaEmpleados = () => {

  const columns = [

    { name: 'Nombre' },
    { name: 'Apellidos' },
    { name: 'Dirección' },
    { name: 'Seguro Social' },
    { name: 'Teléfono' },
    { name: 'Correo' },
    { name: 'Departamento' },
    { name: 'Usuario' },
    { name: 'Contraseña' }
  ]

  const screenRef = useRef()
  const modalRef = useRef()
  const someSelectedRef = useRef()
  const searchRef = useRef()
  const trashButtonRef = useRef()
  const modalBoxRef = useRef()

  const [saving, setSaving] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [modalDeleteVisible, setModalDeleteVisible] = useState()

  const [objEmpleado, setObjEmpleado] = useState(initobj);

  const [allEmpleados, setAllEmpleados] = useState([])
  const [listaEmpleados, setListaEmpleados] = useState([])

  useEffect(() => {
    getEmpleados()
  }, [])


  const getEmpleados = async () => {
    await fetch(apiEmpleadosUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setListaEmpleados(data.map(empl => ({ ...empl, isSelected: false })))
        setAllEmpleados(data)
      })
  }

  const handleModalVisibility = (show) => {
    setModalVisible(show)
    setIsEdit(false)
    setObjEmpleado(initobj)
    screenRef.current.style.filter = show ? "blur(2px)" : 'none'
  }

  const hideShowOptions = (a) => {
    someSelectedRef.current.checked = a
    someSelectedRef.current.disabled = !a
    trashButtonRef.current.disabled = !a
    trashButtonRef.current.style.opacity = (!a) ? '40%' : '100%'
  }

  const handleChange = (e) => {
    setObjEmpleado({ ...objEmpleado, [e.target.name]: e.target.value })
  }

  const saveEmpleado = async (e) => {
    e.preventDefault()

    setSaving(true)

    if (!isEdit) {
      await fetch(apiEmpleadosUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(objEmpleado)
      })
        .then(response => response.json())
        .then(data => alert(data.message))
    }


    await getEmpleados()
    setObjEmpleado(initobj)
    setSaving(false)
    handleModalVisibility(false)

  }

  const handleSelection = (e) => {

    setListaEmpleados(prev => prev.map((empl, indx) => (
      indx === Number(e.target.value) ?
        { ...empl, isSelected: e.target.checked } :
        { ...empl }
    )))

    let sel = false
    let inpts = document.querySelectorAll('.checkbox')
    inpts.forEach(inp => {
      if (inp.checked) {
        sel = true
      }
    })

    hideShowOptions(sel)
  }

  const unSelecAll = () => {
    setListaEmpleados(prev => prev.map(empl => ({ ...empl, isSelected: false })))
    hideShowOptions(false)
  }

  const handleSelectImage = (e) => {
    e.preventDefault()
  }

  const handleSearch = () => {
    let val = (searchRef.current.value).trim().toLowerCase()

    let N = listaEmpleados.length
    for (let i = 0; i < N; i++) {
    }

    let newLista = allEmpleados.filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })

    hideShowOptions(false)
    setListaEmpleados(newLista)
  }

  const handleModalDeleteVisibility = (visible) => {
    if (!someSelectedRef.current.checked) return
    setModalDeleteVisible(visible)
  }

  const handleEdit = (emp) => {
    setModalVisible(true)
    setIsEdit(true)
    setObjEmpleado(emp)
  }

  const CustomRow = ({ element, index, onClick }) => {
    const { id, nombre, apellidos, direccion, ns, telefono, correo, departamento, usuario, contrasena, isSelected } = element
    return (
      <>
        <td className='m-2' onClick={onClick}>
          {nombre}
        </td>
        <td className='m-2' onClick={onClick}>
          {apellidos}
        </td>
        <td className='m-2' onClick={onClick}>
          {direccion}
        </td>
        <td className='m-2' onClick={onClick}>
          {ns}
        </td>
        <td className='m-2' onClick={onClick}>
          {telefono}
        </td>
        <td className='m-2' onClick={onClick}>
          {correo}
        </td>
        <td className='m-2' onClick={onClick}>
          {departamento}
        </td>
        <td className='m-2' onClick={onClick}>
          {usuario}
        </td>
        <td className='m-2' onClick={onClick}>
          {contrasena}
        </td>
      </>

    )
  }


  return (
    <div className='h-screen'>
      {
        modalDeleteVisible ?
          <DeleteModal
            onCancel={() => setModalDeleteVisible(false)}
            elements={listaEmpleados}
            message='Los siguientes empleados se eliminarán permanentemente:'
          />
          : null
      }
      {
        modalVisible ?
          <div ref={modalRef} id="modal"
            className='z-10 flex absolute h-screen w-full grayTrans items-center justify-center '>
            <div ref={modalBoxRef} className='w-full mx-10 p-5 rounded-lg bg-white shadow-md '  >
              <div className="flex flex-row total-center mb-2 relative h-10">
                {isEdit
                  ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#134e4a' }} />
                  : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#134e4a' }} />
                }
                <p className='font-bold text-teal-900 text-2xl' >
                  {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                </p>
                <button
                  className='total center rose-opacity bg-rose-500 p-1 text-white rounded-lg  absolute right-0 '
                  onClick={() => handleModalVisibility(false)}
                >
                  <ICONS.Cancel className='m-0' size='25px' />
                </button>
              </div>
              <form className='form' onSubmit={saveEmpleado} >
                <div className='flex flex-col w-full items-center justify-center'>
                  <div className="flex relative items-center justify-center foto text-center">
                    { /* Imagen del Empleado */}
                    <button onClick={handleSelectImage} className='absolute -bottom-2 -right-1 bg-teal-500 p-2 text-white normalButton rounded-full'>
                      <ICONS.Camera size='22px' />
                    </button>
                  </div>
                </div>
                <div id='fields' className=' mt-2 mb-2'>
                  <div className='flex flex-row'>
                    <Input
                      label='Nombre(s)' type='text' name='nombre' value={objEmpleado.nombre}
                      onChange={(e) => handleChange(e)} required={true}
                    />
                    <Input
                      label='Apellido(s)' type='text' name='apellidos' value={objEmpleado.apellidos}
                      onChange={(e) => handleChange(e)} required={true}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Dirección' type='text' name='direccion' value={objEmpleado.direccion}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.House}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Seguro Social' type='number' name='ns' value={objEmpleado.ns}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.Add}
                    />
                    <Input
                      label='Teléfono' type='number' name='telefono' value={objEmpleado.telefono}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.Phone}
                    />
                    <Input
                      label='Correo' type='text' name='correo' value={objEmpleado.correo}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.Email}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Departamento' type='text' name='departamento' value={objEmpleado.departamento}
                      onChange={(e) => handleChange(e)} required={true}
                    />
                    <Input
                      label='Tipo' type='text' name='tipo' value={objEmpleado.tipo}
                      onChange={(e) => handleChange(e)} required={true}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Usuario' type='text' name='usuario' value={objEmpleado.usuario}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.User}
                    />
                    <Input
                      label='Contaseña' type='password' name='contrasena' value={objEmpleado.contrasena}
                      onChange={(e) => handleChange(e)} required={true} Icon={ICONS.Key}
                    />
                  </div>
                </div>
                <div className='flex total-center mt-5'>
                  <input
                    className='bg-teal-500 p-1 w-40 text-white normalButton'
                    type="submit"
                    value={isEdit ? "GUARDAR" : "AGREGAR"}
                  />
                </div>
              </form>
            </div>
          </div>
          : null
      }
      <div ref={screenRef} className="customTable flex">
        <div className="flex flex-col bg-white w-full m-2 p-2 rounded-lg">
          <div className='flex p-2 justify-between items-center' >
            <div className='flex'>
              <button
                className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg'
                onClick={() => handleModalVisibility(true)}>
                <ICONS.Plus size='16px' />
              </button>
              <button

                ref={trashButtonRef}
                onClick={() => { handleModalDeleteVisibility(true) }}
                className={'total-center ml-4 w-8 h-8 opacity-40 opacity-white rounded-lg'}
              >
                <ICONS.Trash size='19px' style={{ color: 'black' }} />
              </button>
            </div>
            <div id="searchbar" className='flex flex-row w-96 h-8 items-center justify-center'>
              <div
                onClick={handleSearch}
                className='h-full pl-3 pr-3 total-center opacity-white rounded-l-2xl'>
                <ICONS.Lupa style={{ color: 'black' }} />
              </div>
              <input ref={searchRef} type="text" className='w-full h-full rounded-r-lg outline-none bg-gray-100' />
            </div>
          </div>

          <div className="flex w-full overflow-scroll">
            <table className="table-auto border-collapse:collapse ">
              <thead className='text-center'>
                <tr>
                  <th>
                    <div className=''>
                      <input
                        onChange={unSelecAll}
                        ref={someSelectedRef}
                        type="checkbox"
                        disabled />
                    </div>
                  </th>
                  {
                    columns.map((c, i) =>
                      <th className='p-1 text-teal-900' key={"C" + i} >
                        {c.name}
                      </th>)
                  }
                </tr>
              </thead>
              <tbody>
                {
                  listaEmpleados.map((e, i) =>
                    <>
                      <tr key={"E" + i}  >
                        <td className='p-0'>
                          <input
                            value={i}
                            className='checkbox'
                            type="checkbox"
                            onChange={handleSelection}
                            checked={e.isSelected}
                          />
                        </td>
                        <CustomRow element={e} index={i} onClick={ () => handleEdit(e)} />
                      </tr>
                    </>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PaginaEmpleados