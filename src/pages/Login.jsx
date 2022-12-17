import React from 'react'

import loginImg from '../imgs/helechos.png'

export default function Login() {
    return (
        <div className='w-full flex justify-center px-4 md:px-0'>
            <div className='bg-green-700 flex flex-col justify-center mt-12'>
                <form className='max-w-[600px] w-full mx-auto rounded-lg bg-emerald-400  p-8 px-8'>
                    <h2 className='text-4xl text-emerald-800 font-bold text-center'>Inicia Sesión</h2>
                    <div className='flex justify-center mt-4'>
                        <img className='w-2/5 h-2/5 object-cover' src={loginImg} alt="" />
                    </div>
                    <div className='flex flex-col text-emerald-800 font-bold py-2 my-7'>
                        <label>Usuario</label>
                        <input className='rounded-lg bg-emerald-200	 mt-2 p-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white' type="text" />
                    </div>
                    <div className='flex flex-col text-emerald-800 font-bold py-2'>
                        <label>Contraseña</label>
                        <input className='p-2 rounded-lg bg-emerald-200	 mt-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white' type="password" />
                    </div>
                    <button className='w-full my-5 py-2 bg-teal-600 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Ingresar</button>
                </form>
            </div>
            <div className='bg-emerald-800'>

            </div>
        </div>
    )
}