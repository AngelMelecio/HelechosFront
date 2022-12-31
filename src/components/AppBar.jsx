import { Link, resolvePath, useMatch, useResolvedPath } from 'react-router-dom'

import { ICONS } from '../constants/icons'

const AppBar = () => {

    const Tab = ({ to, Icon = null, content }) => {
        const resolvePath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvePath.pathname, end: true })
        let activeStyles = isActive ? `bg-teal-700 hover:bg-teal-700` : ``
        return (
            <Link to={to} 
            className={`text-white relative w-full flex flex-row py-3 
            font-bold text-sm touchable-opacity duration-200
            items-center hover:bg-teal-500 cursor-pointer ` + activeStyles}>
                <p className='w-14 total-center'>
                    {Icon && <Icon size='20px' />}
                </p>
                <p className='absolute ml-14 appbar-content align-center flex'>
                    {content}
                </p>
            </Link>
        )
    }

    return (
        <>
            {/*<div className='w-14'></div> */}
            <div id='appbar' className="z-20 flex flex-col absolute h-screen w-14 bg-teal-600 duration-300 ease-in-out hover:w-60" >
                <div className="appbar-content flex w-full justify-center mt-5 ">
                    <img className="w-24 h-24" src="http://127.0.0.1:8000/media/images/helechos.PNG" alt="" />
                </div>
                <div id="tabs" className="mt-10">
                    <Tab to={'/pedidos'} content={'PEDIDOS'} Icon={ICONS.Diablito} />
                    <Tab to={'/modelos'} content={'MODELOS'} Icon={ICONS.Cloth} />
                    <Tab to={'/clientes'} content={'CLIENTES'} Icon={ICONS.HandShake} />
                    <Tab to={'/'} content={'EMPLEADOS'} Icon={ICONS.Worker} />
                    <Tab to={'/maquinas'} content={'MAQUINAS'} Icon={ICONS.Machine} />
                    <Tab to={'/provedores'} content={'PROVEDORES'} Icon={ICONS.Truck} />
                    <Tab to={'/produccion'} content={'PRODUCCION'} Icon={ICONS.Boot} />
                </div>
            </div>
        </>
    )
}

export default AppBar