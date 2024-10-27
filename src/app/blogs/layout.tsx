"use client"

import { useRouter } from "next/navigation";
import React from "react";

export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  const router = useRouter()
  
  const token = localStorage.getItem("token")

  if(token){
    return <div>{children}</div>
  } else{
    router.push("/")
  }
}
