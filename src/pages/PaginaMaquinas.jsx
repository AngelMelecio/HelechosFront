import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import DatePickerField from '../components/DatePickerField'
import { useFormik } from 'formik'
import "react-datepicker/dist/react-datepicker.css";


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

    const { allMaquinas , maquinasColumns} = useApp()
    const [listaMaquinas, setListaMaquinas ] = useState([])


    return (
        <div className="flex flex-col w-full h-full bg-white ">
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