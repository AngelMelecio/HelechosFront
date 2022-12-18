import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import loginImg from '../imgs/helechos.png'

export default function Login() {

    return (
        <Formik
            initialValues={{ usuario: '', contrasena: '' }}
            validationSchema={
                Yup.object({
                usuario: Yup.string()
                    .required('Ingresa tu usuario'),
                contrasena: Yup.string()
                    .required('Ingresa tu contraseña')
                })
            }
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
            }}
        >
            <div className='w-full flex justify-center px-4 md:px-0 relative'>


                <Form className='max-w-[600px] w-full mx-auto rounded-lg bg-emerald-400  p-8 px-8 mt-12'>
                    <h2 className='text-4xl text-emerald-800 font-bold text-center'>Inicia Sesión</h2>
                    <div className='flex justify-center mt-4'>
                        <img className='w-2/5 h-2/5 object-cover' src={loginImg} alt="" />
                    </div>
                    <div className='flex flex-col text-emerald-800 font-bold py-2 my-7'>
                        <label>Usuario *</label>
                        <Field className='rounded-lg bg-emerald-200	 mt-2 p-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white'
                            type="text"
                            name='usuario'
                        />
                        <div className='text-red-600'>
                            <ErrorMessage name="usuario" />
                        </div>
                    </div>
                    

                    <div className='flex flex-col text-emerald-800 font-bold py-2'>
                        <label>Contraseña</label>
                        <Field className='p-2 rounded-lg bg-emerald-200	 mt-2 focus:border-emerald-800 focus:bg-emerald-600 focus:outline-none focus:text-white'
                            type="password"
                            name='contrasena'
                        />
                        <div className='text-red-600'>
                            <ErrorMessage name="contrasena" />
                        </div>
                        
                    </div>
                    

                    <button className='w-full my-5 py-2 bg-teal-600 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Ingresar</button>
                </Form>
            </div>

        </Formik>
    )
}