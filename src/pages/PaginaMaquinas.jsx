
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import DatePickerField from '../components/DatePickerField'
import { useFormik } from 'formik'


import { ICONS } from '../constants/icons'
import CustomSelect from '../components/CustomSelect'
import Table from '../components/Table'
import { useAdmin } from '../context/AdminContext'

const apiMaquinasUrl = 'http://127.0.0.1:8000/api/maquinas/'

const initobj = {
  idMaquina: "",
  numero: "",
  linea: "0",
  marca: "",
  modelo: "",
  ns: "",
  fechaAdquisicion: "",
  otros: "",
  departamento: "Seleccione"
}

const PaginaMaquinas = () => {

  const modalRef = useRef()
  const modalBoxRef = useRef()

  const [objMaquina, setObjMaquina] = useState(initobj);

  const [saving, setSaving] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [modalDeleteVisible, setModalDeleteVisible] = useState()

  const { fetchingMaquinas, allMaquinas, maquinasColumns, getMaquinas } = useAdmin()
  const [listaMaquinas, setListaMaquinas] = useState([])

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
  const optionsLinea = [
    { value: '0', label: 'Ninguna' },
    { value: '1', label: 'Línea 1' },
    { value: '2', label: 'Línea 2' },
    { value: '3', label: 'Línea 3' }
  ]

  //Validaciones
  const validate = values => {
    const errors = {};

    if (!values.numero) {
      errors.numero = 'Asigna un número a la máquina';
    }

    if (!values.marca) {
      errors.marca = 'Ingresa la marca';
    }

    if (!values.modelo) {
      errors.modelo = 'Ingresa el modelo';
    }

    if (!values.ns) {
      errors.ns = 'Ingresa el número de serie';
    }

    if (!values.fechaAdquisicion) {
      errors.fechaAdquisicion = 'Ingresa la fecha de adquisición';
    }

    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } else if (values.departamento === "Seleccione") {
      errors.departamento = 'Selecciona un departamento';
    }

    return errors;
  };
  //Declaración
  const formik = useFormik({
    initialValues: initobj,
    validate,
    onSubmit: values => {
      saveMaquina(values);
    },
  });

  const saveMaquina = async (values) => {

    setSaving(true)

    let formData = new FormData()
    formData.append('numero', values.numero)
    formData.append('linea', values.linea)
    formData.append('marca', values.marca)
    formData.append('modelo', values.modelo)
    formData.append('ns', values.ns)
    formData.append('fechaAdquisicion', values.fechaAdquisicion)
    formData.append('otros', values.otros)
    formData.append('departamento', values.departamento)

    if (!isEdit) {
      //Creacion de un nueva maquina 
      await fetch(apiMaquinasUrl, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => alert(data.message))

    } else {
      //Actualizando los datos de la maquina
      await fetch(apiMaquinasUrl + objMaquina.idMaquina, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(data => alert(data.message))
    }
    
    setListaMaquinas(await getMaquinas())
    setObjMaquina(initobj)
    setSaving(false)
    handleModalVisibility(false, false)
  }

  const deleteMaquinas = async () => {
    listaMaquinas.forEach(async (e) => {
      if (e.isSelected) {
        await fetch(apiMaquinasUrl + e.idMaquina, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => alert('Maquinas Eliminadas:', data))
      }
    })
    setListaMaquinas( await getMaquinas() )
    setModalDeleteVisible(false)
  }

  const handleModalVisibility = async (show, edit) => {

    if (show) document.getElementById("form-modal-maquinas").classList.add('visible')
    else document.getElementById("form-modal-maquinas").classList.remove('visible')

    if (!show) formik.resetForm()

    setModalVisible(show)
    setIsEdit(edit)

    if (!edit) setObjMaquina(initobj)


  }


  const handleModalDeleteVisibility = (visible) => {
    //if (!someSelectedRef.current.checked) return
    if (visible) document.getElementById('delete-modal-maquina').classList.add('visible')
    else document.getElementById('delete-modal-maquina').classList.remove('visible')
    setModalDeleteVisible(visible)
  }

  const handleEdit = async (mac) => {

    //alert(JSON.stringify(mac,null,2))
    formik.setValues(mac)
    handleModalVisibility(true, true)
    setIsEdit(true)
    setObjMaquina(mac)
  }




  return (
    <div className='h-full w-full'>
      {
        //modalDeleteVisible ?
        <DeleteModal
          onCancel={() => handleModalDeleteVisibility(false)}
          onConfirm={deleteMaquinas}
          elements={listaMaquinas}
          message='Las siguientes maquinas se eliminarán permanentemente:'
        />
        //  : null
      }
      {
        //modalVisible ?
        <div ref={modalRef} id="form-modal-maquinas"
          className='modal z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
          <div ref={modalBoxRef} className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
            <div className='w-full flex h-full flex-col '>
              <div className="z-10 py-2 px-4 flex w-full shadow-md ">
                <div className="flex flex-row w-full total-center relative h-10">
                  {isEdit
                    ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                    : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                  }
                  <p className='font-semibold text-teal-800 text-2xl' >
                    {isEdit ? 'Editar Maquina' : 'Nueva Maquina'}
                  </p>
                  <input
                    disabled={saving}
                    className='bg-teal-500 p-1 w-40 text-white normalButton absolute right-0 rounded-lg'
                    type="submit"
                    value={isEdit ? "GUARDAR" : "AGREGAR"}
                    form="frmMaquinas"
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
                  id='frmMaquinas'
                  className='flex flex-col h-full w-full relative overflow-y-scroll'
                  onSubmit={formik.handleSubmit}>
                  <div className="absolute w-full flex flex-col  px-4">
                    <div className='flex flex-row w-full h-full p-2 total-center'>
                      <div className="flex relative w-full items-center justify-center foto text-center">
                        { /* Imagen de la maquina ---*/}

                        <img
                          className='object-cover foto'
                          url='../imgs/sewing-machine.png'
                          alt='' />

                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS MAQUINA
                        </div>
                      </div>
                      <div className='flex flex-row'>

                        <CustomSelect
                          name='Línea'
                          className='input'
                          onChange={value => formik.setFieldValue('linea', value.value)}
                          value={formik.values.linea}
                          onBlur={formik.handleBlur}
                          options={optionsLinea}
                          label='Línea'
                        />
                        <Input
                          label='Número' type='number' name='numero' value={formik.values.numero}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.numero && formik.touched.numero ? formik.errors.numero : null}
                        />

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
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Marca' type='text' name='marca' value={formik.values.marca}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.marca && formik.touched.marca ? formik.errors.marca : null}
                        />
                        <Input
                          label='Modelo' type='text' name='modelo' value={formik.values.modelo}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.modelo && formik.touched.modelo ? formik.errors.modelo : null}
                        />
                        <Input
                          label='Número de serie' type='text' name='ns' value={formik.values.ns}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.ns && formik.touched.ns ? formik.errors.ns : null}
                        />
                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          INFORMACIÓN EXTRA
                        </div>
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Otros' type='text' name='otros' value={formik.values.otros}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.otros && formik.touched.otros ? formik.errors.otros : null}
                        />
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Fecha de adquisición' type='text' name='fechaAdquisicion' value={formik.values.fechaAdquisicion}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.fechaAdquisicion && formik.touched.fechaAdquisicion ? formik.errors.fechaAdquisicion : null}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        //: null
      }

      <Table
        allItems={allMaquinas}
        visibleItems={listaMaquinas}
        setVisibleItems={setListaMaquinas}
        columns={maquinasColumns}
        onAdd={() => handleModalVisibility(true, false)}
        onDelete={() => { handleModalDeleteVisibility(true) }}
        onEdit={handleEdit}
      />

    </div>
  )
}
export default PaginaMaquinas