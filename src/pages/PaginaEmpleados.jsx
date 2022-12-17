import React, { useRef, useState } from 'react'
import { useEffect } from 'react'


const apiEmpleadosUrl = 'http://127.0.0.1:8000/api/empleados/'

const PaginaEmpleados = () => {

    const columns = [
        { name: '' },
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



    const screenRef = useRef();
    const modalRef = useRef();
    const someSelectedRef = useRef();

    const [saving, setSaving] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [objEmpleado, setObjEmpleado] = useState({
        idEmpleado: "",
        nombre: "",
        apellidos: "",
        direccion: "",
        telefono: "",
        correo: "",
        ns: "",
        usuario: "",
        contrasena: "",
        fotografia: "asdf",
        departamento: "",
        tipo: ""
    });

    const [selectedIndex, setSelectedIndex] = useState([])

    const [listaEmpleados, setListaEmpleados] = useState([])

    useEffect(async () => {
        await getEmpleados()
    }, [])


    const getEmpleados = async () => {
        await fetch(apiEmpleadosUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => { console.log(data); setListaEmpleados(data) })
    }

    const handleModalVisibility = (show) => {
        setModalVisible(show)
        screenRef.current.style.filter = show ? "blur(2px)" : 'none'
    }

    const handleChange = (e) => {
        setObjEmpleado({ ...objEmpleado, [e.target.name]: e.target.value })
    }

    const saveEmpleado = async (e) => {
        e.preventDefault()

        setSaving(true)

        let id = 'E' + Date.now()
        let send = { ...objEmpleado, idEmpleado: id }

        await fetch(apiEmpleadosUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(send)
        })
            .then(response => response.json())
            .then(data => console.log(data))

        await getEmpleados()
        setSaving(false)
        handleModalVisibility(false)
    }

    const handleSelection = (e) => {

        let selected = false
        listaEmpleados.forEach( (e,i) =>{
            let inp = document.getElementById( 'S'+i )
            if( inp.checked ){
                selected = true
                
            }    
        } )

        someSelectedRef.current.checked = selected
        someSelectedRef.current.disabled = !selected

    }
    const unSelecAll = () =>{
        listaEmpleados.forEach( (e,i) =>{
            let inp = document.getElementById( 'S'+i )
            inp.checked = false 
        } )
        someSelectedRef.current.disabled = true
    }

    const handleSelectImage = (e) =>{
        e.preventDefault()
    }

    const CustomRow = ({ element, index }) => {
        const { nombre, apellidos, direccion, ns, telefono, correo, departamento, usuario, contrasena } = element
        return (
            <>
                <td className='p-0'>
                    <input id={'S'+index} type="checkbox" onChange={handleSelection} />
                </td>
                <td className='m-2'>
                    {nombre}
                </td>
                <td className='m-2'>
                    {apellidos}
                </td>
                <td className='m-2'>
                    {direccion}
                </td>
                <td className='m-2'>
                    {ns}
                </td>
                <td className='m-2'>
                    {telefono}
                </td>
                <td className='m-2'>
                    {correo}
                </td>
                <td className='m-2'>
                    {departamento}
                </td>
                <td className='m-2'>
                    {usuario}
                </td>
                <td className='m-2'>
                    {contrasena}
                </td>
            </>
        )
    }

    return (
        <div className='h-screen'>
            {modalVisible ?
                <div ref={modalRef} id="modal" className='z-10 flex absolute left-0 h-screen w-full grayTrans items-center justify-center'>
                    <div className='w-full m-40 p-5 rounded-lg bg-white shadow-md' >
                        <div className="flex flex-row justify-between items-center">
                            <p className='font-bold text-teal-900 text-2xl' >Nuevo Empleado</p>
                            <button
                                className='bg-rose-500 text-white rounded-sm w-10 h-10'
                                onClick={() => handleModalVisibility(false)}
                            >X</button>
                        </div>
                        <form className='form' onSubmit={saveEmpleado} >
                            <div className='flex flex-col w-full items-center justify-center'>
                                <div className="flex mb-2 items-center justify-center foto text-center">
                                    { /* Imagen */}
                                </div>
                                <button onClick={handleSelectImage} className='bg-teal-500 p-2 text-white normalButton'>
                                    Seleccionar
                                </button>
                            </div>
                            <div className='flex mt-2 mb-2'>
                                <div id="col1" className='w-full  p-2' >
                                    <p className='text-teal-900'>Nombres</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.nombre}
                                        name='nombre'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Apellidos</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.apellidos}
                                        name='apellidos'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Dirección</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.direccion}
                                        name='direccion'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Seguro Social</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.ns}
                                        name='ns'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Teléfono</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.telefono}
                                        name='telefono'
                                        className='w-full p-1 outline-none bg-gray-100'
                                        type="number" />
                                </div>
                                <div id="col2" className='w-full  p-2' >
                                    <p className='text-teal-900'>Correo</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.correo}
                                        name='correo'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Departamento</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.departamento}
                                        name='departamento'
                                        className='w-full  p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Tipo</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.tipo}
                                        name='tipo'
                                        className='w-full  p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Usuario</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.usuario}
                                        name='usuario'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                    <p className='text-teal-900'>Contaseña</p>
                                    <input
                                        required
                                        onChange={handleChange}
                                        value={objEmpleado.contrasena}
                                        name='contrasena'
                                        className='w-full   p-1 outline-none bg-gray-100'
                                        type="text" />
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <input
                                    className='bg-teal-500 p-2 text-white normalButton'
                                    type="submit"
                                    value="Guardar"
                                />

                            </div>
                        </form>
                    </div>
                </div>
                : null
            }
            <div ref={screenRef} className="customTable flex">
                <div className="flex flex-col bg-white w-full m-2 p-2 rounded-lg">
                    <div className="flex items-center">
                        <div className='pl-4 pr-4'>
                            <input  onChange={unSelecAll} ref={someSelectedRef} type="checkbox" disabled/>
                        </div>
                        <div className='pl-4 pr-4'>
                            <button>X</button>
                        </div>
                        <button
                            className='bg-teal-500 w-20 p-1 text-white font-bold normalButton rounded-sm'
                            onClick={() => handleModalVisibility(true)}
                        >Agregar</button>
                    </div>
                    <div className="flex w-full overflow-scroll">
                        <table className="table-auto border-collapse:collapse ">
                            <thead className='text-center'>
                                <tr>
                                    {
                                        columns.map((c, i) =>
                                            <th key={"C" + i} >
                                                {c.name}
                                            </th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listaEmpleados.map((e, i) =>
                                        <tr key={"E" + i}>
                                            <CustomRow element={e} index={i} />
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