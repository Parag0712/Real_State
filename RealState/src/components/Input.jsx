import React, { forwardRef, useId } from 'react'

const Input = React.forwardRef(
    function Input({
        type = "text",
        placeholder = "PlaceHolder",
        error = "",
        ...props
    }, ref) {
        const id = useId();
        return (
            <>
                <input
                    id={id}
                    placeholder={placeholder}
                    className='border p-3 rounded-lg'
                    type={type}
                    ref={ref}
                    {...props}
                />
                <span className='p-0 m-0 text-red-500 '>{error}</span>
            </>
        )
    }
)

export default Input
