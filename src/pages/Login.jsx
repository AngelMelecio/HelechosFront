import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import loginImg from '../imgs/logo.png'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const apiLoginUrl = "http://127.0.0.1:8000/login/"

export default function Login({navigate}) {

  const {setUser} = useApp()
  
  const{Login} = useAuth()

  const handleLogin = async(values) =>{
    Login(values)
    values = {...values, usuario:values.usuario.trim()}
    const response = await fetch( apiLoginUrl, {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(values)
    } )    
    let res = await response.json()
    
    let tokens = {token:res.token, refreshToken:res['refresh-token'] }
    console.log( tokens )

    if( res.error ){
      alert(res.error)
      return
    }

    if( !res.usuario.is_active ){
      alert("Usuario no Activo")
      return
    }

    alert( res.message )
    if( response.status === 200 ){
        localStorage.setItem('auth', JSON.stringify(res.usuario))
        setUser(res.usuario)
        navigate('/')
    }
  }

  return (
    <Formik
      initialValues={{ usuario: '', password: '' }}
      validationSchema={
        Yup.object({
          usuario: Yup.string()
            .required('Ingresa tu usuario'),
          password: Yup.string()
            .required('Ingresa tu contraseña')
        })
      }
      onSubmit={ (values, { setSubmitting }) => {

        Login(values)
        setSubmitting(false)
        /*setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
          setUser(true)
        }, 400);*/
      }}
    >
      <div className='w-full h-screen flex total-center px-4 md:px-0 relative bg-login'>
        <div className="flex relative max-w-[500px] w-full h-5/6 mx-auto">
          <div className="login-box-shadow">
          </div>
          <Form id='login-box' className=' rounded-lg p-4 w-full overflow-y-scroll'>
            <h2 className='text-2xl  text-teal-700 font-bold text-center'>Inicia Sesión</h2>
            <div className='flex justify-center mt-4'>
              <img className='w-32 h-32 object-cover' src={loginImg} alt="" />
            </div>
            <div className='flex flex-col text-gay-900 font-medium h-24'>
              <label className='text-slate-800 pl-1 pb-1'>Usuario *</label>
              <Field className='rounded-md bg-gray-200 bg-teal-20  p-2 border-2 border-teal-50 focus:border-teal-600 text-gray-800 duration-100 focus:outline-none'
                type="text"
                name='usuario'
              />
              <div className='text-rose-400 font-normal italic'>
                <ErrorMessage name="usuario" />
              </div>
            </div>

            <div className='flex flex-col text-gay-900 font-medium h-24'>
              <label className='text-slate-800 pl-1 pb-1'>Contraseña</label>
              <Field className='rounded-md bg-gray-200  bg-teal-20 p-2  border-2 border-teal-50 focus:border-teal-600 text-gray-800 duration-100 focus:outline-none'
                type="password"
                name='password'
              />
              <div className='text-rose-400 font-normal italic'>
                <ErrorMessage name="password" />
              </div>

            </div>
            <button 

              className='w-full my-5 py-2 bg-teal-600 shadow-lg  hover:shadow-teal-600 hover:bg-slate-700 duration-200 text-white text-lg font-semibold rounded-lg touchable-opacity'>
              INGRESAR
              </button>
          </Form>
        </div>
      </div>
    </Formik>
  )
}