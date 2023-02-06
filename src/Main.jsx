import AppBar from "./components/AppBar"
import Table from "./components/Table"
import { AppProvider, useApp } from "./context/AppContext"
import PaginaEmpleados from "./pages/PaginaEmpleados"
import { Route, Routes, Navigate } from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"
import { AdminProvider, useAdmin } from "./context/AdminContext"
import PaginaUsuarios from "./pages/PaginaUsuarios"
import { useAuth } from "./context/AuthContext"

const Main = () => {

  const navigate = useNavigate()

  const { session } = useAuth()

  return (
    <div className="flex w-screen relative h-screen overflow-hidden  ">
      {session ?
        <>
          <AdminProvider>
            <div className="flex w-18 realtive overflow-hidden">
              <AppBar />
            </div>
            <div id='page' className="flex w-full h-screen relative ">

              <div className="flex absolute w-full h-full ">
                  <Routes>
                    <Route exact path="*" element={ <Navigate replace to="/empleados"/> }/>
                    <Route path="/usuarios" element={<PaginaUsuarios />} />
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
            <Route exact path="*" element={ <Navigate replace to="/login"/> }/>
            <Route path="/login" element={<Login navigate={navigate} />} />
          </Routes>
        </>
      }
    </div>

  )
}
export default Main