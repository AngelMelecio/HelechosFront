import AppBar from "./components/AppBar"
import Table from "./components/Table"
import { AppProvider, useApp } from "./context/AppContext"
import PaginaEmpleados from "./pages/PaginaEmpleados"

const Main = () => {

  const { allEmpleados, empleadosColumns, isFetching } = useApp()

  if (isFetching) return (<></>)

  return (
    <div className="flex w-screen relative h-screen">
      <div className="flex w-14 realtive">
        <AppBar />
      </div>
      <div id='page' className="flex w-full relative">
        <div className="flex absolute w-full">
          <div className='flex w-full h-screen bg-slate-200' >
            {/* <PaginaEmpleados /> */}
            {<Table
              columns={empleadosColumns}
              items={allEmpleados}
            />}  
          </div>
        </div>
      </div>
    </div>
  )
}
export default Main