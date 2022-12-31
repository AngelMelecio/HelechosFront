
const Input = ({ label, type, name, value, onChange, Icon = null ,onBlur,errores}) => {

    let p = Icon != null ? 'pl-9' : ''
    let cn_good = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 " + p;
    let cn_bad = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-red-600 border-red-600 " + p;
    
    return(
        <div className="flex flex-col w-full mx-2">
            <p className='text-teal-800 font-medium'>{label}</p>
            <div className="total-center relative">
                <input 
                     type={type}
                     name={name}
                     value={value}
                     onChange={onChange}
                     className={errores?cn_bad:cn_good}
                     onBlur={onBlur}
                /> 
                { Icon!=null ? 
                    <Icon 
                        className='absolute left-2'
                        style={{color:'#374151'}}
                        size='20px'
                        /> : null}
            </div>
            {errores? <div className='text-red-600'>{errores}</div> : null}
        </div>
    )
}   
export default Input