'use client'
import { useEffect, useState } from 'react'

function CircleBG() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hiddenCircles, setHiddenCircles] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      
      const progress = Math.min((scrollTop / (documentHeight - windowHeight)) * 100, 100)
      setScrollProgress(progress)
      
    
      let hidden = 0
      if (progress > 10) hidden = 1
      if (progress > 20) hidden = 2
      if (progress > 30) hidden = 3
      
      setHiddenCircles(hidden)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <div className="flex left-1/2 -translate-x-1/2 z-0  absolute w-screen overflow-hidden h-screen max-h-[700px] ">

    
      <div 
        className={`w-[900px] h-[900px] xl:w-[1280px] xl:h-[1280px] absolute top-4 translate-y-5 left-1/2 -translate-x-1/2 aspect-square rounded-full border border-[#dad9d9] transition-opacity duration-200 ${
          hiddenCircles >= 1 ? 'opacity-0' : 'opacity-100'
        }`}
      />

     
      <div 
        className={`w-[740px] h-[740px] xl:w-[1080px] xl:h-[1080px] translate-y-28 top-4 xl:translate-y-28 absolute left-1/2 -translate-x-1/2 aspect-square rounded-full border border-[#dad9d9] transition-opacity duration-200 ${
          hiddenCircles >= 2 ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div 
        className={`w-[558px] h-[558px] xl:w-[864px] xl:h-[864px] translate-y-52 top-4 absolute left-1/2 -translate-x-1/2 aspect-square rounded-full border border-[#dad9d9] transition-opacity duration-200 ${
          hiddenCircles >= 3 ? 'opacity-0' : 'opacity-100'
        }`}
      />

     
     <div className=" h-[80vh] w-[30vw] lg:h-[65vw] lg:w-[20vw] -top-10 lg:-top-44  bg-white/80 blur-2xl md:blur-3xl z-50 absolute left-1/2 -translate-x-1/2 aspect-square" />


    </div>
    
    </>
  )
}

export default CircleBG
