"use client"
import React from 'react'
import {Bot} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function GoTONexusBtn() {
    const pathname = usePathname();
  return (
    <>
  <Link href='/nexus' title='Chat with Nexus' className={`bg-black z-50 hover:text-white transition-all duration-500 dark:hover:text-white fixed bottom-10 right-7 dark:bg-gray-100 text-white dark:text-black px-4 py-4 rounded-full hover:bg-[#ff7b00] dark:hover:bg-[#ff7b00] ` + (pathname === '/nexus' ? 'hidden' : '')}>
    <Bot  />
    

  </Link>
  </>
  )
}

export default GoTONexusBtn
