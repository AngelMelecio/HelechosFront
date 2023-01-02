import { useState } from "react"
import Table from "../components/Table"
import { useApp } from "../context/AppContext"

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
                //onAdd={() => handleModalVisibility(true, true)}
                //onDelete={() => { handleModalDeleteVisibility(true) }}
                //onEdit={handleEdit}
            />
        </div>
    )
}
export default PaginaMaquinas