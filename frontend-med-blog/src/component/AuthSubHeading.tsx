import Link from 'next/link'
import React from 'react'

interface TypeSub {
  label: string
  span: string
  href: string
}

function AuthSubHeading({label, span, href}: TypeSub) {
  return (
    <Link href={href}>
      <h3 className='text-[16px]'>{label} <span className='font-semibold'>{span}</span></h3>
      </Link>
  )
}

export default AuthSubHeading