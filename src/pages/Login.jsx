import React from 'react'

import loginImg from '../imgs/threads.jpg'

export default function Login() {
    return (
        <div className='w-full flex justify-center px-4 md:px-0'>
            <div className='bg-green-700 flex flex-col justify-center'>
                <form className='max-w-[600px] w-full mx-auto rounded-lg bg-emerald-400  p-8 px-8'>
                    <h2 className='text-4xl text-emerald-800 font-bold text-center'>Inicia Sesión</h2>
                    <div className='flex flex-col text-emerald-800 py-2 my-7'>
                        <label>Usuario</label>
                        <input className='rounded-lg bg-emerald-200	 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" />
                    </div>
                    <div className='flex flex-col text-emerald-800 py-2'>
                        <label>Contraseña</label>
                        <input className='p-2 rounded-lg bg-emerald-200	 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="password" />
                    </div>
                    <button className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Entrar</button>
                </form>
            </div>
            <div className='bg-emerald-400 '>

            </div>
        </div>
    )
}