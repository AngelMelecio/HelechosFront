import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import SelectorMaquinas from '../components/SelectorMaquinas'
import { useFormik } from 'formik'

import { ICONS } from '../constants/icons'
import CustomSelect from '../components/CustomSelect'
import Table from '../components/Table'
import { useApp } from '../context/AppContext'
import { AiOutlineConsoleSql } from 'react-icons/ai'

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
  departamento: "Seleccione",
  tipo: "Seleccione"
}

const initErrors ={}

const PaginaEmpleados = () => {

  const modalRef = useRef()
  const modalBoxRef = useRef()

  const [objEmpleado, setObjEmpleado] = useState(initobj);

  const [saving, setSaving] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [modalDeleteVisible, setModalDeleteVisible] = useState()

  const { allMaquinas, empleadosColumns, getEmpleados } = useApp()
  //const [allEmpleados, setAllEmpleados] = useState([])
  const [allEmpleados, setAllEmpleados] = useState([])
  const [listaEmpleados, setListaEmpleados] = useState([])

  const [availableMaquinas, setAvailableMaquinas] = useState([])
  const [assignedMaquinas, setAssignedMaquinas] = useState([])

  const [shown, setShown] = React.useState(false);
  const switchShown = () => setShown(!shown);

  useEffect( async() => {
    setAllEmpleados(await getEmpleados())
    setListaEmpleados(await getEmpleados())
  }, [])

  //Formik

  //Options select
  const optionsDepartamento = [
    { value: 'Seleccione', label: 'Seleccione' },
    { value: 'Tejido', label: 'Tejido' },
    { value: 'Corte', label: 'Corte' },
    { value: 'Plancha', label: 'Plancha' },
    { value: 'Empaque', label: 'Empaque' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Diseno', label: 'Diseño' },
    { value: 'Gerencia', label: 'Gerencia' }
  ]

  const optionsTipo = [
    { value: 'Seleccione', label: 'Seleccione' },
    { value: 'Trabajador', label: 'Trabajador' },
    { value: 'Encargado', label: 'Encargado' },
    { value: 'Administrador', label: 'Administrador' },
  ]

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
    } else if (values.telefono.toString().length !== 10) {
      errors.telefono = 'Ingresa solo 10 digitos';
    }

    if (!values.correo) {
      errors.correo = 'Ingresa el correo';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
      errors.correo = 'Correo invalido';
    }

    if (!values.ns) {
      errors.ns = 'Ingresa el NSS';
    } else if (values.ns.toString().length !== 11) {
      errors.ns = 'NSS incorrecto';
    }

    if ((values.tipo === "Encargado" || values.tipo === "Administrador") && !values.usuario) {
      errors.usuario = 'Ingresa un usuario';
    } else if ((values.tipo === "Encargado" || values.tipo === "Administrador") && (values.usuario.length < 4 || values.usuario.length > 20)) {
      errors.usuario = 'El usuario debe tener una longitud entre 4 y 20 caracteres';
    }

    if ((values.tipo === "Encargado" || values.tipo === "Administrador") && !values.contrasena) {
      errors.contrasena = 'Ingresa una contraseña';
    } else if ((values.tipo === "Encargado" || values.tipo === "Administrador") && (values.contrasena.length < 8 || values.contrasena.length > 15)) {
      errors.contrasena = 'La contraseña debe tener una longitud entre 8 y 15 caracteres';
    }
    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } else if (values.departamento === "Seleccione") {
      errors.departamento = 'Selecciona un departamento';
    }
    if (!values.tipo) {
      errors.tipo = 'Selecciona un tipo';
    } else if (values.tipo === "Seleccione") {
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

  const saveEmpleado = async (values) => {

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
    if ((objEmpleado.fotografia) instanceof File)
      formData.append('fotografia', objEmpleado.fotografia)
    formData.append('departamento', values.departamento)
    formData.append('tipo', values.tipo)

    if (!isEdit) {
      //    Creacion de un Nuevo Empleado 
      let response = await fetch(apiEmpleadosUrl, {
        method: 'POST',
        body: formData
      })
      
      if( values.tipo === 'Trabajador' ){
          //    Espero la respuesta para obtener el nuevo Id 
          console.log(response.json())
          const { message, empleado } = await response.json()
          //    Asigno Cada una de las Maquinas 
          assignedMaquinas.forEach(async (AM) => {
            await newRelation(empleado.idEmpleado, AM.idMaquina)
          })
          alert(message)
      }
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
      await removeRelationEM(values.idEmpleado)

      //    Creando las nuevas relaciones
      assignedMaquinas.forEach(async (am) => {
        await newRelation(values.idEmpleado, am.idMaquina)
      })

    }

    setListaEmpleados( await getEmpleados() )
    setObjEmpleado(initobj)
    setSaving(false)
    handleModalVisibility(false,false)
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
    getEmpleados()
    setModalDeleteVisible(false)
  }

  const handleModalVisibility = async ( show, edit ) => {
    
    if( show ) document.getElementById("form-modal").classList.add('visible')
    else document.getElementById("form-modal").classList.remove('visible')

    if (!show) formik.resetForm()
    
    setModalVisible(show)
    setIsEdit(edit)

    if( !edit ){
      setObjEmpleado(initobj)
      if (show) {
        setAvailableMaquinas(allMaquinas)
        setAssignedMaquinas([])
      }
    }

  }

  const handleSelectImage = (e) => {
    setObjEmpleado({ ...objEmpleado, fotografia: e.target.files[0]})
  }

  const handleModalDeleteVisibility = (visible) => {
    //if (!someSelectedRef.current.checked) return
    if( visible ) document.getElementById('delete-modal').classList.add('visible')
    else document.getElementById('delete-modal').classList.remove('visible')
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

    //alert(JSON.stringify(emp,null,2))
    formik.setValues(emp)
    handleModalVisibility(true, true)
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

  return (
    <div className='h-full w-full'>
      {
        //modalDeleteVisible ?
          <DeleteModal
            onCancel={() => handleModalDeleteVisibility(false)}
            onConfirm={deleteEmpleados}
            elements={listaEmpleados}
            message='Los siguientes empleados se eliminarán permanentemente:'
          />
        //  : null
      }
      {
        //modalVisible ?
          <div ref={modalRef} id="form-modal" name="form-modal"
            className='modal z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
            <div  ref={modalBoxRef} className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
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
                    <input
                      disabled={saving}
                      className='bg-teal-500 p-1 w-40 text-white normalButton absolute right-0 rounded-lg'
                      type="submit"
                      value={isEdit ? "GUARDAR" : "AGREGAR"}
                      form="frmEmpleados"
                    />
                    <button
                      className='total center rose-opacity bg-rose-500 p-1 text-white rounded-lg  absolute left-0 '
                      onClick={() => handleModalVisibility(false, false)}
                    >
                      <ICONS.Cancel className='m-0' size='25px' />
                    </button>
                  </div>
                </div>
                <div className="flex w-full h-full ">
                  <form
                    id='frmEmpleados'
                    className='flex flex-col h-full w-full relative overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute w-full flex flex-col  px-4">
                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="flex relative w-full items-center justify-center foto text-center">
                          { /* Imagen del Empleado */}
                          {(toUrl(objEmpleado?.fotografia)!== null)?<img
                            className='object-cover foto'
                            src={toUrl(objEmpleado?.fotografia)}
                            alt='' />:null}
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
                            label='Nombre(s)' type='text' name='nombre' value={formik.values.nombre}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null} />

                          <Input
                            label='Apellido(s)' type='text' name='apellidos' value={formik.values.apellidos}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.apellidos && formik.touched.apellidos ? formik.errors.apellidos : null}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <Input
                            label='Dirección' type='text' name='direccion' value={formik.values.direccion}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                            Icon={ICONS.House}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <Input
                            label='Seguro Social' type='number' name='ns' value={formik.values.ns}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.ns && formik.touched.ns ? formik.errors.ns : null}
                            Icon={ICONS.Add}
                          />
                          <Input
                            label='Teléfono' type='number' name='telefono' value={formik.values.telefono}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                            Icon={ICONS.Phone}
                          />
                          <Input
                            label='Correo' type='text' name='correo' value={formik.values.correo}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.correo && formik.touched.correo ? formik.errors.correo : null}
                            Icon={ICONS.Email}
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

                          <CustomSelect
                            name='Departamento'
                            className='input'
                            onChange={value => formik.setFieldValue('departamento', value.value)}
                            value={formik.values.departamento}
                            onBlur={formik.handleBlur}
                            options={optionsDepartamento}
                            label='Departamento'
                            errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}
                          />
                          <CustomSelect
                            name='Tipo'
                            className='input'
                            onChange={value => formik.setFieldValue('tipo', value.value)}
                            value={formik.values.tipo}
                            onBlur={formik.handleBlur}
                            options={optionsTipo}
                            label='Tipo'
                            errores={formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : null}
                          />
                        </div>
                        {(formik.values.tipo === "Encargado" || formik.values.tipo === "Administrador") ?
                          <div className='flex flex-row'>
                            <Input
                              label='Usuario' type='text' name='usuario' value={formik.values.usuario}
                              onChange={formik.handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.usuario && formik.touched.usuario ? formik.errors.usuario : null}
                              Icon={ICONS.User}
                            />
                            <Input
                              label='Contaseña' type='password' name='contrasena' value={formik.values.contrasena}
                              onChange={formik.handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.contrasena && formik.touched.contrasena ? formik.errors.contrasena : null}
                              Icon={ICONS.Key}
                            />
                          </div> : null}
                      </div>
                      {(formik.values.tipo === "Trabajador") ?
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
                        </div> : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        //: null
      }

      <Table
        allItems={allEmpleados}
        visibleItems={listaEmpleados}
        setVisibleItems={setListaEmpleados}
        columns={empleadosColumns}
        onAdd={() => handleModalVisibility(true, false)}
        onDelete={() => { handleModalDeleteVisibility(true) }}
        onEdit={handleEdit}
      />

    </div>
  )
}
export default PaginaEmpleados