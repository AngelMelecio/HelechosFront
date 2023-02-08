import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const PaginaPerfil = () => {

    const { session } = useAuth()
    const [user, setUser] = useState(() => session.usuario)


    return (
        <div className="flex flex-col w-full overflow-scroll">
            <div className="flex  w-full h-1/5 my-5 justify-center items-center">
                <div className="bg-gray-200 w-28 h-28 rounded-full">
                </div>
            </div>
            <p className="text-center text-lg font-medium text-gray-700 italic">
                {user.nombre} {user.apellidos}
            </p>
            <div className="w-full p-5">
                <div className="flex flex-row items-center w-full py-2 text-gray-700 border-b-2 border-gray-200 ">
                    <p className="mr-3 font-normal text-sm">
                        Nombre:
                    </p>
                    <p className="font-medium">
                        {user.nombre}
                    </p>
                </div>
                <div className="flex flex-row items-center w-full py-2 text-gray-700 border-b-2 border-gray-200 ">
                    <p className="mr-3 font-normal text-sm">
                        Apellidos:
                    </p>
                    <p className="font-medium">
                        {user.apellidos}
                    </p>
                </div>
                <div className="flex flex-row items-center w-full py-2 text-gray-700 border-b-2 border-gray-200 ">
                    <p className="mr-3 font-normal text-sm">
                        Correo:
                    </p>
                    <p className="font-medium">
                        {user.correo}
                    </p>
                </div>
                <div className="flex flex-row items-center w-full py-2 text-gray-700 border-b-2 border-gray-200 ">
                    <p className="mr-3 font-normal text-sm">
                        Usuario:
                    </p>
                    <p className="font-medium">
                        {user.usuario}
                    </p>
                </div>
                <div className="flex flex-row items-center w-full py-2 text-gray-700 border-b-2 border-gray-200 ">
                    <p className="mr-3 font-normal text-sm">
                        Tipo:
                    </p>
                    <p className="font-medium">
                        { user.is_staff ? 'Administrador' : 'Encargado' } 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PaginaPerfil