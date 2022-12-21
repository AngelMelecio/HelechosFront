
const Input = ({label,type,name,value,onChange,required, Icon=null }) =>{

    let p = Icon != null ? 'pl-9' : ''
    return(
        <div className="flex flex-col w-full mx-2 mt-2">
            <p className='text-teal-900'>{label}</p>
            <div className="total-center relative">
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={"flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 "+ p}
                    required={required}
                />  
                { Icon!=null ? 
                    <Icon 
                        className='absolute left-2'
                        style={{color:'#374151'}}
                        size='20px'
                        /> : null}
            </div>
        </div>
    )
}   
export default Input