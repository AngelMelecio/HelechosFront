
import { ICONS } from '../constants/icons'

const AppBar = () => {

    const Tab = ({ Icon = null, content }) => {
        return (
            <div className="text-white 
                relative w-full flex flex-row py-3 font-bold text-sm 
                touchable-opacity items-center
                duration-200 hover:bg-teal-500 cursor-pointer">
                <p className='w-14 total-center'>
                    {Icon && <Icon size='20px'/>}
                </p>
                <p className='absolute ml-14 appbar-content align-center flex'>
                    {content}
                </p>
            </div>
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
                    <Tab content={'PEDIDOS'} Icon={ICONS.Diablito} />
                    <Tab content={'MODELOS'} Icon={ICONS.Cloth} />
                    <Tab content={'CLIENTES'} Icon={ICONS.HandShake} />
                    <Tab content={'EMPLEADOS'} Icon={ICONS.Worker} />
                    <Tab content={'MAQUINAS'} Icon={ICONS.Machine} />
                    <Tab content={'PROVEDORES'} Icon={ICONS.Truck} />
                    <Tab content={'PRODUCCION'} Icon={ICONS.Boot} />
                </div>
            </div>
        </>
    )
}

export default AppBar