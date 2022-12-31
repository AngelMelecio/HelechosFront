import AppBar from "./components/AppBar"
import Table from "./components/Table"
import { AppProvider, useApp } from "./context/AppContext"
import PaginaEmpleados from "./pages/PaginaEmpleados"
import {Route, Routes} from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"


const Main = () => {

  const { allEmpleados, empleadosColumns, isFetching } = useApp()

  if (isFetching) return (<></>)

  return (
    <div className="flex w-screen relative h-screen overflow-hidden">
      <div className="flex w-14 realtive">
        <AppBar />
      </div>
      <div id='page' className="flex w-full relative">
        <div className="flex absolute w-full">
          <div className='flex w-full h-screen bg-slate-200' >
            <Routes>
              <Route path="/" element={ <PaginaEmpleados/> }/>
              <Route path="/maquinas" element={ <PaginaMaquinas/> }/>
              {/* <PaginaEmpleados />*/ }
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Main