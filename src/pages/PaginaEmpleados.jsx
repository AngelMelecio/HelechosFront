import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import SelectorMaquinas from '../components/SelectorMaquinas'

import { ICONS } from '../constants/icons'

const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'
const apiMaquinasUrl = 'http://127.0.0.1:8000/api/maquinas/'
const apiEmpleadoMaquinaUrl = 'http://127.0.0.1:8000/api/empleados_maquina/'
const imageEndPoint = 'http://127.0.0.1:8000'

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

  const [allMaquinas, setAllMaquinas] = useState([])

  const [availableMaquinas, setAvailableMaquinas] = useState([])
  const [assignedMaquinas, setAssignedMaquinas] = useState([])


  useEffect(() => {
    getEmpleados()
    getMaquinas()
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

        let formatData = data.map((empl) =>
        ({
          ...empl,
          isSelected: false,
          fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
        })
        )

        setListaEmpleados(formatData)
        setAllEmpleados(formatData)
      })

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

  const removeRelationEM = async (idEmpleado) => {
    const response = await fetch(apiEmpleadoMaquinaUrl + idEmpleado, {
      method: 'DELETE'
    })

    console.log(await response.json())

  }

  const newRelation = async (idEmpleado, idMaquina) => {
    let newEmpleadoMaquina = { idEmpleado: idEmpleado, idMaquina: idMaquina }
    await fetch(apiEmpleadoMaquinaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEmpleadoMaquina)
    })
      .then(response => response.json())
      .then(data => console.log('asignacion:', data))
  }

  const saveEmpleado = async (e) => {

    e.preventDefault()

    setSaving(true)

    let formData = new FormData()

    formData.append('nombre', objEmpleado.nombre)
    formData.append('apellidos', objEmpleado.apellidos)
    formData.append('direccion', objEmpleado.direccion)
    formData.append('telefono', objEmpleado.telefono)
    formData.append('correo', objEmpleado.correo)
    formData.append('ns', objEmpleado.ns)
    formData.append('usuario', objEmpleado.usuario)
    formData.append('contrasena', objEmpleado.contrasena)
    formData.append('fotografia', objEmpleado.fotografia)
    formData.append('departamento', objEmpleado.departamento)
    formData.append('tipo', objEmpleado.tipo)

    if (!isEdit) {

      //    Creacion de un Nuevo Empleado 
      let response = await fetch(apiEmpleadosUrl, {
        method: 'POST',
        body: formData
      })

      //    Espero la respuesta para obtener el nuevo Id 
      const { message, empleado } = await response.json()

      //    Asigno Cada una de las Maquinas 
      assignedMaquinas.forEach(async (AM) => {
        await newRelation(empleado.idEmpleado, AM.idMaquina)
      })

      alert(message)
    }
    else {
      //    Actualizando los datos del empleado
      await fetch(apiEmpleadosUrl + objEmpleado.idEmpleado, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(data => alert(data.message))

      //    Removiendo las relaciones existentes
      await removeRelationEM(objEmpleado.idEmpleado)

      //    Creando las nuevas relaciones
      assignedMaquinas.forEach(async (am) => {
        await newRelation(objEmpleado.idEmpleado, am.idMaquina)
      })

    }

    await getEmpleados()
    setObjEmpleado(initobj)
    setSaving(false)
    handleModalVisibility(false)
  }

  const deleteEmpleados = async () => {
    listaEmpleados.forEach(async (e) => {
      if (e.isSelected) {
        await fetch(apiEmpleadosUrl + e.idEmpleado, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => console.log('Empleados Eliminados:', data))
      }
    })
    await getEmpleados()
    setModalDeleteVisible(false)
  }

  const handleModalVisibility = async (show) => {

    setModalVisible(show)
    setIsEdit(false)
    setObjEmpleado(initobj)
    if (show) {
      setAvailableMaquinas(allMaquinas)
    }
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

  const handleSelectImage = (e) => {
    e.preventDefault()
    setObjEmpleado({ ...objEmpleado, fotografia: e.target.files[0] })
  }

  const unSelecAll = () => {
    setListaEmpleados(prev => prev.map(empl => ({ ...empl, isSelected: false })))
    hideShowOptions(false)
  }

  const handleSearch = () => {
    let val = (searchRef.current.value).trim().toLowerCase()

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

  const handleEdit = async (emp) => {

    const response = await fetch(apiEmpleadoMaquinaUrl + emp.idEmpleado, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })

    const assigned = await response.json()
    const maquinasIds = assigned.message ? [] : assigned.map(a => a.idMaquina)

    let newAvailable = []
    let newAssigned = []
    allMaquinas.forEach(m => {
      if (maquinasIds.includes(m.idMaquina))
        newAssigned.push({ ...m, isChecked: false })
      else
        newAvailable.push({ ...m, isChecked: false })
    })

    setAssignedMaquinas(newAssigned)
    setAvailableMaquinas(newAvailable)

    setModalVisible(true)
    setIsEdit(true)
    setObjEmpleado(emp)
  }

  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
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
    <div className='h-screen w-full'>
      {
        modalDeleteVisible ?
          <DeleteModal
            onCancel={() => setModalDeleteVisible(false)}
            onConfirm={deleteEmpleados}
            elements={listaEmpleados}
            message='Los siguientes empleados se eliminarán permanentemente:'
          />
          : null
      }
      {
        modalVisible ?
          <div ref={modalRef} id="modal"
            className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
            <div ref={modalBoxRef} className='h-full w-3/4 rounded-lg bg-white shadow-xl'  >
              <div className='w-full flex h-full flex-col '>
                <div className="z-10 py-2 px-4 flex w-full shadow-md ">
                  <div className="flex flex-row w-full total-center relative h-10">
                    {isEdit
                      ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                      : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                    }
                    <p className='font-semibold text-teal-800 text-2xl' >
                      {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                    </p>
                    <button
                      className='total center rose-opacity bg-rose-500 p-1 text-white rounded-lg  absolute left-0 '
                      onClick={() => handleModalVisibility(false)}
                    >
                      <ICONS.Cancel className='m-0' size='25px' />
                    </button>
                    <input
                    disabled={saving}
                    className='bg-teal-500 p-1 w-40 text-white normalButton absolute right-0 rounded-lg'
                    type="submit"
                    value={isEdit ? "GUARDAR" : "AGREGAR"}
                  />
                  </div>
                </div>
                <div className="flex w-full h-full ">
                  <form className='flex flex-col h-full w-full relative overflow-y-scroll' onSubmit={saveEmpleado}>
                    <div className="absolute w-full flex flex-col  px-4">
                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="flex relative w-full items-center justify-center foto text-center">
                          { /* Imagen del Empleado */}
                          <img
                            className='object-cover foto'
                            src={toUrl(objEmpleado?.fotografia)}
                            alt='' />
                          <input id='file' type="file" name='fotografia' accept='image/*' onChange={handleSelectImage} className='inputfile' />
                          <label
                            className='absolute -bottom-2 -right-1 bg-teal-500 p-2 text-white normalButton rounded-full'
                            htmlFor='file' >
                            <ICONS.Upload style={{ color: 'white' }} size='18px' />
                          </label>
                        </div>
                      </div>
                      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            DATOS PERSONALES
                          </div>
                        </div>
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
                      </div>
                      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            DATOS DEL EMPLEADO
                          </div>
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
                      <div className="mx-2 my-4 relative h-56 px-4 py-4 border-2 border-slate-300">
                        <div className="absolute w-full left-0 total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            MAQUINAS
                          </div>
                        </div>
                        <SelectorMaquinas
                          availableMaquinas={availableMaquinas}
                          setAvailableMaquinas={setAvailableMaquinas}
                          assignedMaquinas={assignedMaquinas}
                          setAssignedMaquinas={setAssignedMaquinas}
                          maquinasList={allMaquinas}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                
              </div>
            </div>
          </div>
          : null
      }
      <div ref={screenRef} className="customTable flex w-full bg-slate-200">
        <div className="flex flex-col bg-white w-full p-5 rounded-lg">
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
                      <th className='p-1 font-semibold text-teal-800' key={"C" + i} >
                        {c.name}
                      </th>)
                  }
                </tr>
              </thead>
              <tbody>
                {
                  listaEmpleados.map((e, i) =>
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
                      <CustomRow element={e} index={i} onClick={() => handleEdit(e)} />
                    </tr>
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