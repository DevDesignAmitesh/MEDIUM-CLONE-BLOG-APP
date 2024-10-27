import React from 'react'

interface TypeInput {
  label: string,
  placeholder: string,
  type: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  value: string,
  className: string,
}

function AuthInput({label, placeholder, type, onChange, value, className}: TypeInput) {
  return (
    <div className='flex flex-col gap-2'>
        {label && <label className='font-semibold'>{label}</label>}
        <input onChange={onChange} value={value} className={className} type={type} placeholder={placeholder} />
      </div>
  )
}

export default AuthInput