import React from 'react'

const PaginaEmpleados = () => {

    const columns = [{ name: 'id' }, { name: 'nombre' }, { name: 'extra' }]

    const dummyEmpleados = [
        { id: 'asdas', name: "juan", extra: 'es jooto' },
        { id: '123sd', name: "jose", extra: 'No es jooto' },
        { id: 'ads21', name: "aksdj", extra: 'tambien es jooto' },
    ]

    function RenderTable() {
        return (
            <>

            </>

        )
    }

    const CustomRow = ({element}) => {
        const {id,name,extra} = element
        
        console.log( id,name,extra )
        return (
            <>
                <td className='b'>
                    {id}
                </td>
                <td className='m-2'>
                    {name}
                </td>
                <td className='m-2'>
                    {extra}
                </td>
            </>
        )
    }

    return (
        <div id='tabla' className="customTable flex">
            <div className="flex bg-white w-full m-2 p-2 rounded-lg">
                <table className="table-auto border-collapse:collapse text-center ">
                    <thead>
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
                            dummyEmpleados.map((e, i) =>
                                <tr key={"E"+i}>
                                    <CustomRow element={ e } />
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default PaginaEmpleados