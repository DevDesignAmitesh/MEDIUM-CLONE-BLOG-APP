import React from 'react'

interface TypeLabel {
  label: string
}

function AuthHeading({label}: TypeLabel) {
  return (
    <h1 className='text-3xl font-bold'>{label}</h1>
  )
}

export default AuthHeading