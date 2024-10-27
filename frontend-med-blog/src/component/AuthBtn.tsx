import React from 'react'

interface TypesBtn {
  label: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  className: string
  
}

function AuthBtn({label, onClick, className}: TypesBtn) {
  return (
    <button onClick={onClick} className={className}>{label}</button>
  )
}

export default AuthBtn