//Importaciones
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik'
import * as Yup from 'yup'
import { ICONS } from '../constants/icons'

//Constantes
const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'
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

//Componenete - PaginaEmpleados
const PaginaEmpleados = () => {

  //Hooks
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

  //Formik

  //Validaciones
  const validate = values => {
    const errors = {};

    if (!values.nombre) {
      errors.nombre = 'Ingresa el nombre';
    } else if (values.nombre.length > 25) {
      errors.nombre = '25 caracteres o menos';
    }

    if (!values.apellidos) {
      errors.apellidos = 'Ingresa el apellido';
    } else if (values.apellidos.length > 50) {
      errors.apellidos = '50 caracteres o menos';
    }

    if (!values.direccion) {
      errors.direccion = 'Ingresa la dirección';
    }

    if (!values.telefono) {
      errors.telefono = 'Ingresa el telefono';
    } else if (values.telefono.length != 10) {
      errors.telefono = 'Ingresa solo 10 digitos';
    }

    if (!values.correo) {
      errors.correo = 'Ingresa el correo';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
      errors.correo = 'Correo invalido';
    }

    if (!values.ns) {
      errors.ns = 'Ingresa el NSS';
    } else if (values.ns.length != 11) {
      errors.ns = 'NSS incorrecto';
    }

    if (!values.usuario) {
      errors.usuario = 'Ingresa un usuario';
    } else if (values.usuario.length < 4 || values.usuario.length > 20) {
      errors.usuario = 'El usuario debe tener una longitud entre 4 y 20 caracteres';
    }

    if (!values.contrasena) {
      errors.contrasena = 'Ingresa un usuario';
    } else if (values.contrasena.length < 8 || values.contrasena.length > 15) {
      errors.contrasena = 'La contraseña debe tener una longitud entre 8 y 15 caracteres';
    }

    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } 
    if (!values.tipo) {
      errors.tipo = 'Selecciona un tipo';
    } 

    return errors;
  };
  //Declaración
  const formik = useFormik({
    initialValues: initobj,
    validate,
    onSubmit: values => {
      saveEmpleado(values);
    },
  });


  //Función getEmpleados
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

  //Función saveEmpleado
  const saveEmpleado = async (values) => {
    //alert(JSON.stringify(values,null,2))
    setSaving(true)

    let formData = new FormData()

    formData.append('nombre', values.nombre)
    formData.append('apellidos', values.apellidos)
    formData.append('direccion', values.direccion)
    formData.append('telefono', values.telefono)
    formData.append('correo', values.correo)
    formData.append('ns', values.ns)
    formData.append('usuario', values.usuario)
    formData.append('contrasena', values.contrasena)
    formData.append('fotografia', (objEmpleado.fotografia))//objEmpleado
    formData.append('departamento', values.departamento)
    formData.append('tipo', values.tipo)

    if (!isEdit) {

      await fetch(apiEmpleadosUrl, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => alert(data.message))
    }
    else {
      await fetch(apiEmpleadosUrl + values.idEmpleado, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(data => alert(data.message))
    }

    await getEmpleados()
    setObjEmpleado(initobj)
    setSaving(false)
    handleModalVisibility(false)
  }

  //Controlador handleModalVisibility
  const handleModalVisibility = (show) => {
    if (!show) { formik.setValues(initobj) }
    setModalVisible(show)
    setIsEdit(false)
    setObjEmpleado(initobj)
    screenRef.current.style.filter = show ? "blur(2px)" : 'none'
  }

  //Controlador hideShowOptions - Select -> Options
  const hideShowOptions = (a) => {
    someSelectedRef.current.checked = a
    someSelectedRef.current.disabled = !a
    trashButtonRef.current.disabled = !a
    trashButtonRef.current.style.opacity = (!a) ? '40%' : '100%'
  }

  //Controlador handleChange
  const handleChange = (e) => {
    setObjEmpleado({ ...objEmpleado, [e.target.name]: e.target.value })
  }

  //Controlador handleSelection - Select -> True|False
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

  //Controlador handleSelectImage
  const handleSelectImage = (e) => {
    e.preventDefault()
    setObjEmpleado({ ...objEmpleado, fotografia: e.target.files[0] })
  }
  //Función file -> url
  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file == '') return null
    return file
  }

  //Controlador unSelecteAll
  const unSelecAll = () => {
    setListaEmpleados(prev => prev.map(empl => ({ ...empl, isSelected: false })))
    hideShowOptions(false)
  }

  //Controlador handleSearch
  const handleSearch = () => {
    let val = (searchRef.current.value).trim().toLowerCase()

    let newLista = allEmpleados.filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })

    hideShowOptions(false)
    setListaEmpleados(newLista)
  }

  //Controlador handleModalDeleteVisibility
  const handleModalDeleteVisibility = (visible) => {
    if (!someSelectedRef.current.checked) return
    setModalDeleteVisible(visible)
  }

  //Controlador handleEdit
  const handleEdit = (emp) => {
    //alert(JSON.stringify(emp,null,2))
    formik.setValues(emp)
    setModalVisible(true)
    setIsEdit(true)
    setObjEmpleado(emp)
  }
  ///------------------- Tabla -------------------
  //Columns para tabla
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
  //Rows para tabla
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
            elements={listaEmpleados}
            message='Los siguientes empleados se eliminarán permanentemente:'
          />
          : null
      }
      {
        modalVisible ?
          <div ref={modalRef} id="modal" className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
            <div className="">

              <div ref={modalBoxRef} className='w-full p-5 rounded-lg bg-white shadow-md '  >
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
                    onClick={() => handleModalVisibility(false)}>
                    <ICONS.Cancel className='m-0' size='25px' />
                  </button>
                </div>

                <form className='form' onSubmit={formik.handleSubmit} >
                  <div className='flex flex-col w-full items-center justify-center'>
                    <div className="flex relative items-center justify-center foto text-center">
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
                  <div id='fields' className='mt-2 mb-2'>
                    <div className='flex flex-row'>
                      <Input
                        label='Nombre(s)' type='text' name='nombre' value={formik.values.nombre}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.nombre ? formik.errors.nombre : null} />

                      <Input
                        label='Apellido(s)' type='text' name='apellidos' value={formik.values.apellidos}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.apellidos ? formik.errors.apellidos : null}
                      />


                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Dirección' type='text' name='direccion' value={formik.values.direccion}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.direccion ? formik.errors.direccion : null}
                        Icon={ICONS.House}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Seguro Social' type='text' name='ns' value={formik.values.ns}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.ns ? formik.errors.ns : null}
                        Icon={ICONS.Add}
                      />
                      <Input
                        label='Teléfono' type='text' name='telefono' value={formik.values.telefono}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.telefono ? formik.errors.telefono : null}
                        Icon={ICONS.Phone}
                      />
                      <Input
                        label='Correo' type='text' name='correo' value={formik.values.correo}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.correo ? formik.errors.correo : null}
                        Icon={ICONS.Email}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Departamento' type='text' name='departamento' value={formik.values.departamento}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.departamento ? formik.errors.departamento : null}
                      />
                      <Input
                        label='Tipo' type='text' name='tipo' value={formik.values.tipo}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.tipo ? formik.errors.tipo : null}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Usuario' type='text' name='usuario' value={formik.values.usuario}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.usuario ? formik.errors.usuario : null} 
                        Icon={ICONS.User}
                      />
                      <Input
                        label='Contaseña' type='password' name='contrasena' value={formik.values.contrasena}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} 
                        errores={formik.errors.contrasena ? formik.errors.contrasena : null}
                        Icon={ICONS.Key}
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
          </div>
          : null
      }
      <div ref={screenRef} className="customTable flex bg-slate-200">
        <div className="flex flex-col bg-white w-full p-5  rounded-lg">
          <div className='flex p-2 justify-between items-center' >
            <div className='flex'>
              <button
                className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg'
                onClick={() => handleModalVisibility(true)}>
                <ICONS.Plus size='16px' />
              </button>
              <button
                className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg'
                onClick={() => console.log(JSON.stringify(objEmpleado, null, 2))}>
                <ICONS.Alert size='16px' />
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