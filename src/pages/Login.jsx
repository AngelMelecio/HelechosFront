import React from 'react'
import { useFormik, Field } from 'formik'
import * as Yup from 'yup'

import loginImg from '../imgs/helechos.png'

export default function Login() {

    const formik = useFormik({
        initialValues: {
            usuario: "",
            contrasenia: ""
        },
        validationSchema: Yup.object({
            usuario: Yup.string()
              .max(15, 'Tu usuario debe tener 10 caracteres o menos')
              .required('Ingresa tu usuario'),
            contrasenia: Yup.string()
              .min(8, 'Tu contraseña debe tener al menos 8 caracteres')
              .required('Ingresa tu contraseña')
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        }
    });

   

    return (
        <div className='w-full flex justify-center px-4 md:px-0 relative'>


            <form className='max-w-[600px] w-full mx-auto rounded-lg bg-emerald-400  p-8 px-8 mt-12' onSubmit={formik.handleSubmit}>
                <h2 className='text-4xl text-emerald-800 font-bold text-center'>Inicia Sesión</h2>
                <div className='flex justify-center mt-4'>
                    <img className='w-2/5 h-2/5 object-cover' src={loginImg} alt="" />
                </div>
                <div className='flex flex-col text-emerald-800 font-bold py-2 my-7'>
                    <label>Usuario</label>
                    <input className='rounded-lg bg-emerald-200	 mt-2 p-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white'
                        type="text"
                        id='usuario'
                        name='usuario'
                        onChange={formik.handleChange}
                        value={formik.values.usuario}
                        onBlur={formik.handleBlur}
                    />
                </div>
                {formik.errors.usuario ? <div>{formik.errors.usuario}</div> : null}

                <div className='flex flex-col text-emerald-800 font-bold py-2'>
                    <label>Contraseña</label>
                    <Field  className='p-2 rounded-lg bg-emerald-200	 mt-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white'
                        type="password"
                        name='contrasenia'
                    />
                </div>
                {formik.errors.contrasenia ? <div>{formik.errors.contrasenia}</div> : null}

                <button className='w-full my-5 py-2 bg-teal-600 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Ingresar</button>
            </form>


        </div>
    )
}