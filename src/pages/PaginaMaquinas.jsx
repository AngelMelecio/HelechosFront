import { useState } from "react"
import Table from "../components/Table"
import { useAdmin } from "../context/AdminContext"

const PaginaMaquinas = () => {

    const {fetchingMaquinas, allMaquinas , maquinasColumns} = useAdmin()
    const [listaMaquinas, setListaMaquinas ] = useState([])

    if( fetchingMaquinas ){
        console.log('fetchingM')
        return <></>
    }
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