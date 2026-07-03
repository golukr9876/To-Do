import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    required=true,
    ...props
}, ref){
    const id = useId()
    return (
        <div className='relative'>
            {label && <label 
            className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1' 
            htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            }
            <input
            type={type}
            className={`w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-400 ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input