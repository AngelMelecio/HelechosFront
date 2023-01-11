import AppBar from "./components/AppBar"
import Table from "./components/Table"
import { AppProvider, useApp } from "./context/AppContext"
import PaginaEmpleados from "./pages/PaginaEmpleados"
import { Route, Routes } from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"
import { AdminProvider, useAdmin } from "./context/AdminContext"

const Main = () => {

  const navigate = useNavigate()

  const { user } = useApp()



  return (
    <div className="flex w-screen relative h-screen overflow-hidden  ">
      {user ?
        <>
          <AdminProvider>
            <div className="flex w-18 realtive overflow-hidden">
              <AppBar />
            </div>
            <div id='page' className="flex w-full h-screen relative ">

              <div className="flex absolute w-full h-full ">
                  <Routes>
                    <Route path="/empleados" element={<PaginaEmpleados />} />
                    <Route path="/maquinas" element={<PaginaMaquinas />} />
                  </Routes>
              </div>
            </div>
          </AdminProvider>
        </>
        :
        <>
          <Routes>
            <Route path="/" element={<Login navigate={navigate} />} />
          </Routes>
        </>
      }
    </div>

  )
}
export default Main