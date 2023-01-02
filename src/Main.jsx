import AppBar from "./components/AppBar"
import Table from "./components/Table"
import { AppProvider, useApp } from "./context/AppContext"
import PaginaEmpleados from "./pages/PaginaEmpleados"
import { Route, Routes } from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"

const Main = () => {

  const { isFetching, user } = useApp()
  const navigate = useNavigate()
  if( isFetching )return <></>

  return (
    <div className="flex w-screen relative h-screen overflow-hidden ">
      {user ?
        <>
          <div className="flex w-14 realtive">
            <AppBar />
          </div>
          <div id='page' className="flex w-full relative">
            <div className="flex absolute w-full">
              <div className='flex w-full h-screen bg-slate-200' >
                <Routes>
                  <Route path="/empleados" element={<PaginaEmpleados />} />
                  <Route path="/maquinas" element={<PaginaMaquinas />} />
                </Routes>
              </div>
            </div>
          </div>
        </>
        :
        <>
          <Routes>
            <Route path="/" element={<Login navigate={navigate}/>} />
          </Routes>
        </>
      }
    </div>

  )
}
export default Main